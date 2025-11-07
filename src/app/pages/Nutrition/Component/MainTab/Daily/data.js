// Images (replace with your URLs or local assets)
const IMG_TOFU = "https://images.unsplash.com/photo-1604908176997-431a1a5c7af1?q=80&w=256&auto=format&fit=crop";
const IMG_ASPARAGUS = "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=256&auto=format&fit=crop";
const IMG_BELL = "https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=256&auto=format&fit=crop";
const IMG_AVOCADO = "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=256&auto=format&fit=crop";
const IMG_SALMON = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=256&auto=format&fit=crop";
const IMG_QUINOA = "https://images.unsplash.com/photo-1598965675045-8d5d5ca64681?q=80&w=256&auto=format&fit=crop";
const IMG_CHICKEN = "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=256&auto=format&fit=crop";
const IMG_BROCCOLI = "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=256&auto=format&fit=crop";
const IMG_EGGS = "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=256&auto=format&fit=crop";
const IMG_OATS = "https://images.unsplash.com/photo-1623654870584-87f5268827c8?q=80&w=256&auto=format&fit=crop";
// const IMG_YOGURT = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=256&auto=format&fit=crop";
const IMG_ALMONDS = "https://images.unsplash.com/photo-1587132137058-ceb4ac76b930?q=80&w=256&auto=format&fit=crop";
const IMG_BROWN_RICE = "https://images.unsplash.com/photo-1598866592122-6e5edb52f98c?q=80&w=256&auto=format&fit=crop";
const IMG_SPINACH = "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=256&auto=format&fit=crop";
const IMG_SWEET_POTATO = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=256&auto=format&fit=crop";
const IMG_PROTEIN_SHAKE = "https://images.unsplash.com/photo-1593095948071-474c0f660d53?q=80&w=256&auto=format&fit=crop";
const IMG_APPLE = "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=256&auto=format&fit=crop";
const IMG_BANANA = "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=256&auto=format&fit=crop";
const IMG_WALNUTS = "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=256&auto=format&fit=crop";
const IMG_GREEK_YOGURT = "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=256&auto=format&fit=crop";

