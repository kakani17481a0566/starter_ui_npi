import axios from "axios";
import{COURSE_OPTIONS} from "constants/apis";

export async function fetchCourseOptions() {
  const response = await axios.get(
    COURSE_OPTIONS
  );

  if (response.data?.statusCode === 200 && Array.isArray(response.data?.data)) {
    return response.data.data.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }

  return [];
}
