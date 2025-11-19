// export const days = [
//   { date: 18, month: "OCTOBER", weekday: "Saturday", calories: 1252, statusText: "Nutrition goal achieved", statusType: "success" },
//   { date: 19, month: "OCTOBER", weekday: "Sunday", calories: 900, statusText: "Nutrition goal not achieved", statusType: "danger" },
//   { date: 20, month: "OCTOBER", weekday: "Monday", calories: 1252, statusText: "Review your plan for the day", statusType: "info" },
//   { date: 21, month: "OCTOBER", weekday: "Tuesday", calories: 0, statusText: "---", statusType: "muted" },
//   { date: 22, month: "OCTOBER", weekday: "Wednesday", calories: 0, statusText: "---", statusType: "muted" },
//   { date: 23, month: "OCTOBER", weekday: "Thursday", calories: 0, statusText: "---", statusType: "muted" },
//   { date: 24, month: "OCTOBER", weekday: "Friday", calories: 0, statusText: "---", statusType: "muted" },
//   { date: 25, month: "OCTOBER", weekday: "Saturday", calories: 0, statusText: "", statusType: "muted" },
// ];

// export const unlockNote = {
//   enabled: true,
//   textTop: "Next week schedule unlocks on",
//   textBottom: "23 Thursday, October.",
// };


// src/app/pages/Nutrition/Component/MainTab/Weekly/data.js
import axios from "axios";

const API_BASE = "https://localhost:7098/api/MealPlanMonitoring";

export async function fetchWeeklyPlan(userId = 1, tenantId = 1) {
  try {
    const res = await axios.get(`${API_BASE}/7days/user/${userId}/tenant/${tenantId}`);

    if (res.data?.statusCode !== 200) {
      console.error("API Error:", res.data?.message);
      return { days: [], unlockNote: null };
    }

    const apiData = res.data.data;

    // Map backend structure → frontend props
    const days = apiData.days.map((d) => ({
      date: d.date,
      month: d.month,
      weekday: d.weekday,
      calories: d.calories,
      statusText: d.statusText,
      statusType: d.statusType,
    }));

    const unlockNote = {
      enabled: apiData.unlockNote.enabled,
      textTop: apiData.unlockNote.textTop,
      textBottom: apiData.unlockNote.textBottom,
    };

    return { days, unlockNote };
  } catch (error) {
    console.error("Failed to load weekly meal plan:", error);
    return { days: [], unlockNote: null };
  }
}


