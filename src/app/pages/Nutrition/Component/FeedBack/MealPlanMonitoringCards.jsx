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

/* -------------------------------------------------------------
   Simple clsx helper
------------------------------------------------------------- */
function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------
   Accordion System
------------------------------------------------------------- */
const AccordionContext = React.createContext(null);

function Accordion({ type = "multiple", defaultValue = [], children, className }) {
  const [openItems, setOpenItems] = useState(
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

  return (
    <AccordionContext.Provider
      value={{
        openItems,
        toggleItem,
        isItemOpen: (value) => openItems.includes(value),
      }}
    >
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
  sections = [],
  cardDate,
  selectedFoods = {},
  onSelectionChange = () => { },
  isPending = false,
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  /* ------------------------------------------------------------
     Build sections with correct planned + consumed values
  ------------------------------------------------------------ */
  const groupedSections = useMemo(() => {
    return (sections || []).map((sec) => {
      const items = (sec.items || []).map((item) => {
        const plannedQty = item.plannedQty ?? 0;
        const baseConsumedQty = item.consumedQty ?? 0;

        const key = `${sec.mealTypeId}-${item.itemId}`;
        const effectiveQty = isPending
          ? plannedQty
          : selectedFoods[key] ?? baseConsumedQty;

        return {
          ...item,
          plannedQty,
          consumedQty: effectiveQty,
        };
      });

      const sectionKcal = items.reduce((acc, f) => {
        const qtyForTotal = isPending ? f.plannedQty : f.consumedQty;
        return acc + (f.kcal || 0) * qtyForTotal;
      }, 0);

      return { ...sec, items, sectionKcal };
    });
  }, [sections, selectedFoods, isPending]);

  const totalKcal = groupedSections.reduce(
    (sum, sec) => sum + sec.sectionKcal,
    0
  );

  const suggestedKcal = 316;

  /* ------------------------------------------------------------
      Quantity Update Handler
  ------------------------------------------------------------ */
  const updateQty = (mealTypeId, itemId, delta) => {
    const key = `${mealTypeId}-${itemId}`;

    onSelectionChange((prev) => {
      const prevState = typeof prev === "function" ? prev({}) : prev;
      const current = prevState?.[key] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...(prevState || {}), [key]: next };
    });
  };

  /* ------------------------------------------------------------
      Save / Edit
  ------------------------------------------------------------ */
  const handleSave = async (isEdit) => {
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
          text: res?.data?.message ?? "Something went wrong",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save plan" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  /* ------------------------------------------------------------
      UI (same as original)
  ------------------------------------------------------------ */
  return (
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg mx-auto mt-10">
      {/* HEADER */}
      <div className="bg-[#558365] px-4 py-3 text-center text-white font-bold text-lg shadow-sm">
        {cardDate} - {isPending ? "Pending Feedback" : "Your Meal Plan"}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
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
          defaultValue={[sections?.[0]?.mealTypeId?.toString()]}
          className="space-y-4"
        >
          {groupedSections.map((section) => (
            <AccordionItem
              key={section.mealTypeId}
              value={section.mealTypeId.toString()}
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

                      {/* Planned qty */}
                      <div className="text-center w-12 text-gray-600 font-medium text-sm">
                        {item.plannedQty}
                      </div>

                      {/* Editable quantity only for today */}
                      {!isPending && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQty(
                                section.mealTypeId,
                                item.itemId,
                                -1
                              )
                            }
                            className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>

                          <span className="w-4 text-center text-sm font-semibold text-gray-700">
                            {item.consumedQty}
                          </span>

                          <button
                            onClick={() =>
                              updateQty(
                                section.mealTypeId,
                                item.itemId,
                                1
                              )
                            }
                            className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 text-[#1A4255] hover:bg-gray-50"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

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
      </div>

      {/* FOOTER BUTTONS (today only) */}
      {!isPending && (
        <div className="p-4 pt-2 flex gap-3 bg-white border-t border-gray-50">
          <button
            onClick={() => handleSave(false)} // saveNewPlan
            className="flex-1 rounded shadow-sm bg-[#8FB494] text-white font-semibold py-3 text-sm"
          >
            {saving ? "Saving..." : "Save new plan"}
          </button>

          <button
            onClick={() => handleSave(true)} // no changes => editMealPlan
            className="flex-1 rounded shadow-sm bg-[#BBFFCC] text-[#1A4255] font-semibold py-3 text-sm"
          >
            No changes in plan
          </button>
        </div>
      )}
    </div>
  );
}

export default MealPlanMonitoringCards;
