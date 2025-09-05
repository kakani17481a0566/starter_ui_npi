import axios from "axios";

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