// 🥣 All Meal Sections
export const MEAL_SECTIONS = [
  {
    id: 1,
    title: "Breakfast",
    time: "07:00 - 09:00",
    items: [
      {
        id: 101,
        title: "Tofu Scramble",
        kcalPerUnit: 250,
        unitLabel: "100 grams",
        image: IMG_TOFU,
        protein: 20,
        carbs: 8,
        fat: 15
      },
      {
        id: 102,
        title: "Steamed Asparagus",
        kcalPerUnit: 50,
        unitLabel: "50 grams",
        image: IMG_ASPARAGUS,
        protein: 5,
        carbs: 8,
        fat: 0
      },
      {
        id: 103,
        title: "Red Bell Pepper",
        kcalPerUnit: 250,
        unitLabel: "1 nos",
        image: IMG_BELL,
        protein: 2,
        carbs: 9,
        fat: 0
      },
      {
        id: 104,
        title: "Oatmeal with Berries",
        kcalPerUnit: 350,
        unitLabel: "1 bowl",
        image: IMG_OATS,
        protein: 12,
        carbs: 65,
        fat: 6
      },
      {
        id: 105,
        title: "Greek Yogurt Parfait",
        kcalPerUnit: 280,
        unitLabel: "1 serving",
        image: IMG_GREEK_YOGURT,
        protein: 25,
        carbs: 20,
        fat: 8
      }
    ],
  },
  {
    id: 2,
    title: "Mid Meal Snacks",
    time: "11:00 - 11:30",
    items: [
      {
        id: 201,
        title: "Apple Slices",
        kcalPerUnit: 95,
        unitLabel: "1 medium",
        image: IMG_APPLE,
        protein: 0,
        carbs: 25,
        fat: 0
      },
      {
        id: 202,
        title: "Almonds",
        kcalPerUnit: 160,
        unitLabel: "30 grams",
        image: IMG_ALMONDS,
        protein: 6,
        carbs: 6,
        fat: 14
      },
      {
        id: 203,
        title: "Protein Shake",
        kcalPerUnit: 120,
        unitLabel: "1 scoop",
        image: IMG_PROTEIN_SHAKE,
        protein: 24,
        carbs: 3,
        fat: 1
      }
    ],
  },
  {
    id: 3,
    title: "Lunch",
    time: "13:00 - 14:00",
    items: [
      {
        id: 301,
        title: "Grilled Salmon",
        kcalPerUnit: 280,
        unitLabel: "150 grams",
        image: IMG_SALMON,
        protein: 34,
        carbs: 0,
        fat: 15
      },
      {
        id: 302,
        title: "Quinoa Salad",
        kcalPerUnit: 220,
        unitLabel: "1 cup",
        image: IMG_QUINOA,
        protein: 8,
        carbs: 39,
        fat: 4
      },
      {
        id: 303,
        title: "Steamed Broccoli",
        kcalPerUnit: 55,
        unitLabel: "100 grams",
        image: IMG_BROCCOLI,
        protein: 4,
        carbs: 11,
        fat: 1
      },
      {
        id: 304,
        title: "Brown Rice",
        kcalPerUnit: 215,
        unitLabel: "1 cup",
        image: IMG_BROWN_RICE,
        protein: 5,
        carbs: 45,
        fat: 2
      }
    ],
  },
  {
    id: 4,
    title: "Snacks",
    time: "15:30 - 16:30",
    items: [
      {
        id: 401,
        title: "Banana",
        kcalPerUnit: 105,
        unitLabel: "1 medium",
        image: IMG_BANANA,
        protein: 1,
        carbs: 27,
        fat: 0
      },
      {
        id: 402,
        title: "Walnuts",
        kcalPerUnit: 185,
        unitLabel: "30 grams",
        image: IMG_WALNUTS,
        protein: 4,
        carbs: 4,
        fat: 18
      },
      {
        id: 403,
        title: "Hard Boiled Eggs",
        kcalPerUnit: 155,
        unitLabel: "2 eggs",
        image: IMG_EGGS,
        protein: 13,
        carbs: 1,
        fat: 11
      }
    ],
  },
  {
    id: 5,
    title: "Dinner",
    time: "20:00 - 21:00",
    items: [
      {
        id: 501,
        title: "Grilled Chicken Breast",
        kcalPerUnit: 165,
        unitLabel: "150 grams",
        image: IMG_CHICKEN,
        protein: 31,
        carbs: 0,
        fat: 4
      },
      {
        id: 502,
        title: "Sweet Potato Mash",
        kcalPerUnit: 180,
        unitLabel: "1 cup",
        image: IMG_SWEET_POTATO,
        protein: 4,
        carbs: 41,
        fat: 0
      },
      {
        id: 503,
        title: "Sautéed Spinach",
        kcalPerUnit: 40,
        unitLabel: "100 grams",
        image: IMG_SPINACH,
        protein: 5,
        carbs: 6,
        fat: 0
      },
      {
        id: 504,
        title: "Avocado Salad",
        kcalPerUnit: 160,
        unitLabel: "1 serving",
        image: IMG_AVOCADO,
        protein: 2,
        carbs: 9,
        fat: 15
      }
    ],
  },
];

// 🍽️ Filter presets
export const MEAL_WINDOWS = [
  { id: 1, title: "Breakfast", time: "07:00 - 09:00" },
  { id: 2, title: "Mid Meal", time: "11:00 - 11:30" },
  { id: 3, title: "Lunch", time: "13:00 - 14:00" },
  { id: 4, title: "Snacks", time: "15:30 - 16:30" },
  { id: 5, title: "Dinner", time: "20:00 - 21:00" },
];

export const DIET_TAGS = ["Vegan", "Keto", "High Protein", "Low Carb", "Vegetarian", "Gluten Free", "Dairy Free"];

