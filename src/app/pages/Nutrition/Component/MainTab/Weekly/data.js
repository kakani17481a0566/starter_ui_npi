import axios from "axios";

const API_BASE = "https://localhost:7098/api/MealPlanMonitoring";

export async function fetchWeeklyPlan(userId = 1, tenantId = 1) {
  try {
    const res = await axios.get(
      `${API_BASE}/7days/user/${userId}/tenant/${tenantId}`
    );

    if (res.data?.statusCode !== 200) return { days: [], unlockNote: null };

    const apiData = res.data.data;

    // days already contain fullDate → no conversion needed
    const days = apiData.days;

    const unlockNote = apiData.unlockNote;

    return { days, unlockNote };

  } catch (err) {
    console.error("Weekly plan error:", err);
    return { days: [], unlockNote: null };
  }
}
