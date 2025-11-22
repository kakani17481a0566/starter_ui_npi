import axios from "axios";

const BASE_URL = "https://localhost:7098";

// --------------------------------------------
// 1. Fetch Meal Monitoring
// --------------------------------------------
export async function fetchMealMonitoring(userId, tenantId) {
  const url = `${BASE_URL}/api/MealPlanMonitoring/monitor/user/${userId}/tenant/${tenantId}`;
  const res = await axios.get(url);
  return res.data?.data;
}

// --------------------------------------------
// 2. Save User Feedback (Mood)
// --------------------------------------------
export async function saveMood({ userId, tenantId, questionId, text, date }) {
  const url = `${BASE_URL}/api/UserFeedback/save/user/${userId}/tenant/${tenantId}`;

  const payload = {
    feedbackTypeId: questionId,
    feedbackText: text,
    date: date, // 🔥 EXACT backend date (yesterday)
  };

  const res = await axios.post(url, payload);
  return res.data;
}

// --------------------------------------------
// 3. Fetch Feedback Questions
// --------------------------------------------
export async function fetchFeedbackQuestions(userId, tenantId) {
  const url = `${BASE_URL}/api/UserFeedback/questions/user/${userId}/tenant/${tenantId}`;
  const res = await axios.get(url);
  return res.data?.data || [];
}

// --------------------------------------------
// 4. Save Meal Tracking
// --------------------------------------------
export async function saveMealsTracking(userId, tenantId, payload) {
  const url = `${BASE_URL}/api/MealPlanMonitoring/track/user/${userId}/tenant/${tenantId}`;
  const res = await axios.post(url, payload);
  return res.data?.data;
}
