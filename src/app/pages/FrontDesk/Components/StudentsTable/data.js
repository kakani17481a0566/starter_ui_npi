// src/app/pages/tables/attendece_dash_bord_table/attendecedisplaytable/data.js

import axiosInstance from "utils/axios";
import { AttendanceAPI } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";

// 🔑 Explicit export (so other files can import it)
export let attendanceStatusOptions = [];

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

    const data = response.data?.data ?? {
      records: [],
      headers: [],
      courses: [],
      totalStudents: 0,
      checkedInCount: 0,
      checkedOutCount: 0,
      notMarkedCount: 0,
      unknownCount: 0,
    };

    // 🔑 Build status options directly matching backend values
    attendanceStatusOptions = Object.keys(data)
      .filter((key) => key.endsWith("Count")) // e.g. "notMarkedCount"
      .map((key) => {
        const raw = key.replace("Count", ""); // "notMarked"
        const label = raw
          .replace(/([A-Z])/g, " $1") // "not Marked"
          .replace(/^./, (s) => s.toUpperCase()); // "Not Marked"

        return {
          value: label, // ✅ same as backend string
          label,
          color:
            label.toLowerCase().includes("in")
              ? "success"
              : label.toLowerCase().includes("out")
              ? "warning"
              : label.toLowerCase().includes("not")
              ? "error"
              : "dark",
        };
      });

    return { ...data, attendanceStatusOptions };
  } catch (error) {
    console.error("❌ Failed to fetch attendance summary", error);
    attendanceStatusOptions = [];
    return {
      records: [],
      headers: [],
      courses: [],
      totalStudents: 0,
      checkedInCount: 0,
      checkedOutCount: 0,
      notMarkedCount: 0,
      unknownCount: 0,
      attendanceStatusOptions,
    };
  }
}
