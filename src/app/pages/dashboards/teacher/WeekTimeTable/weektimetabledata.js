// src/app/pages/dashboards/teacher/MediaTable/weektimetabledata.js

import axiosInstance from "utils/axios";
import { handleAxiosError } from "utils/handleAxiosError";
import { getSessionData } from "utils/sessionStorage";
import { ACTIVE_API_BASE_URL } from "configs/auth.config";

/**
 * Fetches structured timetable data for a given course and week.
 * Pulls tenantId and weekId from session storage.
 *
 * @param {number} courseId - The ID of the selected course.
 * @returns {Promise<Object>} Timetable structure or fallback response.
 */
export async function fetchWeekTimeTableData(courseId) {
  const { tenantId, week } = getSessionData();

  // Validate required values from session
  if (!courseId || !tenantId || !week) {
    console.warn("⚠️ Missing courseId, tenantId, or weekId.");
    return defaultResponse();
  }

  try {
    const endpoint = `${ACTIVE_API_BASE_URL}/TimeTable/weekId/${week}/tenantId/${tenantId}/courseId/${courseId}`;
    const response = await axiosInstance.get(endpoint);

    const data = response.data?.data ?? {};

    return {
      weekName: data.weekName || "",
      currentDate: data.currentDate || "",
      month: data.month || "",
      course: data.course || "",
      courseId: data.courseId || null,
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

/**
 * Provides a safe fallback response structure.
 * Useful when request fails or required parameters are missing.
 */
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
