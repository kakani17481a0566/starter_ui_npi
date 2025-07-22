import axios from "axios";

// Use your deployed API endpoint
const API_BASE_URL = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

/**
 * Fetches all topic table data by tenantId.
 * Returns: { headers, data, filters: { courses, subjects, subjectCourseMap } }
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

/**
 * Fetches timetable dropdowns (courses, nested subjects, topicTypes)
 * Returns: { statusCode, message, data: { courses, topicTypes } }
 */
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

/**
 * Fetches a single topic by ID (for edit mode)
 * Returns: { ...topicFields }
 */
export const fetchTopicById = async (id, tenantId = 1) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Topic/${id}/tenant/${tenantId}`,
      {
        headers: { Accept: "*/*" },
      }
    );
    if (response.status === 200 && response.data?.data) {
      return response.data.data;
    }
    throw new Error("Topic not found");
  } catch (error) {
    console.error("❌ Failed to fetch topic by id", error);
    throw error;
  }
};

/**
 * Update an existing topic
 * @param {number} id - Topic ID
 * @param {number} tenantId - Tenant ID
 * @param {object} payload - { name, code, description, subjectId, topicTypeId, updatedBy }
 */
export const updateTopic = async (id, tenantId, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Topic/${id}/tenant/${tenantId}`,
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
    console.error("❌ Failed to update topic", error);
    throw error;
  }
};
