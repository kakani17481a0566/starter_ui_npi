// src/app/pages/tables/attendece_dash_bord_table/attendecedisplaytable/data.js

import axiosInstance from "utils/axios";
import { AttendanceAPI } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";

// Fetch attendance summary using centralized API path
export async function fetchAttendanceSummary({
  date,
  tenantId,
  branchId,
  courseId = -1,
} = {}) {
  if (!date) {
    throw new Error("❌ 'date' is required in fetchAttendanceSummary.");
  }

  // pull from session if not explicitly provided
  const session = getSessionData() || {};
  const resolvedTenantId =
    tenantId ?? (session.tenantId != null ? Number(session.tenantId) : undefined);
  const resolvedBranchId =
    branchId ?? (session.branch != null ? Number(session.branch) : undefined);

  if (!resolvedTenantId) {
    throw new Error("❌ 'tenantId' is missing (not in args or session).");
  }
  if (!resolvedBranchId) {
    throw new Error("❌ 'branchId' is missing (not in args or session).");
  }

  try {
    const endpoint = AttendanceAPI.summary(
      date,
      resolvedTenantId,
      resolvedBranchId,
      courseId
    );
    const response = await axiosInstance.get(endpoint);

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
