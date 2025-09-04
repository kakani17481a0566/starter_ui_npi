// src/app/pages/forms/AdmissionEnquiry/schema.js
import * as yup from "yup";
import { genders, grades } from "./data";

/**
 * Helpers
 */
const requiredStr = (msg) => yup.string().trim().required(msg);

const optionalStr = () => yup.string().trim().nullable();

const yearSchema = yup
  .mixed()
  .nullable()
  .test("year-shape", "Enter a valid year", (val) => {
    if (val == null || val === "") return true; // optional
    // Accept string "2024", number 2024, or Date (just in case)
    const y =
      typeof val === "string"
        ? parseInt(val, 10)
        : val instanceof Date
        ? val.getFullYear()
        : typeof val === "number"
        ? val
        : NaN;
    return Number.isInteger(y) && y >= 1900 && y <= 2100;
  });

const dateNotInFuture = yup
  .mixed()
  .nullable()
  .required("Date of birth is required")
  .test("not-in-future", "DOB cannot be in the future", (val) => {
    if (!val) return false;
    const d = val instanceof Date ? val : new Date(val);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d <= today;
  });

const countryObjectRequired = yup
  .mixed()
  .nullable()
  .required("Country is required")
  .test("has-shape", "Invalid country", (val) => {
    if (!val) return false;
    // Allow a few common shapes from CountrySelect
    return (
      typeof val === "string" ||
      typeof val?.value === "string" ||
      typeof val?.code === "string" ||
      typeof val?.iso2 === "string" ||
      typeof val?.label === "string"
    );
  });

const countryObjectOptional = yup
  .mixed()
  .nullable()
  .test("has-shape", "Invalid country", (val) => {
    if (!val) return true;
    return (
      typeof val === "string" ||
      typeof val?.value === "string" ||
      typeof val?.code === "string" ||
      typeof val?.iso2 === "string" ||
      typeof val?.label === "string"
    );
  });

const dialCode = yup
  .string()
  .trim()
  .required("Dial code is required")
  .matches(/^\+?\d{1,4}$/, "Enter a valid dial code");

const phoneNumber = yup
  .string()
  .trim()
  .required("Phone number is required")
  .matches(/^[0-9()\-\s]{5,20}$/, "Enter a valid phone number");

const emailOptional = yup
  .string()
  .trim()
  .email("Enter a valid email")
  .nullable()
  .transform((v, o) => (o === "" ? null : v));

/**
 * Enumerations from data lists
 */
const genderIds = genders.map((g) => g.id);
const gradeIds = grades.map((g) => g.id);

/**
 * Schema
 */
export const schema = yup.object({
  // STUDENT DETAILS
  student_first_name: requiredStr("First name is required"),
  student_middle_name: optionalStr(),
  student_last_name: requiredStr("Last name is required"),
  dob: dateNotInFuture,
  gender: yup
    .string()
    .nullable()
    .oneOf(genderIds.concat([null]), "Select a valid gender")
    .required("Gender is required"),
  grade_applying_for: yup
    .string()
    .nullable()
    .oneOf(gradeIds.concat([null]), "Select a valid grade")
    .required("Grade is required"),

  // STUDENT PHONE
  student_dialCode: dialCode,
  student_phone: phoneNumber,

  // PREVIOUS SCHOOL INFO (mostly optional, validate shape if provided)
  prev_school_name: optionalStr(),
  from_grade: yup
    .string()
    .nullable()
    .oneOf(gradeIds.concat([null]), "Select a valid grade")
    .nullable(),
  from_year: yearSchema,
  to_grade: yup
    .string()
    .nullable()
    .oneOf(gradeIds.concat([null]), "Select a valid grade")
    .nullable(),
  to_year: yearSchema,

  // PERMANENT ADDRESS
  address_line1: requiredStr("Address Line 1 is required"),
  address_line2: optionalStr(),
  city: requiredStr("City is required"),
  state: requiredStr("State/Province is required"),
  postal_code: requiredStr("Postal code is required"),
  country: countryObjectRequired,

  // CORRESPONDENCE TOGGLE
  isSameCorrespondenceAddress: yup.boolean().default(false),

  // CORRESPONDENCE ADDRESS (conditionally required)
  correspondence_address_line1: yup.string().when("isSameCorrespondenceAddress", {
    is: false,
    then: requiredStr("Address Line 1 is required"),
    otherwise: optionalStr(),
  }),
  correspondence_address_line2: optionalStr(),
  correspondence_city: yup.string().when("isSameCorrespondenceAddress", {
    is: false,
    then: requiredStr("City is required"),
    otherwise: optionalStr(),
  }),
  correspondence_state: yup.string().when("isSameCorrespondenceAddress", {
    is: false,
    then: requiredStr("State/Province is required"),
    otherwise: optionalStr(),
  }),
  correspondence_postal_code: yup.string().when("isSameCorrespondenceAddress", {
    is: false,
    then: requiredStr("Postal code is required"),
    otherwise: optionalStr(),
  }),
  correspondence_country: yup.mixed().when("isSameCorrespondenceAddress", {
    is: false,
    then: countryObjectRequired,
    otherwise: countryObjectOptional,
  }),

  // PARENT / GUARDIAN DETAILS
  relation_type: yup
    .string()
    .oneOf(["parent", "guardian"], "Select Parent or Guardian")
    .required("Relation type is required"),
  parent_first_name: requiredStr("First name is required"),
  parent_middle_name: optionalStr(),
  parent_last_name: requiredStr("Last name is required"),
  parent_qualification: optionalStr(),
  parent_profession: optionalStr(),
  parent_dialCode: dialCode,
  parent_phone: phoneNumber,
  parent_email: emailOptional,

  // MOTHER DETAILS (make non-strict; keep required only if your policy needs it)
  mother_first_name: optionalStr(),
  mother_middle_name: optionalStr(),
  mother_last_name: optionalStr(),
  mother_qualification: optionalStr(),
  mother_profession: optionalStr(),
  mother_dialCode: yup
    .string()
    .trim()
    .matches(/^\+?\d{1,4}$/, "Enter a valid dial code")
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
  mother_phone: yup
    .string()
    .trim()
    .matches(/^[0-9()\-\s]{5,20}$/, "Enter a valid phone number")
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
  mother_email: emailOptional,

  // MARKETING
  heard_about_us: yup.string().nullable().transform((v, o) => (o === "" ? null : v)),

  // CONSENT + E-SIGNATURE
  consent_agree: yup
    .boolean()
    .oneOf([true], "You must agree to continue")
    .required("Consent is required"),
  e_signature: requiredStr("E-signature is required"),
});
