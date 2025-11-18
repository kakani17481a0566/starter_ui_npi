// ----------------------------------------------------------------------
// 🖼️ Image URLs
const IMG_TOFU = "https://images.unsplash.com/photo-1604908176997-431a1a5c7af1?q=80&w=256&auto=format&fit=crop";
const IMG_ASPARAGUS = "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=256&auto=format&fit=crop";
const IMG_BELL = "https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=256&auto=format&fit=crop";
const IMG_AVOCADO = "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=256&auto=format&fit=crop";
const IMG_SALMON = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=256&auto=format&fit=crop";
const IMG_QUINOA = "https://images.unsplash.com/photo-1598965675045-8d5d5ca64681?q=80&w=256&auto=format&fit=crop";
const IMG_BROCCOLI = "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=256&auto=format&fit=crop";
const IMG_EGGS = "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=256&auto=format&fit=crop";
const IMG_WALNUTS = "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=256&auto=format&fit=crop";
const IMG_GREEK_YOGURT = "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=256&auto=format&fit=crop";

// ----------------------------------------------------------------------
// 🍽️ Meal Windows
export const MEAL_WINDOWS = [
  { id: 1, title: "Breakfast", time: "07:00 - 09:00" },
  { id: 2, title: "Mid Meal Snacks", time: "11:00 - 11:30" },
  { id: 3, title: "Lunch", time: "13:00 - 14:00" },
  { id: 4, title: "Evening Snacks", time: "15:30 - 16:30" },
  { id: 5, title: "Dinner", time: "20:00 - 21:00" },
];

// ----------------------------------------------------------------------
// 🥗 Diet Types
// data.js
export const DIET_TAGS = [
  {
    id: "veg",
    label: "Vegetarian",
    color: "#00FF00", // bright green
    border: "#707070",
  },
  {
    id: "nonveg",
    label: "Non Vegetarian",
    color: "#FF0000", // red
    border: "#707070",
  },
  {
    id: "egg",
    label: "Eggetarian",
    color: "#FFD700", // golden yellow
    border: "#707070",
  },
];

// ----------------------------------------------------------------------
// 🌿 Nutritional Focus
export const FOCUS_TAGS = [
  {
    id: 1,
    label: "Increase anti-inflammatory intake",
    description:
      "Focus on foods rich in omega-3s, antioxidants, and vitamins to reduce inflammation and promote healing.",
  },
  {
    id: 2,
    label: "Maintain calcium–phosphate balance",
    description:
      "Helps maintain strong bones and teeth by balancing calcium-rich and phosphate-containing foods.",
  },
  {
    id: 3,
    label: "Boost immunity and recovery",
    description:
      "Supports immune response with vitamin C, zinc, and protein-rich foods to enhance recovery and wellness.",
  },
  {
    id: 4,
    label: "Improve energy metabolism",
    description:
      "Supports sustained energy levels through balanced intake of complex carbs and healthy fats.",
  },
  {
    id: 5,
    label: "Enhance gut health and digestion",
    description:
      "Encourages probiotic and fiber-rich foods to improve digestion and nutrient absorption.",
  },
  {
    id: 6,
    label: "Support cardiovascular health",
    description:
      "Promotes heart-friendly foods rich in unsaturated fats, potassium, and antioxidants.",
  },
];

