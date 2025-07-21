// src/app/pages/tables/InsertPeriods/data.js
import axios from "axios";

// const API_BASE_URL = "https://localhost:7202/api";
const API_BASE_URL=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;


/**
 * Fetches structured Period table data based on tenant and course
 */
export const fetchPeriodTableData = async (tenantId = 1, courseId = -1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Period/table-data`, {
      params: { tenantId, courseId },
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status === 200 && response.data?.data) {
      const { headers, data, filterData } = response.data.data;
      const courses = filterData?.courses || [];
      return { headers, data, courses };
    }

    return { headers: {}, data: [], courses: [] };
  } catch (error) {
    console.error(`❌ Failed to fetch period data:`, error);
    return { headers: {}, data: [], courses: [] };
  }
};

/**
 * Fetches course list for a specific tenant
 */
export const fetchCoursesByTenant = async (tenantId = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Course/tenant/${tenantId}`, {
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status === 200 && Array.isArray(response.data?.data)) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error(`❌ Failed to fetch courses:`, error);
    return [];
  }
};
