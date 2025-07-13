// src/app/pages/dashboards/teacher/MediaTable/weektimetabledata.js
import axiosInstance from "utils/axios";
import { handleAxiosError } from "utils/handleAxiosError";

export async function fetchWeekTimeTableData() {
  try {
    const res = await axiosInstance.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/TimeTable/weekId/5/tenantId/1/courseId/4"
    );

    const data = res.data?.data ?? {};

    return {
      weekName: data.weekName,
      currentDate: data.currentDate,
      month: data.month,
      course: data.course,
      courseId: data.courseId,
      events: data.events || [],
      headers: data.headers || [],
      timeTableData: data.timeTableData || [],
      resources: data.resources || {},
    };
  } catch (error) {
    const err = handleAxiosError(error);
    console.error("❌ Failed to fetch week timetable data:", err.message);
    return {
      weekName: "",
      currentDate: "",
      month: "",
      course: "",
      courseId: null,
      events: [],
      headers: [],
      timeTableData: [],
      resources: {},
    };
  }
}
