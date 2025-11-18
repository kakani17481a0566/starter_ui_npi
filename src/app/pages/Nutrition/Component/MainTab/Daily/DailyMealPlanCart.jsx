import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "components/ui";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { saveMealPlan } from "../Daily/data";

export default function DailyMealPlanCart({
  foods,
  mealWindows,
  selectedFoods, // { "mealId-foodId": qty }
  onSelectionChange,
  onMealSelect, // sends selectedMealType to DailyPlans
  focusTags,
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  /* ------------------------------------------------------------
     🔹 1️⃣ Build selected list with meal + food context
  ------------------------------------------------------------ */
  const selectedList = useMemo(() => {
    const list = [];

    Object.entries(selectedFoods || {}).forEach(([key, qty]) => {
      if (qty <= 0) return;

      const [mealIdStr, foodIdStr] = key.split("-");
      const mealId = Number(mealIdStr);
      const foodId = Number(foodIdStr);

      const food = foods?.find((f) => f.id === foodId);
      const meal = mealWindows?.find((m) => m.id === mealId);

      if (!food || !meal) return;

      list.push({
        ...food,
        qty,
        mealId,
        sectionId: meal.id,
        sectionTitle: meal.title,
        sectionTime: meal.time,
      });
    });

    return list;
  }, [selectedFoods, foods, mealWindows]);

  /* ------------------------------------------------------------
     🔹 2️⃣ Group by section (Breakfast / Lunch)
  ------------------------------------------------------------ */
  const groupedBySection = useMemo(() => {
    return mealWindows?.map((section) => {
      const items = selectedList.filter((f) => f.mealId === section.id);

      const sectionKcal = items.reduce(
        (sum, f) => sum + (f.kcal || f.kcalPerUnit || 0) * f.qty,
        0
      );

      return { ...section, items, sectionKcal };
    });
  }, [selectedList, mealWindows]);

  /* ------------------------------------------------------------
     🔹 3️⃣ Total kcal
  ------------------------------------------------------------ */
  const totalKcal = groupedBySection.reduce(
    (sum, sec) => sum + sec.sectionKcal,
    0
  );

  const kcalGoal = 1200;

  /* ------------------------------------------------------------
     🔹 4️⃣ Achieved focuses
  ------------------------------------------------------------ */
  const achievedFocuses = useMemo(() => {
    const achievedIds = [
      ...new Set(selectedList.flatMap((f) => f.focus || [])),
    ];

    return focusTags?.filter((f) => achievedIds.includes(f.id)) || [];
  }, [selectedList, focusTags]);

  /* ------------------------------------------------------------
     🔹 5️⃣ Update qty
  ------------------------------------------------------------ */
  const updateQty = (mealId, foodId, delta) => {
    onSelectionChange((prev) => {
      const key = `${mealId}-${foodId}`;
      const curr = prev[key] || 0;
      const next = Math.max(0, curr + delta);
      return { ...prev, [key]: next };
    });
  };

  /* ------------------------------------------------------------
     🔹 6️⃣ Save handler (with mandatory checkbox)
  ------------------------------------------------------------ */
  const handleSave = async () => {
    if (!isChecked) {
      setMessage({
        type: "error",
        text: "Please read and accept the mandatory instructions before saving.",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await saveMealPlan(selectedFoods);

      if (res.data?.statusCode === 200 || res.data?.statusCode === 201) {
        setMessage({ type: "success", text: "Meal plan saved successfully!" });
      } else {
        setMessage({
          type: "error",
          text: res.data?.message || "Something went wrong!",
        });
      }
    } catch (err) {
        console.error(err);

      setMessage({
        type: "error",
        text: "Failed to save meal plan. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------
     🔹 7️⃣ UI Color Helpers
  ------------------------------------------------------------ */
  const kcalColor =
    totalKcal === 0
      ? "text-gray-500"
      : totalKcal <= 500
      ? "text-amber-600"
      : totalKcal <= 1000
      ? "text-emerald-700"
      : "text-red-600";

  const barColor =
    totalKcal === 0
      ? "bg-gray-300"
      : totalKcal <= 500
      ? "bg-amber-400"
      : totalKcal <= 1000
      ? "bg-emerald-500"
      : "bg-red-500";

  /* ------------------------------------------------------------
     🔹 RETURN UI
  ------------------------------------------------------------ */
  return (
    <div className="flex w-full max-w-md flex-col rounded-tr-2xl rounded-bl-2xl border border-gray-200 bg-white shadow-md font-[Inter]">
      {/* HEADER */}
      <div
        className="text-xl rounded-tr-2xl rounded-bl-2xl px-4 py-3 text-center font-semibold shadow-sm"
        style={{ backgroundColor: "#99C68E", color: "#1A4255" }}
      >
        Your Meal Plan
      </div>

      <div className="space-y-4 px-4 py-4">
        {/* MESSAGE */}
        {message && (
          <div
            className={clsx(
              "text-sm px-3 py-2 rounded-md",
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {message.text}
          </div>
        )}

        {/* ACCORDION */}
        <Accordion
          type="multiple"
          defaultValue={mealWindows?.[0]?.id?.toString()}
          className="flex flex-col divide-y divide-gray-100"
        >
          {groupedBySection.map((section) => (
            <AccordionItem key={section.id} value={section.id.toString()}>
              <AccordionButton
                onClick={() => onMealSelect?.(section.id)} // 🔥 IMPORTANT FIX
                className="flex w-full items-center justify-between py-3 text-sm font-medium text-[#1A4255]"
              >
                {({ open }) => (
                  <>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-[#1A4255]">
                        {section.title}
                      </span>

                      {section.time && (
                        <span className="text-[11px] text-[#8EB297]">
                          {section.time}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#7985F2]">
                        {section.sectionKcal} kcal
                      </span>

                      <ChevronDownIcon
                        className={clsx(
                          "size-5 text-gray-400 transition-transform duration-300",
                          open && "-rotate-180"
                        )}
                      />
                    </div>
                  </>
                )}
              </AccordionButton>

              <AccordionPanel className="pb-3 pl-1">
                {section.items.length > 0 ? (
                  <div className="space-y-3">
                    {section.items.map((f) => (
                      <div
                        key={`${section.id}-${f.id}`}
                        className="flex items-center gap-3 p-2 text-xs"
                      >
                        <img
                          src={f.itemImage}
                          alt={f.title}
                          className="h-12 w-12 rounded-md border object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="truncate font-bold text-[#1A4255]">
                            {f.title}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {f.kcal} kcal • {f.unit || "100g"}
                          </div>
                        </div>

                        {/* Qty buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(section.id, f.id, -1)}
                            className="h-5 w-5 rounded border bg-white text-xs font-bold hover:bg-gray-100"
                          >
                            −
                          </button>
                          <div className="min-w-[1.5rem] text-center text-xs font-medium">
                            {f.qty}
                          </div>
                          <button
                            onClick={() => updateQty(section.id, f.id, 1)}
                            className="h-5 w-5 rounded border bg-white text-xs font-bold hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-400 italic">
                    No items selected.
                  </p>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center text-[12px] text-[#4D32FF]">
          All nutritional values are referred by ICMR
        </div>

        {/* MANDATORY CHECKBOX */}
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          Read the mandatory instructions before saving meal.
        </label>

        <hr className="border-gray-200" />

        {/* TOTAL KCAL */}
        <div className="text-sm font-semibold text-[#1A4255]">
          Total achieved meal goal for the day
        </div>

        <div className={clsx("mt-1 text-lg font-bold", kcalColor)}>
          {totalKcal} kcal
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={clsx("h-2 rounded-full transition-all", barColor)}
            style={{
              width: `${Math.min((totalKcal / kcalGoal) * 100, 100)}%`,
            }}
          />
        </div>

        {/* ACHIEVED focuses */}
        {totalKcal > 0 && (
          <div className="mt-4 text-sm text-green-700">
            The food selection was a great choice.
            <div className="mt-1 text-xs text-gray-600">
              <strong style={{ color: "#4D32FF" }}>
                Nutritional focus achieved:
              </strong>

              <ul className="mt-1 list-inside list-disc">
                {achievedFocuses.length > 0 ? (
                  achievedFocuses.map((f) => (
                    <li key={f.id} className="text-gray-700">
                      {f.label}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">
                    No specific focus achieved yet
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <button
            onClick={handleSave}
            disabled={saving || !isChecked}
            className={clsx(
              "flex-1 rounded-sm py-2 font-medium text-[#1A4255]",
              saving || !isChecked
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#BBFFCC] hover:bg-[#8EB297]"
            )}
          >
            {saving ? "Saving..." : "Save plan"}
          </button>

          <button className="flex-1 rounded-sm bg-[#BBFFCC] py-2 font-medium text-[#1A4255] hover:bg-[#8EB297]">
            Edit plan
          </button>
        </div>
      </div>
    </div>
  );
}
