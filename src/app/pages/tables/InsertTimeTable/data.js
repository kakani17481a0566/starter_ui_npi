// src/app/pages/tables/InsertTimeTable/data.js

import axiosInstance from "utils/axios";
import { TimeTableAPI } from "constants/apis";

/**
 * Fetches structured TimeTable data by tenantId
 *
 * @param {number} tenantId - The tenant ID to fetch data for
 * @returns {Promise<{ headers: object[], data: object[], filters: { courses: object, weeks: object, statuses: object } }>}}
 */
export const fetchTimeTableStructuredData = async (tenantId = 1) => {
  const endpoint = TimeTableAPI.structured(tenantId);

  try {
    const response = await axiosInstance.get(endpoint);
    const responseData = response.data?.data;

    if (response.status === 200 && responseData) {
      const { headers, timeTableDataList, filters } = responseData;

      return {
        headers: headers || [],
        data: timeTableDataList || [],
        filters: {
          courses: filters?.courses || {},
          weeks: filters?.weeks || {},
          statuses: filters?.assessmentStatuses || {},
        },
      };
    }

    console.warn("⚠️ No valid response data returned from API.");
    return emptyResponse();
  } catch (error) {
    console.error("❌ Failed to fetch structured timetable data:", error);
    return emptyResponse();
  }
};

/**
 * Returns a consistent empty response object
 */
function emptyResponse() {
  return {
    headers: [],
    data: [],
    filters: {
      courses: {},
      weeks: {},
      statuses: {},
    },
  };
}
