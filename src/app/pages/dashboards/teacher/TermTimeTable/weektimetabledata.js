// src/app/pages/dashboards/teacher/MediaTable/weektimetabledata.js
import axiosInstance from "utils/axios";

export async function fetchWeekTimeTableData() {
  try {
    const res = await axiosInstance.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/TimeTable/weekId/0/tenantId/1/courseId/1"
    );
    return res.data?.data?.timeTableData ?? [];
  } catch (err) {
    console.error("Failed to fetch week timetable data", err);
    return [];
  }
}
