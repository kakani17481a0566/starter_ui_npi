// Time windows for the chips on top
export const MEAL_WINDOWS = [
  { id: "breakfast", title: "Breakfast",        time: "07:00 - 09:00" },
  { id: "mid",       title: "Mid meal snacks",  time: "11:00 - 11:30" },
  { id: "lunch",     title: "Lunch",            time: "13:00 - 14:00" },
  { id: "snacks",    title: "Snacks",           time: "15:30 - 16:30" },
  { id: "dinner",    title: "Dinner",           time: "20:00 - 21:00" },
];

// Diet filters
export const DIET_TAGS = ["Vegetarian", "Non Vegetarian", "Eggetarian"];

// Nutritional focus filters
export const FOCUS_TAGS = [
  { id: "anti-inflammatory", label: "Increase anti-inflammatory intake" },
  { id: "calcium-phosphate", label: "Maintain calcium–phosphate balance" },
];

// Demo images (swap with your assets if you want)
const IMG = {
  tofu:
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
  salmon:
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
  eggs:
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
  pepper:
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=600&auto=format&fit=crop",
  asparagus:
    "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=600&auto=format&fit=crop",
};

// Master food catalog powering the grid
export const FOODS = [
  {
    id: "tofu",
    title: "Tofu",
    kcal: 240,
    unit: "100 gms",
    image: IMG.tofu,
    tags: ["Vegetarian"],
    focus: ["anti-inflammatory", "calcium-phosphate"],
    bestFor: ["breakfast", "lunch", "dinner"],
  },
  {
    id: "salmon",
    title: "Salmon",
    kcal: 320,
    unit: "100 gms",
    image: IMG.salmon,
    tags: ["Non Vegetarian"],
    focus: ["anti-inflammatory", "calcium-phosphate"],
    bestFor: ["breakfast", "lunch", "dinner"],
  },
  {
    id: "eggs",
    title: "Duck Eggs",
    kcal: 180,
    unit: "2 nos",
    image: IMG.eggs,
    tags: ["Eggetarian"],
    focus: ["calcium-phosphate"],
    bestFor: ["breakfast", "snacks"],
  },
  {
    id: "pepper",
    title: "Red Bell Pepper",
    kcal: 220,
    unit: "1 nos",
    image: IMG.pepper,
    tags: ["Vegetarian"],
    focus: ["anti-inflammatory"],
    bestFor: ["breakfast", "snacks", "mid"],
  },
  {
    id: "asparagus",
    title: "Asparagus",
    kcal: 60,
    unit: "50 gms",
    image: IMG.asparagus,
    tags: ["Vegetarian"],
    focus: ["anti-inflammatory"],
    bestFor: ["breakfast", "lunch", "snacks"],
  },
  {
    id: "Aplle",
    title: "Aplle",
    kcal: 60,
    unit: "50 gms",
    image: IMG.asparagus,
    tags: ["Vegetarian"],
    focus: ["anti-inflammatory"],
    bestFor: ["breakfast", "lunch", "snacks"],
  },
];
