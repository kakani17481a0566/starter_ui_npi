// src/app/pages/dashboards/teacher/TermTimeTable/termtimetabledata.js
import axiosInstance from "utils/axios";

export async function fetchTermTimeTableData() {
  try {
    const res = await axiosInstance.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VTermTable/get-week-matrix",
      {
        params: {
          tenantId: 1,
          courseId: 1,
          termId: 1,
        },
      }
    );

    const { headers, dataTerm } = res.data?.data ?? {};

    if (!Array.isArray(dataTerm)) return [];

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
    console.error("Failed to fetch term timetable data", err);
    return [];
  }
}
