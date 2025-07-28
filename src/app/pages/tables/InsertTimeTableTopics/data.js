// src/app/pages/dashboards/teacher/MediaTable/data.js

import axiosInstance from "utils/axios";

/**
 * Fetch structured Time Table Topics data by tenantId.
 * Authorization token is automatically attached via axiosInstance.
 *
 * @param {number} tenantId
 * @returns {Promise<{ headers: string[], data: object[] }>}
 */
export const fetchTimeTableTopicsStructuredData = async (tenantId = 1) => {
  const endpoint = `/TimeTableTopics/structured/${tenantId}`;

  try {
    console.log("📡 Requesting structured timetable topics:");
    console.log("🔗 Full URL:", axiosInstance.defaults.baseURL + endpoint);

    const response = await axiosInstance.get(endpoint);

    const { status, data } = response;

    if (status === 200 && data?.data) {
      const { headers = [], tDataTimeTableTopics = [] } = data.data;

      console.log("✅ [200 OK] Time Table Topics fetched:", {
        headersCount: headers.length,
        recordsCount: tDataTimeTableTopics.length,
      });

      return {
        headers,
        data: tDataTimeTableTopics,
      };
    }

    console.warn("⚠️ Unexpected response structure received:", data);
    return { headers: [], data: [] };

  } catch (error) {
    console.error("❌ [ERROR] Failed to fetch Time Table Topics:", error.message);
    return { headers: [], data: [] };
  }
};
