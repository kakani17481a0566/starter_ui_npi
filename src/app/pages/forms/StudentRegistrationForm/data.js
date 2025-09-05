// src/app/pages/forms/StudentRegistrationForm/data.js

// Default form values used by StudentRegistrationFormItaly.tsx
// Tip: keep these in sync with your Yup schema fields.
export const initialState = {
  // --- Registration channel / Date ---
  registration_channel: "in_person", // "by_post" | "in_person"
  registration_date: null,           // Date | null

  // --- Pre-school / Kindergarten / Siblings ---
  attending_preschool: "no",         // "yes" | "no"
  preschool_name: "",
  previously_registered_kg: "no",    // "yes" | "no"
  previous_kg_school_name: "",
  siblings_in_this_school: "no",     // "yes" | "no"
  siblings_this_school_name: "",
  siblings_in_other_schools: "no",   // "yes" | "no"
  siblings_other_school_name: "",

  // --- Student Identification ---
  legal_last_name: "",
  legal_middle_name: "",
  birth_date: null,                  // Date | null
  gender: "",                        // "male" | "female" (or "")

  // --- Transportation ---
  regular_transport: "bus",          // "bus" | "walk" | "other"
  regular_transport_other: "",
  alternate_transport: "bus",        // "bus" | "walk" | "other"
  alternate_transport_other: "",
  transport_other_info: "",
  speech_therapy: "no",              // "yes" | "no"

  // --- Demographics — Home Address (Civic + Mailing) ---
  pg_names: "",
  home_apt: "",
  home_street: "",
  mailing_city: "",
  mailing_postal: "",
  civic_city: "",
  civic_postal: "",
  civic_house: "",
  civic_po_box: "",

  // --- Demographics — Alternate Home Address (Shared Custody) ---
  alt_pg_names: "",
  alt_home_apt: "",
  alt_home_street: "",
  alt_mailing_city: "",
  alt_mailing_postal: "",
  alt_civic_city: "",
  alt_civic_postal: "",
  alt_civic_house: "",
  alt_civic_po_box: "",

  // --- Early Closure Destination ---
  early_closure_name: "",
  early_closure_relationship: "",

  // --- Demographics — Contact Information (each: first/last/home/cell/business) ---
  father_first_name: "",
  father_last_name: "",
  father_home_phone: "",
  father_cell_phone: "",
  father_business_phone: "",

  mother_first_name: "",
  mother_last_name: "",
  mother_home_phone: "",
  mother_cell_phone: "",
  mother_business_phone: "",

  guardian_first_name: "",
  guardian_last_name: "",
  guardian_home_phone: "",
  guardian_cell_phone: "",
  guardian_business_phone: "",

  after_school_first_name: "",
  after_school_last_name: "",
  after_school_home_phone: "",
  after_school_cell_phone: "",
  after_school_business_phone: "",

  ec_first_name: "",
  ec_last_name: "",
  ec_home_phone: "",
  ec_cell_phone: "",
  ec_business_phone: "",

  emergency_first_name: "",
  emergency_last_name: "",
  emergency_home_phone: "",
  emergency_cell_phone: "",
  emergency_business_phone: "",

  other_contact_info: "",
  parent_comm_email: "",

  // --- Custody / Lives With ---
  custody: "",               // "father" | "mother" | "legal_guardian"
  lives_with: "",            // "parents_together" | "parents_separately" | "father" | "mother" | "legal_guardian"

  // --- Medical Information ---
  life_threat_allergy: "no",     // "yes" | "no"
  allergy_substances: "",
  emergency_kit_recommended: "no", // "yes" | "no"
  emergency_kit_details: "",
  serious_medical_conditions: "",
  serious_medical_info: "",
  other_medical_info: "",

  // --- Other Information (Languages) ---
  lang_adults_home: "",
  lang_with_child: "",
  lang_first_learned: "",
  home_lang_understand: "yes",   // "yes" | "no"
  read_english: "little",        // "none" | "little" | "well"
  write_english: "little",       // "none" | "little" | "well"

  // --- Signature ---
  custodial_parent_signature: "",
  signature_date: null,          // Date | null

  // --- (Kept for compatibility with your dial-code/country sync watchers) ---
  // These fields aren’t rendered in the Italy form UI but are watched in the component.
  country: null,
  correspondence_country: null,
  isSameCorrespondenceAddress: false,
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  correspondence_address_line1: "",
  correspondence_address_line2: "",
  correspondence_city: "",
  correspondence_state: "",
  correspondence_postal_code: "",
  student_dialCode: "",
  parent_dialCode: "",
  mother_dialCode: "",
};
