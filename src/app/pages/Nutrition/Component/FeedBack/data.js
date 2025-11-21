
import axios from "axios";

const BASE_URL = "https://localhost:7098";

export async function fetchMealMonitoring(userId, tenantId) {
  const url = `${BASE_URL}/api/MealPlanMonitoring/monitor/user/${userId}/tenant/${tenantId}`;

  const res = await axios.get(url);
  return res.data?.data;
}


export const saveMood = async (text) => {
  return new Promise((resolve) => {
    console.log("Simulating API call with text:", text);
    setTimeout(() => {
      resolve({ success: true, message: "Mood saved successfully!" });
    }, 1000);
  });
};