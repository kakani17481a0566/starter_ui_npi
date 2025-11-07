import { MEAL_SECTIONS } from "./data";

export default function DailyMealPlanCart({ selectedFoods }) {
  // Flatten all foods across all sections
  const allItems = MEAL_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({ ...item, sectionId: section.id }))
  );

  // Build list of selected items with qty > 0
  const selectedList = Object.entries(selectedFoods)
    .filter(([, qty]) => qty > 0) // ✅ only destructure qty (no ESLint warning)
    .map(([id, qty]) => {
      const food = allItems.find((f) => f.id === Number(id));
      return food ? { ...food, qty } : null;
    })
    .filter(Boolean);

  // Group selected foods by section (Breakfast, Lunch, etc.)
  const groupedBySection = MEAL_SECTIONS.map((section) => {
    const items = selectedList.filter((f) => f.sectionId === section.id);
    const sectionKcal = items.reduce(
      (sum, f) => sum + f.kcalPerUnit * f.qty,
      0
    );
    return { ...section, items, sectionKcal };
  });

  // Total kcal for all sections
  const totalKcal = groupedBySection.reduce(
    (sum, s) => sum + s.sectionKcal,
    0
  );

  return (
    <div className="w-full max-w-[360px] rounded-2xl border shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-200 px-4 py-3 text-center font-bold text-gray-800">
        Your Meal Plan
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-4">
        {/* Empty State */}
        {selectedList.length === 0 ? (
          <div className="text-sm text-gray-500">No foods selected yet.</div>
        ) : (
          groupedBySection.map((section) => (
            <div key={section.id} className="border-b pb-3">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-800">
                    {section.title}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {section.time}
                  </div>
                </div>
                <span className="text-emerald-700 text-sm font-medium">
                  {section.sectionKcal} kcal
                </span>
              </div>

              {/* Items for that section */}
              {section.items.length > 0 && (
                <div className="space-y-2">
                  {section.items.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 border rounded-lg p-2 text-xs shadow-sm bg-white"
                    >
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-10 h-10 rounded-md object-cover border"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 truncate">
                          {f.title}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {f.qty} × {f.kcalPerUnit} kcal
                        </div>
                      </div>
                      <div className="text-emerald-700 font-semibold text-sm">
                        {f.kcalPerUnit * f.qty}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Totals */}
        <div className="mt-2 text-right font-semibold text-emerald-700">
          Total: {totalKcal} kcal
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex gap-3">
          <button className="flex-1 rounded-xl bg-gray-200 hover:bg-gray-300 py-2 font-medium">
            Save Plan
          </button>
          <button className="flex-1 rounded-xl bg-emerald-300 hover:bg-emerald-400 py-2 font-medium">
            Edit Plan
          </button>
        </div>
      </div>
    </div>
  );
}
