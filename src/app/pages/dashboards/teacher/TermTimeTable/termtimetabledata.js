// src/app/pages/dashboards/teacher/TermTimeTable/termtimetabledata.js
import axiosInstance from "utils/axios";
import { getSessionData } from "utils/sessionStorage";
import { TermTimeTableAPI } from "constants/apis"; // 🆕 Use centralized API

// ✅ Accept dynamic courseId as object parameter
export async function fetchTermTimeTableData({ courseId }) {
  try {
    if (!courseId) return { headers: {}, timeTableData: [] };

    const { tenantId } = getSessionData(); // 🆕 Get tenantId dynamically
    const url = TermTimeTableAPI.getMatrix(tenantId, courseId, 1); // 🆕 Centralized endpoint

    const res = await axiosInstance.get(url);
    const { headers, dataTerm } = res.data?.data ?? {};

    if (!Array.isArray(dataTerm)) return { headers: {}, timeTableData: [] };

    return {
      headers,
      timeTableData: dataTerm.map((row) => ({
        column1: row.coluM1,
        column2: row.coluM2,
        column3: row.coluM3,
        column4: row.coluM4,
        column5: row.coluM5,
        column6: row.coluM6,
        column7: row.coluM7,
      })),
    };
  } catch (err) {
    console.error("❌ Failed to fetch term timetable data", err);
    return { headers: {}, timeTableData: [] };
  }
}
