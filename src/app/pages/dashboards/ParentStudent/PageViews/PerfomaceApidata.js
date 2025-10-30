import axios from "axios";
import { useEffect, useState } from "react";
import {setSelectedCourseId,setSelectedStudentId} from "utils/sessionStorage";


// API call wrapper
export async function fetchStudentPerformance({
  tenantId,
  courseId,
  branchId,
  weekId,
  studentId,
}) {
  try {
    const response = await axios.get(
      `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/DailyAssessment/performance-summary/student`,
      { params: { tenantId, courseId, branchId, weekId, studentId } }
    );

    if (response.data?.statusCode === 200) {
      return response.data.data;
    } else {
      console.warn("Unexpected response:", response.data);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching performance summary:", error);
    return null;
  }
}

// React hook
export function useStudentPerformance({
  tenantId,
  courseId,
  branchId,
  weekId,
  studentId,
}) {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  setSelectedStudentId(studentId);
  setSelectedCourseId(courseId);

  useEffect(() => {
    async function loadData() {
      if (!studentId) return; // wait until kid is selected
      setLoading(true);
      const data = await fetchStudentPerformance({
        tenantId,
        courseId,
        branchId,
        weekId,
        studentId,
      });
      setPerformanceData(data);
      setLoading(false);
    }
    loadData();
  }, [tenantId, courseId, branchId, weekId, studentId]);

  return { performanceData, loading };
}
