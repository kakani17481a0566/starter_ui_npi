import { useState, useMemo, useEffect } from "react";
import { DIET_TAGS, DAILY_PLAN_DATE } from "./data";

/* -------------------------------------------------------------
   🟢 Veg / non-veg / egg icon
------------------------------------------------------------- */
function FoodTypeIcon({ type }) {
  const map = {
    veg: "bg-green-600 border-green-600",
    nonveg: "bg-red-600 border-red-600",
    egg: "bg-yellow-400 border-yellow-400",
  };

  const normalized =
    type?.toLowerCase().replace("-", "").replace(" ", "") || "veg";
  const color = map[normalized] || map.veg;

  return (
    <div
      className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 bg-white ${
        color.split(" ")[1]
      }`}
    >
      <div className={`h-1.5 w-1.5 rounded-full ${color.split(" ")[0]}`} />
    </div>
  );
}

/* -------------------------------------------------------------
   🍱 FOOD CARD
------------------------------------------------------------- */
function FoodCard({ food, qty, onInc, onDec, onToggleFavorite }) {
  return (
    <div className="relative w-[140px] sm:w-[160px] md:w-[170px] flex-none overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-24 w-full sm:h-28">
        <img
          src={food.itemImage}
          alt={food.title}
          className="h-full w-full object-cover"
        />

        {/* Fav button */}
        <button
          onClick={() => onToggleFavorite(food.id)}
          className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-md hover:scale-110 transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={food.isFavorite ? "#ef4444" : "none"}
            stroke="#ef4444"
            strokeWidth="1.6"
          >
            <path
              d="M12 21s-7-4.35-9.2-6.1C-0.4 12.8 2 7 7 7c2.6 0 4 2 5 3 1-1 2.4-3 5-3 5 0 7.4 5.8 4.2 7.9C19 16.65 12 21 12 21z"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Qty */}
        <div className="absolute top-1.5 right-1.5 flex items-center rounded-md border bg-white shadow-sm overflow-hidden text-xs">
          <button
            onClick={onDec}
            disabled={qty === 0}
            className={`h-6 w-6 flex items-center justify-center font-bold ${
              qty === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-[#1A4255]"
            }`}
          >
            –
          </button>

          <div className="w-[28px] text-center font-semibold">{qty}</div>

          <button
            onClick={onInc}
            className="h-6 w-6 flex items-center justify-center font-bold text-gray-700 hover:text-[#1A4255]"
          >
            +
          </button>
        </div>
      </div>

      <div className="px-2 py-2">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-[12px] font-semibold">{food.title}</h3>
          <FoodTypeIcon type={food.type} />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600">
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
}) {
  const [dietSel, setDietSel] = useState([]);
  const [mealSel, setMealSel] = useState([]);
  const [localFoods, setLocalFoods] = useState(foods || []);
  const [displayDate, setDisplayDate] = useState("");

  /* Sync foods */
  useEffect(() => {
    setLocalFoods(foods || []);
  }, [foods]);

  /* Format date */
  useEffect(() => {
    if (!DAILY_PLAN_DATE) return;
    const d = new Date(DAILY_PLAN_DATE);
    setDisplayDate(
      d.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );
  }, []);

  /* Receive meal filter from cart */
  useEffect(() => {
    if (selectedMealType) {
      setMealSel([selectedMealType]); // strict
    }
  }, [selectedMealType]);

  /* Toggle favorite */
  const toggleFavorite = (id) =>
    setLocalFoods((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
      )
    );

  /* Determine correct mealId for qty */
  const getActiveMealId = (food) => {
    if (mealSel.length > 0) return mealSel[0];
    if (selectedMealType) return selectedMealType;
    return food.bestFor?.[0] || null;
  };

  /* Update qty handler */
  const updateQty = (food, delta) => {
    const mealId = getActiveMealId(food);
    if (!mealId) return;

    onSelectionChange((prev) => {
      const key = `${mealId}-${food.id}`;
      const curr = prev[key] || 0;
      const next = Math.max(0, curr + delta);
      return { ...prev, [key]: next };
    });
  };

  /* ----------------------------------------------------------
     ⭐ STRICT FILTERS + HIDE UNTIL SELECTED
  ---------------------------------------------------------- */
  const filteredFoods = useMemo(() => {
    // Step 1: No filters → hide everything
    if (dietSel.length === 0 && mealSel.length === 0) return [];

    let result = [...localFoods];

    // Step 2: strict diet filter
    if (dietSel.length > 0) {
      result = result.filter((f) => {
        const ft = f.type?.toLowerCase().replace("-", "").replace(" ", "");
        return dietSel.includes(ft);
      });
    }

    // Step 3: strict meal filter
    if (mealSel.length > 0) {
      const activeMeal = mealSel[0];
      result = result.filter((f) => f.bestFor?.includes(activeMeal));
    }

    return result;
  }, [localFoods, dietSel, mealSel]);

  /* Group foods by nutritional focus */
  const foodsByFocus = useMemo(() => {
    return (focusTags || []).map((focus) => ({
      ...focus,
      foods: filteredFoods.filter((f) => f.focus?.includes(focus.id)),
    }));
  }, [filteredFoods, focusTags]);

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */
  return (
    <div className="w-full font-[Inter]">
      {/* HEADER */}
      <header className="mb-4 px-2">
        <h2 className="rounded-md px-3 py-1.5 text-base sm:text-xl font-semibold text-[#1A4255]">
          {displayDate}
        </h2>
      </header>

      {/* DIET FILTERS */}
      <div className="mb-4 border-b border-[#707070] px-1 pb-2">
        <div className="flex gap-2 overflow-x-auto scroll-smooth">
          {DIET_TAGS.map((tag) => {
            const active = dietSel.includes(tag.id.toLowerCase());
            return (
              <button
                key={tag.id}
                onClick={() =>
                  setDietSel((prev) =>
                    active
                      ? prev.filter((x) => x !== tag.id.toLowerCase())
                      : [...prev, tag.id.toLowerCase()]
                  )
                }
                className={`flex items-center gap-2 rounded-md border-2 ${
                  active ? "scale-[1.03] shadow" : ""
                }`}
                style={{
                  borderColor: tag.border,
                  backgroundColor: active ? `${tag.color}1A` : "white",
                  padding: "0.25rem 0.55rem",
                }}
              >
                <span
                  className="flex h-3 w-3 items-center justify-center rounded-sm border-2"
                  style={{ borderColor: tag.color }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                </span>

                <span className="text-[11px] sm:text-[13px] text-[#1A4255] font-medium">
                  {tag.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SHOW MESSAGE ONLY WHEN NO FILTERS */}
      {dietSel.length === 0 && mealSel.length === 0 && (
        <div className="mt-3 px-2">
          <div className="rounded-md bg-[#BBFFCC] px-4 py-3 text-sm font-semibold text-[#1A4255] shadow-sm">
            Choose your preferences from filters.
          </div>
        </div>
      )}

      {/* FOCUS GROUPS */}
      <div className="divide-y divide-gray-200">

        {/* IF filters applied but no foods found */}
        {filteredFoods.length === 0 &&
          (dietSel.length > 0 || mealSel.length > 0) && (
            <p className="text-center py-6 text-gray-400 text-sm italic">
              No foods match your selected filters.
            </p>
          )}

        {foodsByFocus.map(
          (focus) =>
            focus.foods.length > 0 && (
              <section key={focus.id} className="py-4 px-1">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1A4255] mb-1">
                  Nutritional Focus:
                </h3>

                <span className="inline-block bg-[#BBFFCC] text-[#1A4255] px-3 py-1 rounded-md text-[13px] font-semibold">
                  {focus.label}
                </span>

                <h4 className="mt-3 mb-2 text-[14px] sm:text-[16px] font-bold text-[#1A4255]">
                  Key Foods
                </h4>

                <div className="flex gap-3 overflow-x-auto sm:gap-4 pb-3 lg:flex-wrap">
                  {focus.foods.map((food) => {
                    const mealId = getActiveMealId(food);
                    const key = `${mealId}-${food.id}`;
                    const qty = selectedFoods?.[key] || 0;

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
