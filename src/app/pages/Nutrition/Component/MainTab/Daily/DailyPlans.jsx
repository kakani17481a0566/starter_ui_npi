// DailyPlans.jsx
import { useState, useMemo, useEffect } from "react";
import { DIET_TAGS } from "./data";

/* -------------------------------------------------------------
   🟢 Veg / Non-Veg / Egg Icon
------------------------------------------------------------- */
function FoodTypeIcon({ type }) {
  const map = {
    veg: "bg-green-600 border-green-600",
    nonveg: "bg-red-600 border-red-600",
    egg: "bg-yellow-400 border-yellow-400",
  };

  const normalized = type?.toLowerCase().replace(/[- ]/g, "") || "veg";
  const color = map[normalized] || map.veg;

  return (
    <div className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 bg-white ${color.split(" ")[1]}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${color.split(" ")[0]}`} />
    </div>
  );
}

/* -------------------------------------------------------------
   🍱 FOOD CARD
------------------------------------------------------------- */
function FoodCard({ food, qty, onInc, onDec, onToggleFavorite }) {
  return (
    <div className="relative w-[140px] flex-none rounded-xl bg-white shadow-md overflow-hidden sm:w-[160px] md:w-[170px] hover:-translate-y-1 transition">
      <div className="relative h-24 sm:h-28">
        <img src={food.itemImage} alt={food.title} className="w-full h-full object-cover" />

        {/* ❤️ Favorite */}
        <button onClick={() => onToggleFavorite(food.id)} className="absolute top-1.5 left-1.5 h-6 w-6 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={food.isFavorite ? "#ef4444" : "none"} stroke="#ef4444" strokeWidth="1.6">
            <path
              d="M12 21s-7-4.35-9.2-6.1C-0.4 12.8 2 7 7 7c2.6 0 4 2 5 3 1-1 2.4-3 5-3 5 0 7.4 5.8 4.2 7.9C19 16.65 12 21 12 21z"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Qty */}
        <div className="absolute top-1.5 right-1.5 flex items-center border rounded bg-white shadow-sm text-xs">
          <button onClick={onDec} disabled={qty === 0} className={`h-6 w-6 flex items-center justify-center font-bold ${qty === 0 ? "text-gray-400" : "hover:text-[#1A4255]"}`}>
            –
          </button>

          <div className="w-[28px] text-center font-semibold">{qty}</div>

          <button onClick={onInc} className="h-6 w-6 flex items-center justify-center font-bold hover:text-[#1A4255]">
            +
          </button>
        </div>
      </div>

      <div className="px-2 py-2">
        <div className="flex justify-between items-center">
          <h3 className="truncate text-[12px] font-semibold">{food.title}</h3>
          <FoodTypeIcon type={food.type} />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-gray-600">
          <span className="font-semibold">{food.kcal} kcal</span>
          <span>{food.unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   ⭐ MAIN COMPONENT — DailyPlans
=============================================================== */
export default function DailyPlans({
  foods,
  selectedMealType,
  selectedFoods,
  onSelectionChange,
  focusTags,
  selectedDate,
}) {
  const [dietSel, setDietSel] = useState([]);
  const [mealSel, setMealSel] = useState([]);
  const [localFoods, setLocalFoods] = useState([]);
  const [displayDate, setDisplayDate] = useState("");

  /* Sync foods */
  useEffect(() => {
    setLocalFoods(foods || []);
  }, [foods]);

  /* Format date */
  useEffect(() => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    setDisplayDate(
      d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
    );
  }, [selectedDate]);

  /* When cart selects a meal → apply strict filter */
  useEffect(() => {
    if (selectedMealType) setMealSel([selectedMealType]);
  }, [selectedMealType]);

  const toggleFavorite = (id) =>
    setLocalFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );

  const getMealId = (food) => mealSel[0] || selectedMealType || food.bestFor?.[0];

  /* Apply strict filters */
  const filteredFoods = useMemo(() => {
    if (dietSel.length === 0 && mealSel.length === 0) return [];

    let list = [...localFoods];

    if (dietSel.length > 0) {
      list = list.filter((f) => dietSel.includes(f.type.toLowerCase().replace(/[- ]/g, "")));
    }

    if (mealSel.length > 0) {
      list = list.filter((f) => f.bestFor?.includes(mealSel[0]));
    }

    return list;
  }, [localFoods, dietSel, mealSel]);

  /* Group foods by focus */
  const foodsByFocus = useMemo(() => {
    return (focusTags || []).map((tag) => ({
      ...tag,
      foods: filteredFoods.filter((f) => f.focus?.includes(tag.id)),
    }));
  }, [filteredFoods, focusTags]);

  /* Update quantity */
  const updateQty = (food, delta) => {
    const mealId = getMealId(food);
    if (!mealId) return;

    onSelectionChange((prev) => {
      const key = `${mealId}-${food.id}`;
      const curr = prev[key] || 0;
      return { ...prev, [key]: Math.max(0, curr + delta) };
    });
  };

  return (
    <div className="w-full font-[Inter]">
      {/* DATE HEADER */}
      <header className="mb-4 px-2">
        <h2 className="px-3 py-1.5 rounded-md font-semibold text-[#1A4255] text-base sm:text-xl">
          {displayDate}
        </h2>
      </header>

      {/* FILTERS */}
      <div className="border-b border-[#707070] pb-2 mb-4 px-1">
        <div className="flex gap-2 overflow-x-auto">
          {DIET_TAGS.map((tag) => {
            const active = dietSel.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() =>
                  setDietSel((prev) =>
                    active ? prev.filter((x) => x !== tag.id) : [...prev, tag.id]
                  )
                }
                className={`flex items-center gap-2 border-2 rounded-md ${active ? "scale-[1.03] shadow" : ""}`}
                style={{
                  borderColor: tag.border,
                  backgroundColor: active ? `${tag.color}1A` : "white",
                  padding: "0.25rem 0.55rem",
                }}
              >
                <span className="flex h-3 w-3 border-2 rounded-sm items-center justify-center" style={{ borderColor: tag.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                </span>

                <span className="text-[11px] sm:text-[13px] font-medium text-[#1A4255]">{tag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NO FILTERS SELECTED MESSAGE */}
      {dietSel.length === 0 && mealSel.length === 0 && (
        <div className="mt-3 px-3">
          <span className="inline-block bg-[#BBFFCC] px-4 py-2 rounded-md shadow-sm text-sm font-semibold text-[#1A4255]">
            Choose your preferences from filters.
          </span>
        </div>
      )}

      {/* FOCUS GROUP SECTIONS */}
      <div className="divide-y divide-gray-200">
        {filteredFoods.length === 0 &&
          (dietSel.length > 0 || mealSel.length > 0) && (
            <p className="py-6 text-center italic text-gray-400">
              No foods match your selected filters.
            </p>
          )}

        {foodsByFocus.map(
          (focus) =>
            focus.foods.length > 0 && (
              <section key={focus.id} className="px-1 py-4">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1A4255] mb-1">
                  Nutritional Focus:
                </h3>

                <span className="bg-[#BBFFCC] text-[#1A4255] text-[13px] font-semibold px-3 py-1 rounded-md">
                  {focus.label}
                </span>

                <h4 className="text-[14px] sm:text-[16px] font-bold text-[#1A4255] mt-3 mb-2">
                  Key Foods
                </h4>

                <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4 lg:flex-wrap">
                  {focus.foods.map((food) => {
                    const mealId = getMealId(food);
                    const key = `${mealId}-${food.id}`;
                    const qty = selectedFoods[key] || 0;

                    return (
                      <FoodCard
                        key={key}
                        food={food}
                        qty={qty}
                        onInc={() => updateQty(food, 1)}
                        onDec={() => updateQty(food, -1)}
                        onToggleFavorite={toggleFavorite}
                      />
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
