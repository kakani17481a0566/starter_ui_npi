import { useState } from "react";
import DailyPlans from "./Daily/DailyPlans";
import DailyMealPlanCart from "./Daily/DailyMealPlanCart";

export default function DailyMealPlanner() {
  // Stores all selected foods and their quantities
  const [selectedFoods, setSelectedFoods] = useState({}); // { foodId: qty }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Left: Selection & Filters */}
      <div className="flex-1">
        <DailyPlans onSelectionChange={setSelectedFoods} />
      </div>

      {/* Right: Summary Cart */}
      <div className="w-full max-w-sm">
        <DailyMealPlanCart selectedFoods={selectedFoods} />
      </div>
    </div>
  );
}
