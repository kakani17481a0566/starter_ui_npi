// src/app/pages/dashboards/Exam/ExamVales.js
import axios from "utils/axios"; // ✅ your axios wrapper

// 🔹 Fetch questions from API
export async function fetchQuestions(testId) {
  try {
    const res = await axios.get(`https://localhost:7202/api/CountingTestContent/test/${testId}`);
    // ✅ Transform API data into same structure as before
    return res.data.data.map((item) => ({
      id: item.id,
      label: item.label,
      shape: JSON.parse(`"${item.shape}"`), // converts "\\u26AB" → "⚫"
      count: item.count,
      testId: item.testId,
      testTitle: item.testTitle,
    }));
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    return [];
  }
}
