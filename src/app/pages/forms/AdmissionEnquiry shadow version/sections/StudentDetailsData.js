import axios from "axios";

// 🔹 Fetch GENDER options
export async function fetchGenderOptions() {
  const response = await axios.get(
    "https://localhost:7202/getByMasterTypeId/49/1?isUtilites=false"
  );

  if (response.data?.statusCode === 200 && Array.isArray(response.data?.data)) {
    return response.data.data.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }

  return [];
}

// 🔹 Fetch BRANCH options
export async function fetchBranchOptions(tenantId = 1) {
  const response = await axios.get(
    `https://localhost:7202/api/Branch/dropdown-options/${tenantId}`
  );

  if (response.data?.statusCode === 200 && Array.isArray(response.data?.data)) {
    return response.data.data.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }

  return [];
}

// 🔹 Fetch COURSE options
export async function fetchCourseOptions(tenantId = 1) {
  const response = await axios.get(
    `https://localhost:7202/api/Course/dropdown-options-course/${tenantId}`
  );

  if (response.data?.statusCode === 200 && Array.isArray(response.data?.data)) {
    return response.data.data.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }

  return [];
}
