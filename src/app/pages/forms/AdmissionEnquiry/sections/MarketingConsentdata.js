import axios from "axios";
import {HEARD_ABOUT_US} from 'constants/apis.js';

export async function fetchHeardAboutUsOptions() {
  try {
    const response = await axios.get(
      HEARD_ABOUT_US
    );

    if (response.data?.statusCode === 200 && Array.isArray(response.data.data)) {
      return response.data.data.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    }
  } catch (error) {
    console.error("Error fetching 'heard about us' options:", error);
  }

  return [];
}
