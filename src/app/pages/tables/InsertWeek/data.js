//src\app\pages\tables\InsertWeek\data.js
import axios from "axios";

// const API_URL = "https://localhost:7202/api/Week/tenant/1";

// const API_BASE_URL=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;


/**
 * Fetches week list for a specific tenant
 * @returns {Promise<Array>} List of weeks sorted by startDate
 */
export const fetchWeekList = async (tenantId = 1) => {
  try {
    const response = await axios.get(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Week/tenant/${tenantId}`);
    if (response.status === 200 && Array.isArray(response.data.data)) {
      return response.data.data.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch week list:", error);
    return [];
  }
};
