// src/app/pages/tables/attendece_dash_bord_table/attendecedisplaytable/data.js

import axiosInstance from "utils/axios";

// Fetch attendance summary with full response
export async function fetchAttendanceSummary({
  date,
  tenantId = 1,
  branchId = 1,
  courseId = -1,
}) {
  if (!date) {
    throw new Error("❌ 'date' is required in fetchAttendanceSummary.");
  }

  try {
    const response = await axiosInstance.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/summary-structured",
      {
        params: {
          date,
          tenantId,
          branchId,
          courseId,
        },
      }
    );

    return response.data?.data ?? {
      records: [],
      headers: [],
      courses: [],
      totalStudents: 0,
      checkedInCount: 0,
      checkedOutCount: 0,
      notMarkedCount: 0,
      unknownCount: 0,
    };
  } catch (error) {
    console.error("❌ Failed to fetch attendance summary", error);
    return {
      records: [],
      headers: [],
      courses: [],
      totalStudents: 0,
      checkedInCount: 0,
      checkedOutCount: 0,
      notMarkedCount: 0,
      unknownCount: 0,
    };
  }
}
