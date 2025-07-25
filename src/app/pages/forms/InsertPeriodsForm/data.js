//src\app\pages\forms\InsertPeriodsForm\data.js
import axios from "axios";

// Fetch list of courses
export const fetchCourseList = async () => {
  try {
    const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Course");
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return [];
  }
};

// Create a new period
export const createPeriod = async (payload) => {
  return axios.post("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Period", payload);
};

// Fetch tenant details by ID
export const fetchTenantById = async (tenantId = 1) => {
  try {
    const response = await axios.get(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Tenants/${tenantId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to fetch tenant", error);
    return null;
  }
};

// Update an existing period by ID and tenant
export const updatePeriod = async ({ id, tenantId, payload }) => {
  try {
    const response = await axios.put(
      `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Period/${id}/tenant/${tenantId}`,
      payload,
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update period", error);
    throw error;
  }
};