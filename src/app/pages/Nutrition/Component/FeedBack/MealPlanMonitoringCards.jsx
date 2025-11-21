import React, {
  useState,
  useMemo,
  useContext,
  Children,
  isValidElement,
  cloneElement,
} from "react";

import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { saveMealPlan, editMealPlan } from "../MainTab/Daily/data";

// -----------------------------------------------------------------------------
// clsx helper
// -----------------------------------------------------------------------------
function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// -----------------------------------------------------------------------------
// Accordion
// -----------------------------------------------------------------------------
const AccordionContext = React.createContext(null);

function Accordion({ type = "multiple", defaultValue = [], children, className }) {
  const initial = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  const [openItems, setOpenItems] = useState(initial);

  const toggleItem = (value) => {
    setOpenItems((prev) => {
      if (type === "single") {
        return prev[0] === value ? [] : [value];
      }
      return prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value];
    });
  };

  const isItemOpen = (value) => openItems.includes(value);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, isItemOpen }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, children, className }) {
  return (
    <div className={className} data-value={value}>
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, { value }) : child
      )}
    </div>
  );
}

function AccordionButton({ value, children, className }) {
  const { toggleItem, isItemOpen } = useContext(AccordionContext);
  const open = isItemOpen(value);

  return (
    <button
      type="button"
      className={className}
      onClick={() => toggleItem(value)}
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
    >
      {typeof children === "function" ? children({ open }) : children}
    </button>
  );
}

