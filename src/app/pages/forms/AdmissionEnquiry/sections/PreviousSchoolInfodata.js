// src/app/pages/forms/AdmissionEnquiry/sections/PreviousSchoolInfodata.js

import axios from "axios";

export async function getCourses(tenantId = 1) {
  try {
    const response = await axios.get(`/api/Course/dropdown-options-course/${tenantId}`);
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return [];
  }
}
