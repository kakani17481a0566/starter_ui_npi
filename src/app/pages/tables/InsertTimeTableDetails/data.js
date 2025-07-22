// const API_BASE_URL = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

import axios from "axios";

/**
 * Fetches dynamic timetable details for a specific tenant.
 * @param {number} tenantId
 * @returns {Promise<{tableHeaders: Array, data: Array}>} Response in dynamic table format
 */
export const fetchTimeTableDetails = async (tenantId = 1) => {
  try {
    // Use API_BASE_URL for cloud, or localhost for local testing
    // const url = `${API_BASE_URL}/TimeTableDetail/timetabledetails/${tenantId}`;
    const url = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/TimeTableDetail/timetabledetails/${tenantId}`;

    const response = await axios.get(url, {
      headers: {
        Accept: "*/*",
      },
    });

    // Defensive: Ensure API response is in expected shape
    const data = response?.data?.data;
    if (
      response.status === 200 &&
      data &&
      Array.isArray(data.tableHeaders) &&
      Array.isArray(data.data)
    ) {
      return data;
    }
    // If the shape is not as expected, return empty arrays
    return { tableHeaders: [], data: [] };
  } catch (error) {
    console.error("Failed to fetch timetable details:", error);
    return { tableHeaders: [], data: [] };
  }
};
