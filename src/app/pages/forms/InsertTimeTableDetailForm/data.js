import axios from "axios";

// ✅ Centralized local API URL (switch to API_BASE_URL for prod)
const API_BASE_URL = "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api";

// ✅ Create a new timetable detail entry
export const createTimeTableDetail = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/TimeTableDetail`,
      payload,
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // { statusCode, message, data: { ... } }
  } catch (error) {
    console.error("❌ Failed to create timetable detail", error);
    throw error;
  }
};

// ✅ Fetch insert options for the timetable detail form
export const fetchTimeTableDetailInsertOptions = async (tenantId = 1) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/TimeTableDetail/insert-options/${tenantId}`,
      {
        headers: {
          Accept: "*/*",
        },
      }
    );
    return response.data; // { statusCode, message, data: { ... } }
  } catch (error) {
    console.error("❌ Failed to fetch insert options", error);
    throw error;
  }
};
