import * as yup from "yup";

export const schema = yup.object().shape({
  // Student details
  student_first_name: yup.string().required("Student First Name is required"),
  student_middle_name: yup.string().nullable(),
  student_last_name: yup.string().required("Student Last Name is required"),
  dob: yup.date().required("Date of Birth is required"),
  gender_id: yup.number().required("Gender is required"),
  admission_course_id: yup.number().required("Grade Applying For is required"),

  // Previous School Info
  prev_school_name: yup.string().required("Previous School Name is required"),
  from_course_id: yup.number().required("From Grade is required"),
  from_year: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("From Year is required")
    .required("From Year is required"),
  to_course_id: yup.number().required("To Grade is required"),
  to_year: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("To Year is required")
    .required("To Year is required"),

  // Address
  address_line1: yup.string().required("Address Line 1 is required"),
  address_line2: yup.string().nullable(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postal_code: yup.string().required("Postal Code is required"),
  country: yup.string().required("Country is required"),

  // Correspondence Address
  correspondence_address_line1: yup.string().required("Correspondence Address Line 1 is required"),
  correspondence_address_line2: yup.string().nullable(),
  correspondence_city: yup.string().required("Correspondence City is required"),
  correspondence_state: yup.string().required("Correspondence State is required"),
  correspondence_postal_code: yup.string().required("Correspondence Postal Code is required"),
  correspondence_country: yup.string().required("Correspondence Country is required"),

  // Parent details
  parent_first_name: yup.string().required("Parent First Name is required"),
  parent_middle_name: yup.string().nullable(),
  parent_last_name: yup.string().nullable(),
  parent_phone: yup
    .string()
    .matches(/^\d{10}$/, "Parent Mobile Number must be 10 digits")
    .required("Parent Mobile Number is required"),
  parent_alternate_phone: yup.string().nullable(),
  parent_email: yup
    .string()
    .email("Invalid email")
    .required("Parent Email is required"),
  parent_qualification: yup.string().required("Parent Qualification is required"),
  parent_profession: yup.string().required("Parent Profession is required"),

  // Mother details
  mother_first_name: yup.string().required("Mother First Name is required"),
  mother_middle_name: yup.string().nullable(),
  mother_last_name: yup.string().nullable(),
  mother_phone: yup
    .string()
    .matches(/^\d{10}$/, "Mother Mobile Number must be 10 digits")
    .required("Mother Mobile Number is required"),
  mother_email: yup
    .string()
    .email("Invalid email")
    .required("Mother Email is required"),
  mother_qualification: yup.string().required("Mother Qualification is required"),
  mother_profession: yup.string().required("Mother Profession is required"),

  // Dial codes
  student_dialCode: yup.string().nullable(),
  parent_dialCode: yup.string().nullable(),
  mother_dialCode: yup.string().nullable(),

  // Flags
  is_guardian: yup.boolean().nullable(),
  is_same_correspondence_address: yup.boolean().nullable(),

  // Marketing & Consent
  hear_about_us_type_id: yup
    .number()
    .typeError("This field is required")
    .required("This field is required"),

  signature: yup.string().required("Signature is required"),
});
