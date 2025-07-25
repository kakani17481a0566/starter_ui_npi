  import axios from "axios";

  // ✅ Production-ready base URL
  const API_BASE_URL = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

  // ✅ Create a new TimeTableTopic entry
  export const createTimeTableTopic = async (payload) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/TimeTableTopics`,
        payload,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // { statusCode, message, data }
    } catch (error) {
      console.error("❌ Failed to create TimeTableTopic", error);
      throw error;
    }
  };

  // ✅ Fetch mapped dropdown data for cascading dropdowns
  export const fetchTimeTableTopicsDropdown = async (tenantId = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/TimeTableTopics/dropdown-mapped/${tenantId}`,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
      return response.data; // { statusCode, message, data: { courses: [...] } }
    } catch (error) {
      console.error("❌ Failed to fetch TimeTableTopics dropdown data", error);
      throw error;
    }
  };

  export const updateTimeTableTopic = async ({ id, tenantId, topicId, timeTableDetailId, updatedBy }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/TimeTableTopics/${id}/tenant/${tenantId}`,
      {
        topicId,
        timeTableDetailId,
        updatedBy,
      },
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // { statusCode, message, data }
  } catch (error) {
    console.error("❌ Failed to update TimeTableTopic", error);
    throw error;
  }
};
