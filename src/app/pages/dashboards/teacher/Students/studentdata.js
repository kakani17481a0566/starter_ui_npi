//src\app\pages\dashboards\teacher\Students\studentdata.js
import axiosInstance from "utils/axios";

export async function fetchStudentsData() {
  try {
    const res = await axiosInstance.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Student/by-tenant-course-branch?tenantId=1&courseId=4&branchId=1"
    );
    return res.data?.data ?? { students: [] };
  } catch (err) {
    console.error("Failed to fetch student data", err);
    return { students: [] };
  }
}
