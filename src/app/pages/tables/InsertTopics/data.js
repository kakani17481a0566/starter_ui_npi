import axios from "axios";

// const API_BASE_URL = "https://localhost:7202/api";
const API_BASE_URL = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

/**
 * Fetches structured Topic data by tenantId
 */
export const fetchTopicStructuredData = async (tenantId = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Topic/Topic-full-data/${tenantId}`, {
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status === 200 && response.data?.data) {
      const { headers, tDataTopic, courses, subjects, subjectCourseMap } = response.data.data;
      return {
        headers,
        data: tDataTopic,
        filters: {
          courses,
          subjects,
          subjectCourseMap,
        },
      };
    }

    return {
      headers: [],
      data: [],
      filters: {
        courses: {},
        subjects: {},
        subjectCourseMap: {},
      },
    };
  } catch (error) {
    console.error(`❌ Failed to fetch structured topic data:`, error);
    return {
      headers: [],
      data: [],
      filters: {
        courses: {},
        subjects: {},
        subjectCourseMap: {},
      },
    };
  }
};
