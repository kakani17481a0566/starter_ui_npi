import axiosInstance from "utils/axios";
import { AttendanceAPI } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";

/**
 * Fetch structured student attendance summary
 * @param {Object} params
 * @param {string} params.date - Format: YYYY-MM-DD
 * @param {number} [params.tenantId] - falls back to session.tenantId
 * @param {number} [params.courseId] - falls back to first course in session, else -1
 * @returns {Promise<{headers: string[], data: object[]}>}
 */
export async function fetchAttendanceSummary({ date, tenantId, courseId } = {}) {
  try {
    if (!date) throw new Error("❌ 'date' is required in fetchAttendanceSummary.");

    const session = getSessionData() || {};

    const tid =
      tenantId ?? (session.tenantId != null ? Number(session.tenantId) : undefined);

    // ✅ branchId from session storage (no hardcoding)
    const bid =
      session.branch != null && session.branch !== ""
        ? Number(session.branch)
        : undefined;

    // Use provided courseId, else first course from session, else -1 (all)
    const cid =
      courseId ??
      (Array.isArray(session.course) && session.course[0]
        ? Number(session.course[0]?.id ?? session.course[0])
        : -1);

    if (!tid) throw new Error("❌ 'tenantId' missing (not in args or session).");
    if (!bid) throw new Error("❌ 'branchId' missing in session.");

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
      error?.response?.data || error.message
    );
    return {
      headers: [],
      data: [],
    };
  }
}
