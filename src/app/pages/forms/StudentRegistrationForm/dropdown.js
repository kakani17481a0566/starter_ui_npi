// src/app/pages/forms/StudentRegistrationForm/dropdown.js
import axios from "axios";

// 🔹 Fetch branch dropdown options
export async function fetchBranchOptions(tenantId = 1) {
  const response = await axios.get(
    `https://localhost:7202/api/Branch/dropdown-options/${tenantId}`
  );
  return (
    response?.data?.data?.map((b) => ({
      value: b.id,
      label: b.name,
    })) ?? []
  );
}

// 🔹 Fetch course dropdown options
export async function fetchCourseOptions(tenantId = 1) {
  const response = await axios.get(
    `https://localhost:7202/api/Course/dropdown-options-course/${tenantId}`
  );
  return (
    response?.data?.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) ?? []
  );
}
