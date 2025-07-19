// src/app/pages/dashboards/teacher/MediaTable/weektimetabledata.js
import axiosInstance from "utils/axios";
import { handleAxiosError } from "utils/handleAxiosError";
import { getSessionData } from "utils/sessionStorage";

export async function fetchWeekTimeTableData(courseId) {
  const { tenantId, week } = getSessionData();

  if (!courseId || !tenantId || !week) {
    console.warn("Missing required params: courseId, tenantId, or week");
    return defaultResponse();
  }

  try {
    const res = await axiosInstance.get(
      `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/TimeTable/weekId/${week}/tenantId/${tenantId}/courseId/${courseId}`
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
    return defaultResponse();
  }
}

function defaultResponse() {
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
