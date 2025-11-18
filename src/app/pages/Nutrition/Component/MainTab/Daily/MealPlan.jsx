import { useState } from "react";
import { foods as initialFoods } from "./data";

function FoodTypeIcon({ type }) {
  const colorMap = {
    veg: "bg-green-600 border-green-600",
    nonveg: "bg-red-600 border-red-600",
    egg: "bg-yellow-400 border-yellow-400",
  };
  const color = colorMap[type] || colorMap.veg;

  return (
    <div
      className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center bg-white ${color.split(" ")[1]}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${color.split(" ")[0]}`}></div>
    </div>
  );
}

function FoodCard({ item, onToggleFavorite, onChangeQty }) {
  return (
    <div className="flex-none w-[160px] sm:w-[180px] rounded-xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-200">
      <div className="relative h-[110px]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        {/* ❤️ Favorite */}
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-1.5 left-1.5 w-7 h-7 rounded-md bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={item.isFavorite ? "#ef4444" : "none"}
            stroke="#ef4444"
            strokeWidth="1.4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21s-7-4.35-9.2-6.1C-0.4 12.8 2 7 7 7c2.6 0 4 2 5 3 1-1 2.4-3 5-3 5 0 7.4 5.8 4.2 7.9C19 16.65 12 21 12 21z" />
          </svg>
        </button>

        {/* ➕ Qty */}
        <div className="absolute top-1.5 right-1.5 flex items-center border border-gray-300 bg-white rounded-md text-xs overflow-hidden shadow-sm">
          <button
            onClick={() => onChangeQty(item.id, Math.max(0, item.quantity - 1))}
            className="w-7 h-7 flex items-center justify-center text-[14px]"
          >
            −
          </button>
          <div className="w-[30px] text-center text-[13px] font-medium">
            {item.quantity}
          </div>
          <button
            onClick={() => onChangeQty(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center text-[14px]"
          >
            +
          </button>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {item.title}
          </h3>
          <FoodTypeIcon type={item.foodType} />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
          <div className="font-semibold">{item.kcalPerUnit} kcal</div>
          <div>{item.unitLabel}</div>
        </div>
      </div>
    </div>
  );
}

export default function FoodCardList() {
  const [items, setItems] = useState(initialFoods);

  const toggleFavorite = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isFavorite: !it.isFavorite } : it
      )
    );

  const changeQty = (id, qty) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
        {items.map((it) => (
          <div key={it.id} className="snap-start">
            <FoodCard
              item={it}
              onToggleFavorite={toggleFavorite}
              onChangeQty={changeQty}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
