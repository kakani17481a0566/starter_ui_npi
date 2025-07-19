import axiosInstance from "utils/axios";
import { handleAxiosError } from "utils/handleAxiosError";
import { getSessionData } from "utils/sessionStorage";

export async function fetchWeekTimeTableData(courseIdOverride) {
  const { course, tenantId, week } = getSessionData();

  // ✅ Fallback logic: if no override passed, use first course from session or default to 1
  const courseId = courseIdOverride ?? (Array.isArray(course) && course.length > 0 ? course[0].id : 1);

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
 