import axios from "axios";

// ✅ Production-ready base URL
const API_BASE_URL = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

// ✅ Create a new topic entry
export const createTopic = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Topic`, payload, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data; // { statusCode, message, data }
  } catch (error) {
    console.error("❌ Failed to create topic", error);
    throw error;
  }
};

// ✅ Fetch timetable dropdown data (courses + nested subjects + topicTypes)
export const fetchTimeTableDropdown = async (tenantId = 1) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Topic/timetable-dropdown/${tenantId}`,
      {
        headers: {
          Accept: "*/*",
        },
      }
    );
    return response.data; // { statusCode, message, data: { courses, topicTypes } }
  } catch (error) {
    console.error("❌ Failed to fetch timetable dropdown data", error);
    throw error;
  }
};
