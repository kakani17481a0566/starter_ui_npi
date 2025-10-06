// Import Dependencies
import * as Yup from "yup";

// ----------------------------------------------------------------------

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Branch Name too short!")
    .max(100, "Branch Name too long!")
    .required("Branch Name is required"),

  contact: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, "Contact must be digits only")
    .min(10, "Contact number too short")
    .max(15, "Contact number too long")
    .required("Contact number is required"),

  address: Yup.string()
    .trim()
    .min(5, "Address too short")
    .max(200, "Address too long")
    .required("Address is required"),

  pincode: Yup.string()
    .matches(/^[0-9]+$/, "Pincode must be digits only")
    .min(5, "Pincode must be at least 5 digits")
    .max(6, "Pincode must be max 6 digits")
    .required("Pincode is required"),

  district: Yup.string()
    .trim()
    .min(2, "District too short")
    .max(50, "District too long")
    .required("District is required"),

  state: Yup.string()
    .trim()
    .min(2, "State too short")
    .max(50, "State too long")
    .required("State is required"),

  tenant_id: Yup.string()
    .trim()
    .required("Tenant ID is required"),

  department_id: Yup.string()
    .required("Department is required"),
});
