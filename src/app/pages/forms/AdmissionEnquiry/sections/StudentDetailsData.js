import axios from "axios";
import {GENDER_OPTIONS,BRANCH_OPTIONS,COURSE_OPTIONS} from "constants/apis";

// 🔹 Fetch GENDER options
export async function fetchGenderOptions() {
  const response = await axios.get(
    GENDER_OPTIONS
  );
  // console.log(response.data.data);

  if (response.data?.statusCode === 200 && Array.isArray(response.data?.data)) {
    return response.data.data.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }

  return [];
}

// 🔹 Fetch BRANCH options
export async function fetchBranchOptions() {
  const response = await axios.get(
   BRANCH_OPTIONS
  );

  if (response.data?.statusCode === 200 && Array.isArray(response.data?.data)) {
    return response.data.data.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }

  return [];
}

// 🔹 Fetch COURSE options
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
