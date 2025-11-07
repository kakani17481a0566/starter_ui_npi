import { useMemo, useState, useEffect } from "react";
import { MEAL_WINDOWS, DIET_TAGS, FOCUS_TAGS, FOODS } from "./data";

// 💡 Reusable Chip Component
function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-2 py-1 rounded-full text-xs border transition-all duration-200 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        active
          ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

// ✨ Food Card Component
function FoodCard({ food, count, onInc, onDec }) {
  return (
    <div className="relative border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col items-center text-center">
      <div className="w-full h-24 overflow-hidden">
        <img
          src={food.image}
          alt={food.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="px-2 pt-2 pb-3 w-full">
        <div className="text-[13px] font-semibold text-gray-800 truncate">
          {food.title}
        </div>
        <div className="text-[11px] text-gray-500 mb-2">
          {food.kcal} kcal • {food.unit}
        </div>
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={onDec}
            disabled={count === 0}
            className={`w-5 h-5 rounded-md border text-xs font-bold ${
              count === 0
                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            −
          </button>
          <div className="min-w-[1rem] text-center text-xs px-1 rounded bg-gray-50 border text-gray-700">
            {count}
          </div>
          <button
            onClick={onInc}
            className="w-5 h-5 rounded-md bg-white border text-xs text-gray-700 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// 🧠 Main DailyPlans Component
export default function DailyPlans({ onSelectionChange }) {
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [dietSel, setDietSel] = useState([]);
  const [focusSel, setFocusSel] = useState([]);
  const [counts, setCounts] = useState({});

  // 🧮 Filter foods (show all when no filters)
  const filteredFoods = useMemo(() => {
    return FOODS.filter((f) => {
      const okWindow =
        !selectedWindow || f.bestFor.includes(selectedWindow);
      const okDiet =
        dietSel.length === 0 || dietSel.some((t) => f.tags.includes(t));
      const okFocus =
        focusSel.length === 0 || focusSel.some((t) => f.focus.includes(t));
      return okWindow && okDiet && okFocus;
    });
  }, [selectedWindow, dietSel, focusSel]);

  // Sync parent
  useEffect(() => {
    onSelectionChange?.(counts);
  }, [counts, onSelectionChange]);

  const updateCount = (id, delta) =>
    setCounts((prev) => {
      const newCount = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: newCount };
    });

  return (
    <div className="w-full" role="region" aria-label="Daily Meal Planner">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Saturday, 18 October
        </h2>
        <p className="text-sm text-gray-500">
          Choose your preferences to filter, or view all foods.
        </p>
      </header>

      <section className="space-y-4">
        {/* 🕒 Meal Time Filters */}
        <div className="flex flex-wrap gap-2">
          {MEAL_WINDOWS.map((w) => (
            <Chip
              key={w.id}
              active={selectedWindow === w.id}
              onClick={() =>
                setSelectedWindow(
                  selectedWindow === w.id ? null : w.id
                )
              }
            >
              {w.title} <span className="ml-1 opacity-60">{w.time}</span>
            </Chip>
          ))}
        </div>

        {/* 🥗 Diet Tags */}
        <div className="flex flex-wrap gap-2">
          {DIET_TAGS.map((t) => (
            <Chip
              key={t}
              active={dietSel.includes(t)}
              onClick={() =>
                setDietSel((prev) =>
                  prev.includes(t)
                    ? prev.filter((x) => x !== t)
                    : [...prev, t]
                )
              }
            >
              {t}
            </Chip>
          ))}
        </div>

        {/* 🧬 Focus Tags */}
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Nutritional Focus
          </div>
          <div className="flex flex-wrap gap-2">
            {FOCUS_TAGS.map((t) => (
              <Chip
                key={t.id}
                active={focusSel.includes(t.id)}
                onClick={() =>
                  setFocusSel((prev) =>
                    prev.includes(t.id)
                      ? prev.filter((x) => x !== t.id)
                      : [...prev, t.id]
                  )
                }
              >
                {t.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* 🍱 Food Grid */}
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-700">
            {filteredFoods.length > 0 ? "Foods Found" : "No foods match your filter"}
          </div>
          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredFoods.map((f) => (
                <FoodCard
                  key={f.id}
                  food={f}
                  count={counts[f.id] || 0}
                  onInc={() => updateCount(f.id, 1)}
                  onDec={() => updateCount(f.id, -1)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 py-6">
              Try changing your filters to see more options.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
