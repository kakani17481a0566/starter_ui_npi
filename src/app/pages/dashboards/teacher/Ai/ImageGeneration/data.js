import axios from "axios";


export async function fetchImageGenerationText({testId,relationId}) {
  try {
    const url = `https://localhost:7202/2?relationId=0`;
    // const url = `https://localhost:7202/getImages`;

    
    const response = await axios.get(url);

    const result = response?.data|| {};
    console.log(result);
    console.log(testId,relationId)

    return result
  } catch (error) {
    console.error("❌ Error fetching attendance summary:", error?.response?.data || error.message);
    return {
      headers: [],
      data: [],
    };
  }
}