// ----------------------------------------------------------------------
// 🧠 Food List (Grouped by Meal)
export const FOODS = [
  // Breakfast
  {
    id: 101,
    title: "Tofu",
    kcal: 250,
    unit: "100 grams",
    image: IMG_TOFU,
    bestFor: [1],
    tags: ["Vegetarian", "High Protein"],
    focus: [1, 2],
    type: "Veg",
    protein: 20,
    carbs: 8,
    fat: 15,
    isFavorite: false,
  },
  {
    id: 102,
    title: "Asparagus",
    kcal: 50,
    unit: "50 grams",
    image: IMG_ASPARAGUS,
    bestFor: [1],
    tags: ["Vegetarian", "Low Carb"],
    focus: [1, 2],
    type: "Veg",
    protein: 5,
    carbs: 8,
    fat: 0,
    isFavorite: false,
  },
  {
    id: 103,
    title: "Red Bell Pepper",
    kcal: 250,
    unit: "1 nos",
    image: IMG_BELL,
    bestFor: [1],
    tags: ["Vegetarian", "Low Carb"],
    focus: [1, 2],
    type: "Veg",
    protein: 2,
    carbs: 9,
    fat: 0,
    isFavorite: false,
  },
  {
    id: 104,
    title: "Salmon",
    kcal: 600,
    unit: "100 grams",
    image: IMG_SALMON,
    bestFor: [1, 3, 5],
    tags: ["Non Vegetarian", "High Protein"],
    focus: [1, 6],
    type: "Non-Veg",
    protein: 34,
    carbs: 0,
    fat: 15,
    isFavorite: false,
  },
  {
    id: 105,
    title: "Duck Eggs",
    kcal: 520,
    unit: "2 nos",
    image: IMG_EGGS,
    bestFor: [1, 4, 5],
    tags: ["Eggetarian", "High Protein"],
    focus: [1, 2],
    type: "Egg",
    protein: 13,
    carbs: 1,
    fat: 11,
    isFavorite: false,
  },

  // Lunch / Dinner Items
  {
    id: 201,
    title: "Broccoli",
    kcal: 55,
    unit: "100 grams",
    image: IMG_BROCCOLI,
    bestFor: [3, 5],
    tags: ["Vegetarian"],
    focus: [1, 3, 6],
    type: "Veg",
    protein: 4,
    carbs: 11,
    fat: 1,
    isFavorite: false,
  },
  {
    id: 202,
    title: "Avocado Salad",
    kcal: 160,
    unit: "1 serving",
    image: IMG_AVOCADO,
    bestFor: [5],
    tags: ["Vegetarian", "Keto"],
    focus: [6, 5],
    type: "Veg",
    protein: 2,
    carbs: 9,
    fat: 15,
    isFavorite: false,
  },
  {
    id: 203,
    title: "Quinoa",
    kcal: 220,
    unit: "1 cup",
    image: IMG_QUINOA,
    bestFor: [3],
    tags: ["Vegetarian", "High Protein"],
    focus: [4, 5],
    type: "Veg",
    protein: 8,
    carbs: 39,
    fat: 4,
    isFavorite: false,
  },
  {
    id: 204,
    title: "Greek Yogurt",
    kcal: 280,
    unit: "1 serving",
    image: IMG_GREEK_YOGURT,
    bestFor: [2, 4],
    tags: ["Vegetarian", "High Protein"],
    focus: [5, 2],
    type: "Veg",
    protein: 25,
    carbs: 20,
    fat: 8,
    isFavorite: false,
  },
  {
    id: 205,
    title: "Walnuts",
    kcal: 185,
    unit: "30 grams",
    image: IMG_WALNUTS,
    bestFor: [4, 5],
    tags: ["Vegetarian", "Keto"],
    focus: [6, 1],
    type: "Veg",
    protein: 4,
    carbs: 4,
    fat: 18,
    isFavorite: false,
  },
];

export const DAILY_PLAN_DATE = "2025-10-18T00:00:00Z";


// ----------------------------------------------------------------------
// 📊 Nutrition Summary Helper
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

// 🔍 Search and Filter Helper
export const filterFoods = (foods, searchTerm, dietFilter, focusFilter) => {
  return foods.filter((food) => {
    const matchesSearch = food.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDiet =
      dietFilter.length === 0 || dietFilter.some((tag) => food.tags.includes(tag));
    const matchesFocus =
      focusFilter.length === 0 ||
      focusFilter.some((focus) => food.focus.includes(focus.id));
    return matchesSearch && matchesDiet && matchesFocus;
  });
};
