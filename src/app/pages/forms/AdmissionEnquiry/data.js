// data.js — central place for static options + initial form state

export const genders = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

export const grades = [
  { id: "nursery", label: "Nursery" },
  { id: "kg1", label: "KG 1" },
  { id: "kg2", label: "KG 2" },
  { id: "grade1", label: "Grade 1" },
  { id: "grade2", label: "Grade 2" },
  { id: "grade3", label: "Grade 3" },
];

// Keep around if you decide to re-enable later
// export const parentTypes = [
//   { id: "parent", label: "Parent" },
//   { id: "guardian", label: "Guardian" },
// ];

export const heardAboutUs = [
  { id: "website", label: "Website" },
  { id: "word_of_mouth", label: "Word of mouth (e.g., YouTube)" },
];

export const initialState = {
  // STUDENT DETAILS
  student_first_name: "",
  student_middle_name: "",
  student_last_name: "",
  dob: "",
  gender: "",
  grade_applying_for: "",

  // PREVIOUS SCHOOL INFO
  prev_school_name: "",
  from_grade: "",
  from_year: "",
  to_grade: "",
  to_year: "",

  // ADDRESS
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",

  // PARENT/GUARDIAN DETAILS (left side)
  relation_type: "parent",
  parent_first_name: "",
  parent_middle_name: "",
  parent_last_name: "",
  parent_qualification: "",
  parent_profession: "",
  parent_mobile: "",
  parent_email: "",

  // MOTHER DETAILS (right side)
  mother_first_name: "",
  mother_middle_name: "",
  mother_last_name: "",
  mother_qualification: "",
  mother_profession: "",
  mother_mobile: "",
  mother_email: "",

  // MARKETING
  heard_about_us: "",

  // CONSENT + E-SIGNATURE
  consent_text:
    "I hereby acknowledge to receive promotion and transaction updates through Email/SMS from My School Italy.",
  e_signature: "",
};
