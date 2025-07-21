//C:\Users\KAKANI\Documents\GitHub\starter_ui_npi\src\app\pages\tables\ParentTeacherDashbord\performanceSummaryData.js
import axios from "axios";

export async function fetchPerformanceSummary({ tenantId = 1, courseId = 1, branchId = 1, weekId = 0 }) {
  try {
    const response = await axios.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/DailyAssessment/performance-summary",
      {
        params: {
          tenantId,
          courseId,
          branchId,
          weekId
        },
        headers: {
          accept: "*/*"
        }
      }
    );

    // ✅ Return only the actual data object for clean access in components
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch performance summary:", error);
    throw error;
  }
}
