// src/app/pages/forms/StudentRegistrationForm/PostData.js
import axios from "axios";
// import { initialState } from "./data"; // if you need reset reference

export async function submitStudentRegistrationForm(formData) {
  // 🔹 Map formData into backend payload shape
  // console.log("this is from submission",formData);
  
  const response = await axios.post(
    "https://localhost:7202/api/Student/register",
    formData,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}