export const FOCUS_TAGS = [
  { id: 1, label: "Muscle Gain" },
  { id: 2, label: "Immunity" },
  { id: 3, label: "Detox" },
  { id: 4, label: "Weight Loss" },
  { id: 5, label: "Energy Boost" },
  { id: 6, label: "Heart Health" },
];

// 🥗 All Foods (used in DailyPlans)
export const FOODS = [
  // Breakfast Items
  {
    id: 101,
    title: "Tofu Scramble",
    kcal: 250,
    unit: "100 grams",
    image: IMG_TOFU,
    bestFor: [1],
    tags: ["Vegan", "High Protein", "Vegetarian"],
    focus: [1, 4],
    protein: 20,
    carbs: 8,
    fat: 15
  },
  {
    id: 102,
    title: "Steamed Asparagus",
    kcal: 50,
    unit: "50 grams",
    image: IMG_ASPARAGUS,
    bestFor: [1],
    tags: ["Low Carb", "Vegan", "Vegetarian", "Gluten Free"],
    focus: [3, 4],
    protein: 5,
    carbs: 8,
    fat: 0
  },
  {
    id: 103,
    title: "Red Bell Pepper",
    kcal: 250,
    unit: "1 nos",
    image: IMG_BELL,
    bestFor: [1],
    tags: ["Vegan", "Vegetarian", "Low Carb", "Gluten Free"],
    focus: [2, 6],
    protein: 2,
    carbs: 9,
    fat: 0
  },
  {
    id: 104,
    title: "Oatmeal with Berries",
    kcal: 350,
    unit: "1 bowl",
    image: IMG_OATS,
    bestFor: [1],
    tags: ["Vegetarian", "High Protein", "Gluten Free"],
    focus: [5, 6],
    protein: 12,
    carbs: 65,
    fat: 6
  },
  {
    id: 105,
    title: "Greek Yogurt Parfait",
    kcal: 280,
    unit: "1 serving",
    image: IMG_GREEK_YOGURT,
    bestFor: [1],
    tags: ["High Protein", "Vegetarian"],
    focus: [1, 5],
    protein: 25,
    carbs: 20,
    fat: 8
  },

  // Snack Items
  {
    id: 201,
    title: "Apple Slices",
    kcal: 95,
    unit: "1 medium",
    image: IMG_APPLE,
    bestFor: [2, 4],
    tags: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free"],
    focus: [2, 4],
    protein: 0,
    carbs: 25,
    fat: 0
  },
  {
    id: 202,
    title: "Almonds",
    kcal: 160,
    unit: "30 grams",
    image: IMG_ALMONDS,
    bestFor: [2, 4],
    tags: ["Vegan", "Vegetarian", "Keto", "Gluten Free", "Dairy Free"],
    focus: [6, 5],
    protein: 6,
    carbs: 6,
    fat: 14
  },
  {
    id: 203,
    title: "Protein Shake",
    kcal: 120,
    unit: "1 scoop",
    image: IMG_PROTEIN_SHAKE,
    bestFor: [2, 4],
    tags: ["High Protein", "Gluten Free"],
    focus: [1, 5],
    protein: 24,
    carbs: 3,
    fat: 1
  },

  // Lunch Items
  {
    id: 301,
    title: "Grilled Salmon",
    kcal: 280,
    unit: "150 grams",
    image: IMG_SALMON,
    bestFor: [3],
    tags: ["High Protein", "Keto", "Low Carb", "Gluten Free", "Dairy Free"],
    focus: [1, 6],
    protein: 34,
    carbs: 0,
    fat: 15
  },
  {
    id: 302,
    title: "Quinoa Salad",
    kcal: 220,
    unit: "1 cup",
    image: IMG_QUINOA,
    bestFor: [3],
    tags: ["Vegan", "Vegetarian", "High Protein", "Gluten Free"],
    focus: [5, 6],
    protein: 8,
    carbs: 39,
    fat: 4
  },
  {
    id: 303,
    title: "Steamed Broccoli",
    kcal: 55,
    unit: "100 grams",
    image: IMG_BROCCOLI,
    bestFor: [3],
    tags: ["Vegan", "Vegetarian", "Low Carb", "Gluten Free", "Dairy Free"],
    focus: [2, 3],
    protein: 4,
    carbs: 11,
    fat: 1
  },
  {
    id: 304,
    title: "Brown Rice",
    kcal: 215,
    unit: "1 cup",
    image: IMG_BROWN_RICE,
    bestFor: [3],
    tags: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free"],
    focus: [5, 6],
    protein: 5,
    carbs: 45,
    fat: 2
  },

  // Dinner Items
  {
    id: 501,
    title: "Grilled Chicken Breast",
    kcal: 165,
    unit: "150 grams",
    image: IMG_CHICKEN,
    bestFor: [5],
    tags: ["High Protein", "Low Carb", "Keto", "Gluten Free", "Dairy Free"],
    focus: [1, 4],
    protein: 31,
    carbs: 0,
    fat: 4
  },
  {
    id: 502,
    title: "Sweet Potato Mash",
    kcal: 180,
    unit: "1 cup",
    image: IMG_SWEET_POTATO,
    bestFor: [5],
    tags: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free"],
    focus: [5, 6],
    protein: 4,
    carbs: 41,
    fat: 0
  },
  {
    id: 503,
    title: "Sautéed Spinach",
    kcal: 40,
    unit: "100 grams",
    image: IMG_SPINACH,
    bestFor: [5],
    tags: ["Vegan", "Vegetarian", "Low Carb", "Gluten Free", "Dairy Free"],
    focus: [2, 3, 6],
    protein: 5,
    carbs: 6,
    fat: 0
  },
  {
    id: 504,
    title: "Avocado Salad",
    kcal: 160,
    unit: "1 serving",
    image: IMG_AVOCADO,
    bestFor: [5],
    tags: ["Vegan", "Vegetarian", "Keto", "Gluten Free", "Dairy Free"],
    focus: [6, 5],
    protein: 2,
    carbs: 9,
    fat: 15
  },

  // Additional Snack Items
  {
    id: 401,
    title: "Banana",
    kcal: 105,
    unit: "1 medium",
    image: IMG_BANANA,
    bestFor: [4],
    tags: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free"],
    focus: [5],
    protein: 1,
    carbs: 27,
    fat: 0
  },
  {
    id: 402,
    title: "Walnuts",
    kcal: 185,
    unit: "30 grams",
    image: IMG_WALNUTS,
    bestFor: [4],
    tags: ["Vegan", "Vegetarian", "Keto", "Gluten Free", "Dairy Free"],
    focus: [6, 5],
    protein: 4,
    carbs: 4,
    fat: 18
  },
  {
    id: 403,
    title: "Hard Boiled Eggs",
    kcal: 155,
    unit: "2 eggs",
    image: IMG_EGGS,
    bestFor: [4],
    tags: ["High Protein", "Keto", "Low Carb", "Gluten Free", "Dairy Free"],
    focus: [1, 4],
    protein: 13,
    carbs: 1,
    fat: 11
  }
];

// 📊 Nutrition Summary Helper
export const calculateMealNutrition = (mealItems) => {
  return mealItems.reduce((total, item) => ({
    kcal: total.kcal + (item.kcalPerUnit || item.kcal || 0),
    protein: total.protein + (item.protein || 0),
    carbs: total.carbs + (item.carbs || 0),
    fat: total.fat + (item.fat || 0)
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
};

// 🔍 Search and Filter Helper
export const filterFoods = (foods, searchTerm, dietFilter, focusFilter) => {
  return foods.filter(food => {
    const matchesSearch = food.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiet = dietFilter.length === 0 || dietFilter.some(tag => food.tags.includes(tag));
    const matchesFocus = focusFilter.length === 0 || focusFilter.some(focus => food.focus.includes(focus.id));

    return matchesSearch && matchesDiet && matchesFocus;
  });
};