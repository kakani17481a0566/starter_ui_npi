//src\app\pages\tables\InsertTimeTable\data.js
import axios from "axios";

// const API_BASE_URL = "https://localhost:7202/api";

const API_BASE_URL=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;


/**
 * Fetches structured TimeTable data by tenantId
 */
export const fetchTimeTableStructuredData = async (tenantId = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/TimeTable/structured/${tenantId}`, {
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status === 200 && response.data?.data) {
      const { headers, timeTableDataList, filters } = response.data.data;
      const courses = filters?.courses || {};
      const weeks = filters?.weeks || {};
      const statuses = filters?.assessmentStatuses || {};
      return { headers, data: timeTableDataList, filters: { courses, weeks, statuses } };
    }

    return { headers: {}, data: [], filters: { courses: {}, weeks: {}, statuses: {} } };
  } catch (error) {
    console.error(`❌ Failed to fetch structured timetable data:`, error);
    return { headers: {}, data: [], filters: { courses: {}, weeks: {}, statuses: {} } };
  }
};