function AccordionPanel({ value, children, className }) {
  const { isItemOpen } = useContext(AccordionContext);
  if (!isItemOpen(value)) return null;
  return <div className={className}>{children}</div>;
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function MealPlanMonitoringCards({
  sections = [],
  cardDate,                     // string like "2025-11-21"
  selectedFoods = {},          // { "<date>-<mealTypeId>-<itemId>": consumedQty }
  achievedFocus = [],          // from backend (for today card)
  onSelectionChange = () => { },
  isPending = false,           // false => today (read-only), true => pending (editable)
  allFocusItems = [],          // [{ id, focusId, itemId, focusName, itemName }]
  allFocus = [],               // [{ id, label }]
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [notFollowed, setNotFollowed] = useState(false);
  const [notFollowedReason, setNotFollowedReason] =
    useState("All of the above");

  const datePrefix = cardDate || "day";

  // ---------------------------------------------------------------------------
  // Build sections with planned & consumed quantities
  // ---------------------------------------------------------------------------
  const processedSections = useMemo(() => {
    return (sections || []).map((sec) => {
      const items = (sec.items || []).map((item) => {
        const baseKey = `${datePrefix}-${sec.mealTypeId}-${item.itemId}`;
        const planned = item.plannedQty ?? item.qty ?? 0;

        let consumed;
        if (isPending) {
          // For pending days: editable, default = planned, overridden by selectedFoods
          const userValue = selectedFoods[baseKey];
          consumed = userValue != null ? userValue : planned;
        } else {
          // Today card: READ-ONLY — always show backend consumed
          consumed = item.consumedQty ?? 0;
        }

        return {
          ...item,
          plannedQty: planned,
          consumedQty: consumed,
          _key: baseKey,
        };
      });

      const sectionPlannedKcal = items.reduce(
        (sum, f) => sum + (f.kcal || 0) * (f.plannedQty || 0),
        0
      );

      const sectionConsumedKcal = items.reduce(
        (sum, f) => sum + (f.kcal || 0) * (f.consumedQty || 0),
        0
      );

      return {
        ...sec,
        items,
        sectionPlannedKcal,
        sectionConsumedKcal,
      };
    });
  }, [sections, selectedFoods, isPending, datePrefix]);

  const totalPlannedKcal = useMemo(
    () =>
      processedSections.reduce(
        (sum, s) => sum + (s.sectionPlannedKcal || 0),
        0
      ),
    [processedSections]
  );

  const totalConsumedKcal = useMemo(
    () =>
      processedSections.reduce(
        (sum, s) => sum + (s.sectionConsumedKcal || 0),
        0
      ),
    [processedSections]
  );

  // ---------------------------------------------------------------------------
  // Focus suggestions based on ITEMS in this card
  // ---------------------------------------------------------------------------
  const focusSuggestions = useMemo(() => {
    const itemIds = new Set(
      processedSections.flatMap((sec) => sec.items.map((it) => it.itemId))
    );

    // Find all focusIds linked to these items
    const focusIdSet = new Set(
      allFocusItems
        .filter((fi) => itemIds.has(fi.itemId))
        .map((fi) => fi.focusId)
    );

    let suggestions = allFocus.filter((f) => focusIdSet.has(f.id));

    // Fallback if allFocus is empty: derive from allFocusItems
    if (suggestions.length === 0 && allFocusItems.length > 0) {
      const nameSeen = new Set();
      suggestions = allFocusItems
        .filter((fi) => itemIds.has(fi.itemId))
        .filter((fi) => {
          if (!fi.focusName) return false;
          if (nameSeen.has(fi.focusName)) return false;
          nameSeen.add(fi.focusName);
          return true;
        })
        .map((fi) => ({ id: fi.focusId, label: fi.focusName }));
    }

    return suggestions;
  }, [processedSections, allFocusItems, allFocus]);

  // ---------------------------------------------------------------------------
  // Qty Update — editable ONLY for pending cards
  // ---------------------------------------------------------------------------
  const updateQty = (mealTypeId, itemId, delta) => {
    if (!isPending) return; // today = read-only

    onSelectionChange((prev) => {
      const prevMap = prev || {};
      const key = `${datePrefix}-${mealTypeId}-${itemId}`;

      // Find baseline planned qty
      let baseline = 0;
      const sec = processedSections.find((s) => s.mealTypeId === mealTypeId);
      const it = sec?.items.find((x) => x.itemId === itemId);
      if (it) baseline = it.plannedQty || 0;

      const current = prevMap[key] != null ? prevMap[key] : baseline;
      const next = Math.max(0, current + delta);

      return { ...prevMap, [key]: next };
    });
  };

  // ---------------------------------------------------------------------------
  // Save / Edit — wired for pending cards only (today is read-only)
  // ---------------------------------------------------------------------------
  const handleSave = async (isEdit) => {
    if (!isPending) return; // no saving for today card here

    try {
      setSaving(true);
      setMessage(null);

      const api = isEdit ? editMealPlan : saveMealPlan;
      const res = await api(selectedFoods);

      if (res?.data?.statusCode >= 200 && res?.data?.statusCode <= 299) {
        setMessage({
          type: "success",
          text: isEdit ? "Plan updated!" : "Plan saved!",
        });
      } else {
        setMessage({
          type: "error",
          text: res?.data?.message ?? "Something went wrong",
        });
      }
    } catch (err) {
      console.error("Save monitoring error:", err);
      setMessage({ type: "error", text: "Request failed" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg mx-auto mt-10">
      {/* HEADER */}
      <div className="bg-[#558365] px-4 py-3 text-center text-white font-bold text-lg shadow-sm">
        {cardDate} — {isPending ? "Pending feedback" : "Today’s meal feedback"}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
        {/* Status Message */}
        {message && (
          <div
            className={clsx(
              "p-2 rounded text-sm",
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {message.text}
          </div>
        )}

        {/* ACCORDION */}
        <Accordion
          type="multiple"
          defaultValue={
            sections?.length > 0
              ? [String(sections[0].mealTypeId)]
              : []
          }
          className="space-y-4"
        >
          {processedSections.map((section) => (
            <AccordionItem
              key={section.mealTypeId}
              value={String(section.mealTypeId)}
              className="border-b border-gray-100 last:border-0"
            >
              <AccordionButton className="flex w-full items-center justify-between py-2 group">
                {({ open }) => (
                  <>
                    <div>
                      <div className="text-[#1A4255] font-bold text-base">
                        {section.mealTypeName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {section.time}
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-xs">
                      <span className="text-[#4D32FF] font-semibold">
                        {section.sectionConsumedKcal} kcal
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Consumed • Planned {section.sectionPlannedKcal} kcal
                      </span>
                      <ChevronDownIcon
                        className={clsx(
                          "mt-1 h-5 w-5 text-gray-400 transition-transform duration-200",
                          open && "rotate-180"
                        )}
                      />
                    </div>
                  </>
                )}
              </AccordionButton>

              <AccordionPanel className="pt-2 pb-4">
                <div className="space-y-6">
                  {section.items.length > 0 && (
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-[10px] font-semibold text-[#4D32FF] uppercase px-1 mb-1">
                      <div></div>
                      <div className="text-center w-12">Planned</div>
                      <div className="text-center w-20">Consumed</div>
                    </div>
                  )}

                  {section.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center"
                    >
                      <img
                        src={item.itemImage}
                        alt={item.title}
                        className="h-14 w-14 rounded-xl object-cover shadow-sm border border-gray-100"
                      />

                      <div>
                        <span className="font-bold text-[#1A4255] text-sm">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          {item.kcal} kcal · {item.unit}
                        </span>
                      </div>

                      <div className="text-center w-12 text-gray-600 font-medium text-sm">
                        {item.plannedQty}
                      </div>

                      {/* Consumed column */}
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(section.mealTypeId, item.itemId, -1)
                            }
                            className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>

                          <span className="w-4 text-center text-sm font-semibold text-gray-700">
                            {item.consumedQty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQty(section.mealTypeId, item.itemId, 1)
                            }
                            className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-[#1A4255] hover:bg-gray-50"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center w-16 text-gray-800 font-semibold text-sm">
                          {item.consumedQty}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add extra dish (visible on all cards for now) */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#1A4255]">
                      <PlusIcon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-semibold text-[#1A4255]">
                      Add extra dish or modifications
                      <div className="text-gray-500 text-xs">
                        to your meal from the list
                      </div>
                    </div>
                  </button>
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <hr className="border-gray-200" />

        {/* NOT FOLLOWED */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#558365]"
              checked={notFollowed}
              onChange={(e) => setNotFollowed(e.target.checked)}
            />
            <span className="text-sm text-[#d9534f] font-medium">
              I havent followed the meal as per NeuroPi meal plan.
            </span>
          </label>

          <select
            disabled={!notFollowed}
            value={notFollowedReason}
            onChange={(e) => setNotFollowedReason(e.target.value)}
            className={clsx(
              "w-full max-w-[260px] text-sm border rounded-md py-2 px-3",
              !notFollowed
                ? "bg-gray-50 text-gray-400"
                : "bg-white text-gray-700 border-gray-300"
            )}
          >
            <option>All of the above</option>
            <option>Not hungry</option>
            <option>Ate outside</option>
            <option>Forgot about the plan</option>
          </select>
        </div>

        {/* DISCLAIMER */}
        <div className="text-xs text-[#4D32FF]">
          All nutritional values are referred by ICMR.
        </div>

        {/* TOTALS */}
        <div>
          <h3 className="text-[#1A4255] font-bold text-sm mb-3">
            Total achieved meal goal for the day
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-200 bg-[#D0F4DE]/30 p-3 text-center">
              <div className="text-xs font-bold text-[#1A4255] bg-green-200/50 py-1 rounded mb-2">
                Suggested calories
              </div>
              <div className="text-2xl font-medium text-[#6D5DFF]">
                {totalPlannedKcal} kcal
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-[#D0F4DE]/30 p-3 text-center">
              <div className="text-xs font-bold text-[#1A4255] bg-green-200/50 py-1 rounded mb-2">
                New calculated calories
              </div>
              <div className="text-2xl font-medium text-[#6D5DFF]">
                {totalConsumedKcal} kcal
              </div>
            </div>
          </div>
        </div>

        {/* FOCUS TAGS BASED ON PLAN */}
        <div className="space-y-2">
          <p className="text-sm font-bold text-[#4D32FF]">
            Focus tags for this meal plan:
          </p>

          <div className="flex flex-wrap gap-2">
            {focusSuggestions.length > 0 ? (
              focusSuggestions.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center rounded-full border border-[#8FB494] bg-[#EFFCEC] px-3 py-1 text-[11px] font-medium text-[#1A4255]"
                >
                  {f.label}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-600">
                No specific focus tags found for this selection yet.
              </span>
            )}
          </div>
        </div>

        {/* ACHIEVED FOCUS (TODAY ONLY) */}
        {!isPending && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-600">
              Based on what you ate today, you achieved:
            </p>

            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 ml-1">
              {achievedFocus.length > 0 ? (
                achievedFocus.map((f) => <li key={f.id}>{f.label}</li>)
              ) : (
                <li>No focus achieved yet for today.</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* FOOTER — for PENDING CARDS ONLY (editable) */}
      {isPending && (
        <div className="p-4 pt-2 flex gap-3 bg-white border-t border-gray-50">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex-1 rounded shadow-sm bg-[#8FB494] text-white font-semibold py-3 text-sm hover:bg-[#7da382] disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save new plan"}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-1 rounded shadow-sm bg-[#BBFFCC] text-[#1A4255] font-semibold py-3 text-sm hover:bg-[#a8eeb9] disabled:opacity-70"
          >
            No changes in plan
          </button>
        </div>
      )}
    </div>
  );
}
