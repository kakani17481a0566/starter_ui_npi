//C:\Users\KAKANI\Documents\GitHub\starter_ui_npi\src\app\pages\forms\InsertTimeTableForm\data.js
import axios from "axios";

// ✅ Create a new timetable entry
export const createTimeTable = async (payload) => {
  try {
    const response = await axios.post("https://localhost:7202/api/TimeTable", payload, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create timetable", error);
    throw error;
  }
};

// ✅ Fetch insert options for the timetable form
export const fetchTimeTableInsertOptions = async (tenantId = 1) => {
  try {
    const response = await axios.get(
      `https://localhost:7202/api/TimeTable/insert-options-time-table/${tenantId}`,
      {
        headers: {
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch insert options", error);
    throw error;
  }
};
