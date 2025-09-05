import axios from "axios";

export async function fetchHeardAboutUsOptions() {
  try {
    const response = await axios.get(
      "https://localhost:7202/getByMasterTypeId/51/1?isUtilites=false"
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
