import React, {
  useState,
  useMemo,
  useContext,
  Children,
  isValidElement,
  cloneElement,
  // useEffect,
} from "react";

import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";
import { saveMealsTracking } from "./data";

/* ------------------------------------------------------------------
   ACCORDION
------------------------------------------------------------------ */
const AccordionContext = React.createContext(null);

function Accordion({ type = "multiple", defaultValue = [], children, className }) {
  const initial = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  const [openItems, setOpenItems] = useState(initial);

  const toggleItem = (value) => {
    setOpenItems((prev) => {
      if (type === "single") return prev[0] === value ? [] : [value];
      return prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value];
    });
  };

  const isItemOpen = (value) => openItems.includes(value);

  return (
    <AccordionContext.Provider value={{ toggleItem, isItemOpen }}>
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

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------ */
export default function MealPlanMonitoringCards({
  sections = [],
  cardDate,
  selectedFoods = {},
  achievedFocus = [],
  onSelectionChange = () => {},
  isPending = false,
  allFocusItems = [],
  allFocus = [],
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [notFollowed, setNotFollowed] = useState(false);
  const [notFollowedReason, setNotFollowedReason] = useState("All of the above");

  const datePrefix = cardDate || "day";

  /* ======================================================================
      PROCESS SECTIONS
  ====================================================================== */
  const processedSections = useMemo(() => {
    return (sections || []).map((sec) => {
      const items = (sec.items || []).map((item) => {
        const key = `${datePrefix}-${sec.mealTypeId}-${item.itemId}`;

        const planned = item.plannedQty ?? item.qty ?? 0;
        const consumed = isPending
          ? selectedFoods[key] ?? planned
          : item.consumedQty ?? 0;

        return {
          ...item,
          plannedQty: planned,
          consumedQty: consumed,
          _key: key,
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

  /* --- Total Calories --- */
  const totalPlannedKcal = useMemo(
    () =>
      processedSections.reduce((sum, s) => sum + s.sectionPlannedKcal, 0),
    [processedSections]
  );

  const totalConsumedKcal = useMemo(
    () =>
      processedSections.reduce((sum, s) => sum + s.sectionConsumedKcal, 0),
    [processedSections]
  );

  /* ======================================================================
      FOCUS TAGS
  ====================================================================== */
  const focusSuggestions = useMemo(() => {
    const itemIds = new Set(
      processedSections.flatMap((sec) => sec.items.map((it) => it.itemId))
    );

    const focusIdSet = new Set(
      allFocusItems.filter((fi) => itemIds.has(fi.itemId)).map((fi) => fi.focusId)
    );

    let list = allFocus.filter((f) => focusIdSet.has(f.id));

    if (list.length === 0 && allFocusItems.length > 0) {
      const seen = new Set();
      list = allFocusItems
        .filter((fi) => itemIds.has(fi.itemId))
        .filter((fi) => !seen.has(fi.focusName) && seen.add(fi.focusName))
        .map((fi) => ({ id: fi.focusId, label: fi.focusName }));
    }

    return list;
  }, [processedSections, allFocusItems, allFocus]);

  /* ======================================================================
      UPDATE QTY
  ====================================================================== */
  const updateQty = (mealTypeId, itemId, delta) => {
    if (!isPending) return;

    onSelectionChange((prev) => {
      const key = `${datePrefix}-${mealTypeId}-${itemId}`;
      const sec = processedSections.find((s) => s.mealTypeId === mealTypeId);
      const it = sec?.items.find((x) => x.itemId === itemId);

      const baseline = it?.plannedQty ?? 0;
      const current = prev[key] ?? baseline;
      const next = Math.max(0, current + delta);

      return { ...prev, [key]: next };
    });
  };

  /* ======================================================================
      SAVE MEALS TRACKING
  ====================================================================== */
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const payload = [];

      processedSections.forEach((sec) => {
        sec.items.forEach((item) => {
          const key = `${datePrefix}-${sec.mealTypeId}-${item.itemId}`;

          const consumedQty = selectedFoods[key] ?? item.plannedQty;

          payload.push({
            date: cardDate,
            mealTypeId: sec.mealTypeId,
            nutritionalItemId: item.itemId,
            plannedQty: item.plannedQty,
            consumedQty,
            otherName: item.itemId === 0 ? item.title : null,
            otherCaloriesQuantity: item.itemId === 0 ? item.kcal : 0,
          });
        });
      });

      console.log("TRACKING PAYLOAD:", payload);

      await saveMealsTracking(1, 1, payload);

      setMessage({ type: "success", text: "Meal tracking saved" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save tracking" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  /* ======================================================================
      UI
  ====================================================================== */
  return (
    <div className="flex items-center justify-center min-h-[620px] w-full relative overflow-hidden font-sans bg-[#EFFCEC]">
      <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="bg-[#558365] px-4 py-3 text-center text-white font-bold text-lg">
          {cardDate} — {isPending ? "Pending feedback" : "Today's meal feedback"}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">

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
            defaultValue={sections?.length > 0 ? [String(sections[0].mealTypeId)] : []}
            className="space-y-4"
          >
            {processedSections.map((section) => (
              <AccordionItem
                key={section.mealTypeId}
                value={String(section.mealTypeId)}
                className="border-b border-gray-100"
              >
                <AccordionButton className="flex w-full items-center justify-between py-2">
                  {({ open }) => (
                    <>
                      <div>
                        <div className="text-[#1A4255] font-bold text-base">{section.mealTypeName}</div>
                        <div className="text-xs text-gray-500">{section.time}</div>
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
                            "mt-1 h-5 w-5 text-gray-400 transition-transform",
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
                      <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-[10px] font-semibold uppercase px-1 mb-1 text-[#4D32FF]">
                        <div></div>
                        <div className="text-center w-12">Planned</div>
                        <div className="text-center w-20">Consumed</div>
                      </div>
                    )}

                    {/* ITEMS */}
                    {section.items.map((item) => (
                      <div
                        key={item.itemId}
                        className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center"
                      >
                        <img
                          src={item.itemImage}
                          alt={item.title}
                          className="h-14 w-14 rounded-xl object-cover border border-gray-100"
                        />

                        <div>
                          <span className="font-bold text-[#1A4255] text-sm">{item.title}</span>
                          <span className="text-[11px] text-gray-500 block">
                            {item.kcal} kcal • {item.unit}
                          </span>
                        </div>

                        <div className="text-center w-12 text-gray-600 text-sm">
                          {item.plannedQty}
                        </div>

                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(section.mealTypeId, item.itemId, -1)}
                              className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-gray-500"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>

                            <span className="w-4 text-center text-sm font-semibold text-gray-700">
                              {item.consumedQty}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQty(section.mealTypeId, item.itemId, 1)}
                              className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-[#1A4255]"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center w-16 text-gray-800 text-sm">
                            {item.consumedQty}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Extra Dish Placeholder */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 hover:bg-gray-50"
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

          {/* Not Followed */}
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

          <div className="text-xs text-[#4D32FF]">
            All nutritional values are referred by ICMR.
          </div>

          {/* Calories Summary */}
          <div>
            <h3 className="text-[#1A4255] font-bold text-sm mb-3">
              Total achieved meal goal for the day
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-[#D0F4DE]/30 p-3 text-center">
                <div className="text-xs font-bold bg-green-200/50 py-1 rounded mb-2 text-[#1A4255]">
                  Suggested calories
                </div>
                <div className="text-2xl font-medium text-[#6D5DFF]">
                  {totalPlannedKcal} kcal
                </div>
              </div>

              <div className="rounded-lg border bg-[#D0F4DE]/30 p-3 text-center">
                <div className="text-xs font-bold bg-green-200/50 py-1 rounded mb-2 text-[#1A4255]">
                  New calculated calories
                </div>
                <div className="text-2xl font-medium text-[#6D5DFF]">
                  {totalConsumedKcal} kcal
                </div>
              </div>
            </div>
          </div>

          {/* Focus */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-[#4D32FF]">Focus tags for this meal plan:</p>

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
                <span className="text-xs text-gray-600">No focus tags found</span>
              )}
            </div>
          </div>

          {/* Achieved Focus */}
          {!isPending && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">
                Based on what you ate today, you achieved:
              </p>

              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                {achievedFocus.length > 0 ? (
                  achievedFocus.map((f) => <li key={f.id}>{f.label}</li>)
                ) : (
                  <li>No focus achieved yet</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Save Buttons */}
        {isPending && (
          <div className="p-4 pt-2 flex gap-3 bg-white border-t">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded bg-[#8FB494] text-white font-semibold py-3 text-sm hover:bg-[#7da382] disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save new plan"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded bg-[#BBFFCC] text-[#1A4255] font-semibold py-3 text-sm hover:bg-[#a8eeb9] disabled:opacity-70"
            >
              No changes in plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
