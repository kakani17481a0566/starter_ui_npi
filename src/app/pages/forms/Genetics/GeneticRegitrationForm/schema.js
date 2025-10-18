// ----------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------
import * as yup from "yup";

// ----------------------------------------------------------------------
// Validation Schema
// ----------------------------------------------------------------------
export const schema = yup.object({
  // ✅ Personal Information
  studentName: yup.string().required("Student name is required"),
  studentId: yup.string().notRequired(),
  className: yup.string().required("Class / Grade is required"),
  branch: yup.string().required("Branch / Campus is required"),
  fatherName: yup.string().required("Father’s name is required"),
  fatherOccupation: yup.string().required("Father’s occupation is required"),
  motherName: yup.string().required("Mother’s name is required"),
  motherOccupation: yup.string().required("Mother’s occupation is required"),
  countryCode: yup.string().required("Country code is required"),
  contactNumber: yup
    .string()
    .required("Contact number is required")
    .matches(/^[0-9]{5,15}$/, "Invalid contact number"),

  // ✅ Basic Info
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive()
    .integer()
    .required("Age is required"),
  gender: yup.string().required("Gender is required"),
  height: yup
    .number()
    .typeError("Height must be a number")
    .positive()
    .min(50, "Minimum height is 50 cm")
    .max(250, "Maximum height is 250 cm")
    .required("Height is required"),
  weight: yup
    .number()
    .typeError("Weight must be a number")
    .positive()
    .min(10, "Minimum weight is 10 kg")
    .max(300, "Maximum weight is 300 kg")
    .required("Weight is required"),

  // ✅ Lifestyle & Dietary
  consanguinity: yup.string().required("Consanguinity is required"),
  dietType: yup.string().required("Diet type is required"),
  activity: yup.string().required("Activity is required"),
  sleepDuration: yup.string().required("Sleep duration is required"),
  sleepQuality: yup.string().required("Sleep quality is required"),
  screenTime: yup.string().required("Screen time is required"),
  country: yup.string().required("Country is required"),
state: yup.string().required("State is required"),
city: yup.string().required("District is required"),


  // ✅ Family & Health
  familyType: yup.string().required("Family type is required"),
  siblings: yup
    .number()
    .typeError("Siblings must be a number")
    .integer()
    .min(0, "Cannot be negative")
    .required("Siblings count required"),
  vaccination: yup.string().required("Vaccination info is required"),

  // ✅ Environment & Exposure
  travelTime: yup.string().required("Travel time is required"),
});
