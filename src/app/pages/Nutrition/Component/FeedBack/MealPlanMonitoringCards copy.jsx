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
import {
  mealWindows as defaultMealWindows,
  foods as defaultFoods,
  focusTags as defaultFocusTags,
} from "./data";

/* -------------------------------------------------------------
   Simple clsx helper
------------------------------------------------------------- */
function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------
   Accordion (Option B — Advanced: smooth toggle, multi/single)
------------------------------------------------------------- */
const AccordionContext = React.createContext(null);

function Accordion({ type = "multiple", defaultValue = [], children, className }) {
  const [openItems, setOpenItems] = useState(() =>
    Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  );

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

/* -------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------- */

function MealPlanMonitoringCards({
  foods = defaultFoods,
  mealWindows = defaultMealWindows,
  focusTags = defaultFocusTags,
  selectedFoods = {},
  onSelectionChange,
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [notFollowed, setNotFollowed] = useState(false);
  const [notFollowedReason, setNotFollowedReason] =
    useState("All of the above");

  /* ------------------------------------------------------------
      1️⃣ Data Processing
  ------------------------------------------------------------ */
  const selectedList = useMemo(() => {
    const list = [];
    for (const [key, qty] of Object.entries(selectedFoods || {})) {
      if (qty <= 0) continue;
      const [mealId, foodId] = key.split("-").map(Number);
      const food = foods.find((f) => f.id === foodId);
      const meal = mealWindows.find((m) => m.id === mealId);
      if (!food || !meal) continue;

      list.push({ ...food, qty, mealId });
    }
    return list;
  }, [selectedFoods, foods, mealWindows]);

  const groupedBySection = useMemo(() => {
    return mealWindows.map((section) => {
      const items = selectedList.filter((f) => f.mealId === section.id);
      const sectionKcal = items.reduce(
        (sum, f) => sum + (f.kcal || 0) * f.qty,
        0
      );
      return { ...section, items, sectionKcal };
    });
  }, [selectedList, mealWindows]);

  const totalKcal = groupedBySection.reduce(
    (sum, sec) => sum + sec.sectionKcal,
    0
  );

  const suggestedKcal = 316;

  const achievedFocuses = useMemo(() => {
    const focusIds = new Set(selectedList.flatMap((f) => f.focus ?? []));
    return focusTags.filter((t) => focusIds.has(t.id));
  }, [selectedList, focusTags]);

  /* ------------------------------------------------------------
      2️⃣ Handlers
  ------------------------------------------------------------ */
  const updateQty = (mealId, foodId, delta) => {
    if (!onSelectionChange) return;
    onSelectionChange((prev) => {
      const key = `${mealId}-${foodId}`;
      const next = Math.max(0, (prev[key] || 0) + delta);
      return { ...prev, [key]: next };
    });
  };

  const handleSaveAction = async (isEdit) => {
    try {
      setSaving(true);
      setMessage(null);

      const api = isEdit ? editMealPlan : saveMealPlan;
      const res = await api(selectedFoods);

      if (res?.data?.statusCode === 200 || res?.data?.statusCode === 201) {
        setMessage({
          type: "success",
          text: isEdit ? "Plan updated!" : "Plan saved!",
        });
      } else {
        setMessage({
          type: "error",
          text: res?.data?.message ?? "Error occurred",
        });
      }
    } catch (error) {
      console.log("Save/Edit Meal Plan Error:", error);
      setMessage({ type: "error", text: "Failed to process request." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  /* ------------------------------------------------------------
      UI RENDER (unchanged look & feel)
  ------------------------------------------------------------ */
  return (
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg font-sans mx-auto mt-10">
      <div className="bg-[#558365] px-4 py-3 text-center text-white font-bold text-lg shadow-sm">
        17 Oct 2025 - Your Meal Plan
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
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
          defaultValue={[mealWindows?.[0]?.id?.toString()]}
          className="space-y-4"
        >
          {groupedBySection.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id.toString()}
              className="border-b border-gray-100 last:border-0"
            >
              <AccordionButton className="flex w-full items-center justify-between py-2 group">
                {({ open }) => (
                  <>
                    <div>
                      <div className="text-[#1A4255] font-bold text-base">
                        {section.title}
                      </div>
                      {section.time && (
                        <div className="text-xs text-gray-500">{section.time}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[#4D32FF] font-medium text-sm">
                      {section.sectionKcal} kcal
                      <ChevronDownIcon
                        className={clsx(
                          "h-5 w-5 text-gray-400 transition-transform duration-200",
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
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-[10px] font-semibold text-[#4D32FF] uppercase px-1">
                      <div></div>
                      <div className="text-center w-12">Suggested</div>
                      <div className="text-center w-20">Modifications</div>
                    </div>
                  )}

                  {section.items.map((f) => (
                    <div
                      key={`${section.id}-${f.id}`}
                      className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center"
                    >
                      <img
                        src={f.itemImage}
                        alt={f.title}
                        className="h-14 w-14 rounded-xl object-cover shadow-sm border border-gray-100"
                      />

                      <div>
                        <span className="font-bold text-[#1A4255] text-sm">
                          {f.title}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          {f.kcal} kcal · {f.unit}
                        </span>
                      </div>

                      <div className="text-center w-12 text-gray-600 font-medium text-sm">
                        {f.qty}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(section.id, f.id, -1)}
                          className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>

                        <span className="w-4 text-center text-sm font-semibold text-gray-700">
                          {f.qty}
                        </span>

                        <button
                          onClick={() => updateQty(section.id, f.id, 1)}
                          className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-[#1A4255] hover:bg-gray-50"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add extra dish */}
                  <button className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 text-left hover:bg-gray-50">
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
              "w-full max-w-[250px] text-sm border rounded-md py-2 px-3",
              !notFollowed
                ? "bg-gray-50 text-gray-400"
                : "bg-white text-gray-700 border-gray-300"
            )}
          >
            <option>All of the above</option>
            <option>Not hungry</option>
            <option>Ate outside</option>
          </select>
        </div>

        {/* DISCLAIMER */}
        <div className="text-xs text-[#4D32FF]">
          All nutritional values are referred by ICMR
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
                {suggestedKcal} kcal
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-[#D0F4DE]/30 p-3 text-center">
              <div className="text-xs font-bold text-[#1A4255] bg-green-200/50 py-1 rounded mb-2">
                New calculated calories
              </div>
              <div className="text-2xl font-medium text-[#6D5DFF]">
                {totalKcal} kcal
              </div>
            </div>
          </div>
        </div>

        {/* FOCUS ACHIEVED */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-600">
            The food selection was a great choice.
          </p>

          <p className="text-sm font-bold text-[#4D32FF]">
            Nutritional focus achieved :
          </p>

          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 ml-1">
            {achievedFocuses.length > 0 ? (
              achievedFocuses.map((f) => <li key={f.id}>{f.label}</li>)
            ) : (
              <>
                <li>Increase anti-inflammatory intake.</li>
                <li>Maintain calcium-phosphate balance.</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 pt-2 flex gap-3 bg-white border-t border-gray-50">
        <button
          type="button"
          onClick={() => handleSaveAction(true)}
          disabled={saving}
          className="flex-1 rounded shadow-sm bg-[#8FB494] text-white font-semibold py-3 text-sm hover:bg-[#7da382] disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save new plan"}
        </button>

        <button
          type="button"
          onClick={() => handleSaveAction(false)}
          className="flex-1 rounded shadow-sm bg-[#BBFFCC] text-[#1A4255] font-semibold py-3 text-sm hover:bg-[#a8eeb9]"
        >
          No changes in plan
        </button>
      </div>
    </div>
  );
}

export default MealPlanMonitoringCards;
