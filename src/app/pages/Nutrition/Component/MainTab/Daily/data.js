// -------------------------------------------------------------
// 🌐 AXIOS INSTANCE
// -------------------------------------------------------------
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7098",
  timeout: 15000,
});

// -------------------------------------------------------------
// 🕒 MEAL TIME MAP
// -------------------------------------------------------------
export const MEAL_TIME_MAP = {
  1: "07:00 - 09:00",
  2: "12:00 - 13:30",
  3: "10:30 - 11:00",
  4: "19:00 - 21:00",
  5: "15:30 - 16:30",
};

// -------------------------------------------------------------
// 🥗 DIET TAGS
// -------------------------------------------------------------
export const DIET_TAGS = [
  { id: "veg", label: "Vegetarian", color: "#00FF00", border: "#707070" },
  { id: "nonveg", label: "Non Vegetarian", color: "#FF0000", border: "#707070" },
  { id: "egg", label: "Eggetarian", color: "#FFD700", border: "#707070" },
];

// -------------------------------------------------------------
// 📅 GLOBAL DATE USED FOR SAVE/EDIT
// -------------------------------------------------------------
export let DAILY_PLAN_DATE = null;

// -------------------------------------------------------------
// ⭐ FIX UNSPLASH IMAGES
// -------------------------------------------------------------
function fixUnsplash(url) {
  if (!url || !url.includes("unsplash.com/photos/")) return url;
  const id = url.split("/photos/")[1];
  return `https://images.unsplash.com/photo-${id}?auto=format&w=800`;
}

// -------------------------------------------------------------
// 🔄 MAP FOODS
// -------------------------------------------------------------
function mapApiToFoods(root) {
  return (root?.data?.allItems || []).map((item) => ({
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
      item.dietTypeId === 3
        ? "Egg"
        : item.dietTypeId === 4
        ? "Non-Veg"
        : "Veg",
    isFavorite: item.userFavourite,
  }));
}

// -------------------------------------------------------------
// 🔄 MAP MEAL PLANS
// -------------------------------------------------------------
function mapApiMealPlans(root) {
  const selected = {};

  root?.data?.mealPlans?.forEach((mp) => {
    mp.items?.forEach((item) => {
      selected[`${mp.mealTypeId}-${item.id}`] = item.quantity;
    });
  });

  return selected;
}

// -------------------------------------------------------------
// ⚙️ ENSURE DATE
// -------------------------------------------------------------
function ensureDate(date) {
  return date || new Date().toISOString().split("T")[0];
}

// -------------------------------------------------------------
// 🚀 LOAD NUTRITION DATA
// -------------------------------------------------------------
export async function loadNutritionData(userId = 1, date = null) {
  try {
    const finalDate = ensureDate(date);  // selected or today's date

    const res = await api.get("/nutrition/vm/test", {
      params: { userId, date: finalDate },
    });

    const root = res.data;

    DAILY_PLAN_DATE = finalDate;  // ⭐ always correct

    const mealWindows = (root?.data?.mealTypes || []).map((mt) => ({
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
      dailyPlanDate: finalDate,  // ⭐ returned properly
    };
  } catch (err) {
    console.error("❌ loadNutritionData Error:", err);
    throw err;
  }
}


// -------------------------------------------------------------
// 🧩 SHARED SAVE/EDIT PAYLOAD
// -------------------------------------------------------------
function buildMealPlanPayload(selectedFoods, userId, tenantId) {
  const items = [];

  Object.entries(selectedFoods || {}).forEach(([key, qty]) => {
    const [mealId, foodId] = key.split("-");
    if (!mealId || !foodId) return;

    items.push({
      mealTypeId: Number(mealId),
      nutritionalItemId: Number(foodId),
      qty: Math.max(qty, 0),
    });
  });

  return {
    userId,
    tenantId,
    date: ensureDate(DAILY_PLAN_DATE), // ⭐ always correct
    items,
  };
}

// -------------------------------------------------------------
// 💾 SAVE
// -------------------------------------------------------------
export async function saveMealPlan(selectedFoods, userId = 1, tenantId = 1) {
  const payload = buildMealPlanPayload(selectedFoods, userId, tenantId);
  return await api.post("/api/NutritionalItem/save-meal-plan", payload);
}

// -------------------------------------------------------------
// ✏️ EDIT
// -------------------------------------------------------------
export async function editMealPlan(selectedFoods, userId = 1, tenantId = 1) {
  const payload = buildMealPlanPayload(selectedFoods, userId, tenantId);
  return await api.post("/api/NutritionalItem/edit-meal-plan", payload);
}
