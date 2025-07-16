//src\app\pages\dashboards\teacher\Students\studentdata.js
import axiosInstance from "utils/axios";
import{FETCH_STUDENTS} from 'constants/apis';

export async function fetchStudentsData() {

  try {
    const res = await axiosInstance.get(
      FETCH_STUDENTS
    );
    return res.data?.data ?? { students: [] };
  } catch (err) {
    console.error("Failed to fetch student data", err);
    return { students: [] };
  }
}
