import * as Yup from "yup";

// --- Address Group Helper ---
const addressGroupSchema = (prefix = "", requireRole = false) => ({
  [prefix + "pg_names"]: Yup.string().required("Name is required"),
  [prefix + "home_street"]: Yup.string().required("Street is required"),
  [prefix + "mailing_city"]: Yup.string().required("Mailing city is required"),
  [prefix + "mailing_postal"]: Yup.string()
    .matches(/^[0-9A-Z]{4,10}$/, "Invalid postal")
    .required("Mailing postal is required"),
  [prefix + "civic_city"]: Yup.string().required("Civic city is required"),
  [prefix + "civic_postal"]: Yup.string()
    .matches(/^[0-9A-Z]{4,10}$/, "Invalid postal")
    .required("Civic postal is required"),
  [prefix + "civic_house"]: Yup.string().max(10).nullable(),
  [prefix + "civic_po_box"]: Yup.string().max(12).nullable(),
  ...(requireRole && {
    [prefix + "pg_role"]: Yup.string().required("Select Parent or Guardian"),
  }),
});

// --- Contact Group Helper ---
const contactGroupSchema = (prefix, required = false) => {
  const req = required ? (s) => s.required(`${prefix} first name is required`) : (s) => s.nullable();
  return {
    [prefix + "_first_name"]: req(Yup.string().trim()),
    [prefix + "_last_name"]: Yup.string().trim().nullable(),
    [prefix + "_phone"]: required
      ? Yup.string()
          .matches(/^[0-9]{7,15}$/, "Invalid phone")
          .required(`${prefix} phone is required`)
      : Yup.string().matches(/^[0-9]{7,15}$/, "Invalid phone").nullable(),
    [prefix + "_alt_phone"]: Yup.string().matches(/^[0-9]{7,15}$/, "Invalid phone").nullable(),
    [prefix + "_email"]: Yup.string().email("Invalid email").nullable(),
  };
};

export const personalInfoSchema = Yup.object().shape({
  fees: Yup.array().of(
    Yup.object().shape({
      monthly_fee: Yup.number().required("Monthly fee is required"),
      term_fee: Yup.number().required("Term fee is required"),
      annual_fee: Yup.number().required("Annual fee is required"),
      discount: Yup.number().required("Discount is required"),
    })
  ),
});


export const schema = Yup.object().shape({
  // --- Student Details ---
  student_first_name: Yup.string().trim().required("First name is required"),
  student_middle_name: Yup.string().trim().nullable(),
  student_last_name: Yup.string().trim().required("Last name is required"),
  dob: Yup.date().nullable().required("Date of birth is required"),
  gender_id: Yup.number().nullable().required("Gender is required"),

  registration_channel: Yup.string().required("Registration channel is required"),
  registration_date: Yup.date().nullable().required("Registration date is required"),
  extra_entry_yesno: Yup.string().oneOf(["yes", "no"]).required(),
  extra_entry_number: Yup.number().nullable().when("extra_entry_yesno", {
    is: "yes",
    then: (s) => s.required("Number is required"),
  }),

  // --- Address Groups ---
  ...addressGroupSchema("", true),   // Primary (with role)
  ...addressGroupSchema("alt_"),     // Alternate
  ...addressGroupSchema("ec_"),      // Early Closure

  // --- Transportation ---
  regular_transport_id: Yup.number().required("Select regular transport"),
  regular_transport_other: Yup.string().when("regular_transport", {
    is: "other",
    then: (s) => s.required("Please specify"),
  }),
  alternate_transport: Yup.string().required("Select alternate transport"),
  alternate_transport_other: Yup.string().when("alternate_transport", {
    is: "other",
    then: (s) => s.required("Please specify"),
  }),
  transport_other_info: Yup.string().nullable(),
  speech_therapy: Yup.string().oneOf(["yes", "no"]).required(),

  // --- Contacts (6 groups) ---
  ...contactGroupSchema("father", true),        // Father required
  ...contactGroupSchema("mother"),              // optional
  ...contactGroupSchema("guardian"),            // optional
  ...contactGroupSchema("after_school"),        // optional
  ...contactGroupSchema("ec"),                  // optional
  ...contactGroupSchema("emergency"),           // optional

  parent_comm_email: Yup.string().email("Invalid email").nullable(),
  other_contact_info: Yup.string().nullable(),

  // --- Medical ---
// --- Medical ---
life_threat_allergy: Yup.string()
  .oneOf(["yes", "no"])
  .required("Required"),

// ✅ Radio will send string, convert to number
WhatAllergyId: Yup.mixed()
  .transform((v, o) => {
    if (o === "" || o == null) return null;
    return Number(o);
  })
  .nullable()
  .when("life_threat_allergy", {
    is: "yes",
    then: (s) => s.required("Please select an allergy type"),
  }),

// ✅ Free text required only if OTHER allergy chosen
OtherAllergyText: Yup.string()
  .nullable()
  .when("WhatAllergyId", (val, schema, context) => {
    // 👇 dynamic otherAllergyId injection from context
    const otherAllergyId =
      context?.options?.context?.otherAllergyId ?? 230; // fallback
    if (val != null && Number(val) === Number(otherAllergyId)) {
      return schema.required("Please specify the allergy");
    }
    return schema;
  }),

emergency_kit_recommended: Yup.string()
  .oneOf(["yes", "no"])
  .required("Required"),

emergency_kit_details: Yup.string().when("emergency_kit_recommended", {
  is: "yes",
  then: (s) => s.required("Kit details are required"),
}),

serious_medical_conditions: Yup.string().nullable(),
serious_medical_info: Yup.string().nullable(),
other_medical_info: Yup.string().nullable(),


  // --- Other Info ---
  lang_adults_home: Yup.string().required("Required"),
  lang_with_child: Yup.string().required("Required"),
  lang_first_learned: Yup.string().required("Required"),
  home_lang_understand: Yup.string().oneOf(["yes", "no"]).required(),
  //  read_english: Yup.number()
  //   .typeError("Reading ability is required")
  //   .required("Reading ability is required"),
  // write_english: Yup.number()
  //   .typeError("Writing ability is required")
  //   .required("Writing ability is required"),


  // --- Signature ---
  signature_data: Yup.string().required("Signature is required"),
  signature_date: Yup.date().nullable().required("Signature date required"),

  // --- Documents ---
  student_photo: Yup.mixed().required("Student photo required"),
  student_birth_certificate: Yup.mixed().required("Birth certificate required"),
});


