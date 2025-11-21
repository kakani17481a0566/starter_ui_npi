// src/data.js

export const saveMood = async (text) => {
  return new Promise((resolve) => {
    console.log("Simulating API call with text:", text);
    setTimeout(() => {
      resolve({ success: true, message: "Mood saved successfully!" });
    }, 1000);
  });
};


export const mealWindows = [
  { id: 1, title: "Breakfast", time: "07:00 - 09:00" },
  { id: 2, title: "Mid meal snacks", time: "11:00 - 11:30" },
  { id: 3, title: "Lunch", time: "13:00 - 14:00" },
  { id: 4, title: "Snacks", time: "15:30 - 16:30" },
  { id: 5, title: "Dinner", time: "20:00 - 21:00" },
];

export const foods = [
  {
    id: 101,
    title: "Tofu",
    kcal: 250,
    unit: "100 grams",
    itemImage:
      "https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=150&q=80",
    focus: [1, 2],
  },
  {
    id: 102,
    title: "Asparagus",
    kcal: 50,
    unit: "50 grams",
    itemImage:
      "https://images.unsplash.com/photo-1515041219749-b934d9d877ca?auto=format&fit=crop&w=150&q=80",
    focus: [1],
  },
  {
    id: 103,
    title: "Red Bell Pepper",
    kcal: 250,
    unit: "1 nos",
    itemImage:
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=150&q=80",
    focus: [3],
  },
];

export const focusTags = [
  { id: 1, label: "Increase anti-inflammatory intake." },
  { id: 2, label: "Maintain calcium-phosphate balance" },
  { id: 3, label: "Vitamin C boost" },
];
