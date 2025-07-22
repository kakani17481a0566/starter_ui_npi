import axios from "axios";

// ✅ Centralized production API URL
const API_BASE_URL = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

// ✅ Create a new timetable entry
export const createTimeTable = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/TimeTable`, payload, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create timetable", error);
    throw error;
  }
};

// ✅ Fetch insert options for the timetable form
export const fetchTimeTableInsertOptions = async (tenantId = 1) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/TimeTable/insert-options-time-table/${tenantId}`,
      {
        headers: {
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch insert options", error);
    throw error;
  }
};
