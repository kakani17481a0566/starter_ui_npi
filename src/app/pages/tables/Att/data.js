import axiosInstance from "utils/axios";
import { AttendanceAPI } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";

/**
 * Fetch structured student attendance summary
 * @param {Object} params
 * @param {string} params.date - Format: YYYY-MM-DD
 * @param {number} [params.tenantId]
 * @param {number} [params.branchId]
 * @param {number} [params.courseId]
 * @returns {Promise<{headers: string[], data: object[]}>}
 */
// export async function fetchAttendanceSummary({ date, tenantId, branchId, courseId }) {
export async function fetchAttendanceSummary({ date, tenantId, courseId }) {
  try {
    const session = getSessionData();

    const tid = tenantId ?? session.tenantId;
    // const bid = branchId ?? session.branch;
    const bid = 1;

    const cid = courseId ?? session.course?.[0]?.id ;

    const endpoint = AttendanceAPI.summary(date, tid, bid, cid);

    const response = await axiosInstance.get(endpoint);

    const result = response?.data?.data || {};

    return {
      headers: Array.isArray(result.headers) ? result.headers : [],
      data: Array.isArray(result.records) ? result.records : [],
    };
  } catch (error) {
    console.error(
      "❌ Error fetching attendance summary:",
      error?.response?.data || error.message,
    );
    return {
      headers: [],
      data: [],
    };
  }
}
