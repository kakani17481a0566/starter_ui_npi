import * as yup from "yup";

/** helpers **/
const emptyToUndefined = (v, original) => (original === "" ? undefined : v);

// Accepts either a number, a numeric string, or an object with { id } / { value }
const idField = (label) =>
  yup
    .mixed()
    .transform((v, o) => {
      if (o === "" || o == null) return undefined;
      if (typeof o === "object" && o !== null) {
        const id = o.id ?? o.value;
        return id == null || id === "" ? undefined : id;
      }
      return o;
    })
    .transform((v) => (typeof v === "string" ? Number(v) : v))
    .test("is-present", `${label} is required`, (v) => v != null && !Number.isNaN(v))
    .required(`${label} is required`);

// Accepts Date object, 4-digit string, or number; produces a number (YYYY)
const yearField = (label) =>
  yup
    .mixed()
    .transform((v, o) => {
      if (o === "" || o == null) return undefined;
      if (o instanceof Date) return o.getFullYear();
      if (v instanceof Date) return v.getFullYear();
      if (typeof o === "string" && /^\d{4}$/.test(o)) return Number(o);
      if (typeof v === "string" && /^\d{4}$/.test(v)) return Number(v);
      if (typeof o === "number") return o;
      if (typeof v === "number") return v;
      return undefined;
    })
    .typeError(`${label} is required`)
    .required(`${label} is required`);

// Country select may return an object (e.g., { id, code, dialCode, ... }) or a string code
const countryField = (label) =>
  yup
    .mixed()
    .test("country-required", `${label} is required`, (v) => !(v == null || v === "")) // allow object or string
    .required(`${label} is required`);

export const schema = yup.object().shape({
  // Student details
  student_first_name: yup.string().trim().required("Student First Name is required"),
  student_middle_name: yup.string().trim().transform(emptyToUndefined).optional(),
  student_last_name: yup.string().trim().required("Student Last Name is required"),
  dob: yup.date().typeError("Date of Birth is required").required("Date of Birth is required"),
  gender_id: idField("Gender"),
  admission_course_id: idField("Grade Applying For"),
  branch_id: idField("Branch Field is required"),

  // Joined School toggle
  joinedSchool: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select Yes or No"),

  // Previous School Info (conditionally required)
  prev_school_name: yup.string().trim().when("joinedSchool", {
    is: "yes",
    then: (s) => s.required("Previous School Name is required"),
    otherwise: (s) => s.nullable().optional(),
  }),

  from_course_id: yup.mixed().when("joinedSchool", {
    is: "yes",
    then: () => idField("From Grade"),
    otherwise: (s) => s.nullable().optional(),
  }),

  to_course_id: yup.mixed().when("joinedSchool", {
    is: "yes",
    then: () => idField("To Grade"),
    otherwise: (s) => s.nullable().optional(),
  }),

  from_year: yup.mixed().when("joinedSchool", {
    is: "yes",
    then: () => yearField("From Year"),
    otherwise: (s) => s.nullable().optional(),
  }),

  to_year: yup.mixed().when("joinedSchool", {
    is: "yes",
    then: () => yearField("To Year"),
    otherwise: (s) => s.nullable().optional(),
  }),

  // Address
  address_line1: yup.string().trim().required("Address Line 1 is required"),
  address_line2: yup.string().trim().transform(emptyToUndefined).optional(),
  city: yup.string().trim().required("City is required"),
  state: yup.string().trim().required("State is required"),
  postal_code: yup.string().trim().required("Postal Code is required"),
  country: countryField("Country"),

  // Correspondence Address
  correspondence_address_line1: yup.string().trim().required("Correspondence Address Line 1 is required"),
  correspondence_address_line2: yup.string().trim().transform(emptyToUndefined).optional(),
  correspondence_city: yup.string().trim().required("Correspondence City is required"),
  correspondence_state: yup.string().trim().required("Correspondence State is required"),
  correspondence_postal_code: yup.string().trim().required("Correspondence Postal Code is required"),
  correspondence_country: countryField("Correspondence Country"),

  // Parent details
  parent_first_name: yup.string().trim().required("Parent First Name is required"),
  parent_middle_name: yup.string().trim().transform(emptyToUndefined).optional(),
  parent_last_name: yup.string().trim().transform(emptyToUndefined).optional(),
  parent_phone: yup
    .string()
    .matches(/^\d{10}$/, "Parent Mobile Number must be 10 digits")
    .required("Parent Mobile Number is required"),
  parent_alternate_phone: yup.string().trim().transform(emptyToUndefined).optional(),
  parent_email: yup.string().trim().email("Invalid email").required("Parent Email is required"),
  parent_qualification: yup.string().trim().required("Parent Qualification is required"),
  parent_profession: yup.string().trim().required("Parent Profession is required"),

  // Mother details
  mother_first_name: yup.string().trim().required("Mother First Name is required"),
  mother_middle_name: yup.string().trim().transform(emptyToUndefined).optional(),
  mother_last_name: yup.string().trim().transform(emptyToUndefined).optional(),
  mother_phone: yup
    .string()
    .matches(/^\d{10}$/, "Mother Mobile Number must be 10 digits")
    .required("Mother Mobile Number is required"),
  mother_email: yup.string().trim().email("Invalid email").required("Mother Email is required"),
  mother_qualification: yup.string().trim().required("Mother Qualification is required"),
  mother_profession: yup.string().trim().required("Mother Profession is required"),

  // Dial codes
  student_dialCode: yup.string().transform(emptyToUndefined).optional(),
  parent_dialCode: yup.string().transform(emptyToUndefined).optional(),
  mother_dialCode: yup.string().transform(emptyToUndefined).optional(),

  // Flags
  is_guardian: yup.boolean().optional(),
  is_same_correspondence_address: yup.boolean().optional(),

  // Marketing & Consent
  hear_about_us_type_id: idField("This field"),

  signature: yup.mixed().required("Signature is required"),
});
