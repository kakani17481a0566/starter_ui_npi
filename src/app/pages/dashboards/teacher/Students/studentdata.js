import axiosInstance from "utils/axios";
import { StudentAPI } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";

/**
 * Fetch students using tenant, course, branch from session or override via params
 */
export async function fetchStudentsData({
  tenantId,
  courseId,
  branchId,
} = {}) {
  const session = getSessionData();

  const tid = tenantId ?? session.tenantId;
  const cid = courseId ?? session.course?.[0]?.id;
  const bid = branchId ?? session.branch;

  if (!tid || !cid || !bid) {
    console.error("Missing tenantId, courseId, or branchId");
    return { students: [] };
  }

  try {
    const url = StudentAPI.byTenantCourseBranch(tid, cid, bid);
    const res = await axiosInstance.get(url);
    return res.data?.data ?? { students: [] };
  } catch (err) {
    console.error("Failed to fetch student data", err);
    return { students: [] };
  }
}
