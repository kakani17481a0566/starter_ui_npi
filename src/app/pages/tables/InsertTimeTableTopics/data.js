import axios from "axios";

const API_BASE_URL = "https://localhost:7202/api";

/**
 * Fetches structured Time Table Topics data by tenantId
 */
export const fetchTimeTableTopicsStructuredData = async (tenantId = 1) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/TimeTableTopics/structured/${tenantId}`,
      {
        headers: {
          Accept: "*/*",
        },
      }
    );

    // The API returns { data: { headers, tDataTimeTableTopics } }
    if (response.status === 200 && response.data?.data) {
      const { headers, tDataTimeTableTopics } = response.data.data;
      return {
        headers,
        data: tDataTimeTableTopics,
      };
    }

    return {
      headers: [],
      data: [],
    };
  } catch (error) {
    console.error("❌ Failed to fetch structured time table topics data:", error);
    return {
      headers: [],
      data: [],
    };
  }
};
