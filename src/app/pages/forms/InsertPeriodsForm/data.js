import axios from "axios";

// Fetch list of courses
export const fetchCourseList = async () => {
  try {
    const response = await axios.get("https://localhost:7202/api/Course");
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return [];
  }
};

// Create a new period
export const createPeriod = async (payload) => {
  return axios.post("https://localhost:7202/api/Period", payload);
};

// Fetch tenant details by ID
export const fetchTenantById = async (tenantId = 1) => {
  try {
    const response = await axios.get(`https://localhost:7202/api/Tenants/${tenantId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to fetch tenant", error);
    return null;
  }
};
