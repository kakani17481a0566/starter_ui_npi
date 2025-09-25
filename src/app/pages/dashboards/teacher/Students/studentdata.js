import axiosInstance from "utils/axios";
import { StudentAPI } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";

/**
 * Fetch students using tenant, courseId (if available) or courseName + branch
 */
export async function fetchStudentsData({
  tenantId,
  courseId,
  courseName,
  branchId,
} = {}) {
  const session = getSessionData();

  const tid = tenantId ?? session.tenantId;
  const cid = courseId ?? session.course?.[0]?.id ?? null;
  const cname = courseName ?? session.course?.[0]?.name ?? null;
  const bid = branchId ?? session.branch;

  if (!tid || !bid || (!cid && !cname)) {
    console.error("❌ Missing tenantId / branchId / course info");
    return { students: [] };
  }

  try {
    let url;
    if (cid) {
      // Prefer courseId when available
      url = StudentAPI.byTenantCourseBranch(tid, cid, bid);
    } else {
      // Fallback to courseName
      url = StudentAPI.byTenantCourseNameBranch(tid, cname, bid);
    }

    const res = await axiosInstance.get(url);
    return res.data?.data ?? { students: [] };
  } catch (err) {
    console.error("❌ Failed to fetch student data", err);
    return { students: [] };
  }
}
