// -------------------------------------------------------------
// 📦 Axios API
// -------------------------------------------------------------
import axios from "axios";

// -------------------------------------------------------------
// 🕒 Meal Time Map
// -------------------------------------------------------------
export const MEAL_TIME_MAP = {
  1: "07:00 - 09:00",
  2: "12:00 - 13:30",
  3: "10:30 - 11:00",
  4: "19:00 - 21:00",
  5: "15:30 - 16:30",
};

// -------------------------------------------------------------
// 🥗 Diet Tags
// -------------------------------------------------------------
export const DIET_TAGS = [
  { id: "veg", label: "Vegetarian", color: "#00FF00", border: "#707070" },
  { id: "nonveg", label: "Non Vegetarian", color: "#FF0000", border: "#707070" },
  { id: "egg", label: "Eggetarian", color: "#FFD700", border: "#707070" },
];

// -------------------------------------------------------------
// 🗓️ DAILY_PLAN_DATE FROM API
// -------------------------------------------------------------
export let DAILY_PLAN_DATE = null;

// -------------------------------------------------------------
// ⭐ Convert Unsplash page → direct image (kept as you said it works)
// -------------------------------------------------------------
function fixUnsplash(url) {
  if (!url) return url;
  if (!url.includes("unsplash.com/photos/")) return url;

  const id = url.split("/photos/")[1];
  return `https://images.unsplash.com/photo-${id}?auto=format&w=800`;
}

// -------------------------------------------------------------
// 🔄 Mapping: API → Foods
// -------------------------------------------------------------
export function mapApiToFoods(root) {
  const list = root?.data?.allItems || [];

  return list.map((item) => ({
    id: item.id,
    title: item.name,
    kcal: item.caloriesQuantity,
    protein: item.proteinQuantity,
    unit: "100g",

    itemImage: fixUnsplash(item.itemImage),

    bestFor: item.mealTypeIds || [],
    focus: item.focusIds || [],
    vitaminIds: item.vitaminIds || [],

    type:
      item.dietTypeId === 3 ? "Egg" :
      item.dietTypeId === 4 ? "Non-Veg" : "Veg",

    isFavorite: item.userFavourite,
  }));
}

// -------------------------------------------------------------
// 🔄 Mapping: API → selectedFoods (PER-MEAL KEYS)
// selectedFoods: { "mealTypeId-foodId": qty }
// -------------------------------------------------------------
export function mapApiMealPlans(root) {
  const mealPlans = root?.data?.mealPlans || [];
  const selected = {};

  mealPlans.forEach((mp) => {
    const mealId = mp.mealTypeId;
    mp.items.forEach((item) => {
      const key = `${mealId}-${item.id}`;
      selected[key] = item.quantity;
    });
  });

  return selected;
}

// -------------------------------------------------------------
// 🚀 MAIN LOADER FUNCTION
// -------------------------------------------------------------
export async function loadNutritionData() {
  const res = await axios.get("https://localhost:7098/nutrition/vm/test");
  const root = res.data;

  const apiDate = root?.data?.mealPlansDate;
  DAILY_PLAN_DATE = apiDate
    ? new Date(`${apiDate}T00:00:00Z`).toISOString()
    : null;

  const apiMealTypes = root?.data?.mealTypes || [];

  const mealWindows = apiMealTypes.map((mt) => ({
    id: mt.id,
    title: mt.name,
    time: MEAL_TIME_MAP[mt.id] || "00:00 - 00:00",
  }));

  const focusTags = (root?.data?.focusTags || []).map((f) => ({
    id: f.id,
    label: f.name,
  }));

  return {
    foods: mapApiToFoods(root),
    selectedFoods: mapApiMealPlans(root),
    mealWindows,
    focusTags,
    dailyPlanDate: DAILY_PLAN_DATE,
  };
}

// -------------------------------------------------------------
// 🟢 SAVE MEAL PLAN API (PER-MEAL KEYS)
// selectedFoods: { "mealTypeId-foodId": qty }
// -------------------------------------------------------------
export async function saveMealPlan(selectedFoods) {
  const userId = 1;
  const tenantId = 1;

  const items = [];

  Object.entries(selectedFoods || {}).forEach(([key, qty]) => {
    if (qty <= 0) return;
    const [mealTypeIdStr, foodIdStr] = key.split("-");
    const mealTypeId = Number(mealTypeIdStr);
    const nutritionalItemId = Number(foodIdStr);

    if (!mealTypeId || !nutritionalItemId) return;

    items.push({
      mealTypeId,
      nutritionalItemId,
      qty,
    });
  });

  const payload = {
    userId,
    tenantId,
    date: DAILY_PLAN_DATE?.split("T")[0] || null,
    items,
  };

  return axios.post(
    "https://localhost:7098/api/NutritionalItem/save-meal-plan",
    payload
  );
}

// -------------------------------------------------------------
// 📊 Nutrition Summary Helper
// -------------------------------------------------------------
export const calculateMealNutrition = (mealItems) => {
  return mealItems.reduce(
    (total, item) => ({
      kcal: total.kcal + (item.kcalPerUnit || item.kcal || 0),
      protein: total.protein + (item.protein || 0),
      carbs: total.carbs + (item.carbs || 0),
      fat: total.fat + (item.fat || 0),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

// -------------------------------------------------------------
// 🔍 Search + Filter Helper
// -------------------------------------------------------------
export const filterFoods = (foods, searchTerm, dietFilter, focusFilter) => {
  return foods.filter((food) => {
    const matchesSearch = food.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDiet =
      dietFilter.length === 0 ||
      dietFilter.some((tag) => food.type.toLowerCase().includes(tag));

    const matchesFocus =
      focusFilter.length === 0 ||
      focusFilter.some((fc) => food.focus.includes(fc.id));

    return matchesSearch && matchesDiet && matchesFocus;
  });
};
