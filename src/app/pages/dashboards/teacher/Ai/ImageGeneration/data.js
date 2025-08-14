import axios from "axios";


export async function fetchImageGenerationText() {
  try {
    const url = `https://localhost:7202/images`;
    
    const response = await axios.get(url);

    const result = response?.data|| {};
    console.log(result);

    return result
  } catch (error) {
    console.error("❌ Error fetching attendance summary:", error?.response?.data || error.message);
    return {
      headers: [],
      data: [],
    };
  }
}