// src/app/pages/tables/attendece_dash_bord_table/OrdersTable/data.js
import axiosInstance from "utils/axios";

// Fetch attendance summary from the structured summary API
export async function fetchAttendanceSummary({ date = "2025-07-12" }) {
  try {
    const response = await axiosInstance.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/summary-structured",
      {
        params: {
          date,
          tenantId: 1,
          branchId: 1,
          courseId: -1,
        },
      }
    );

    return response.data?.data ?? { records: [], courses: [], headers: [] };
  } catch (error) {
    console.error("❌ Failed to fetch attendance summary", error);
    return { records: [], courses: [], headers: [] };
  }
}
