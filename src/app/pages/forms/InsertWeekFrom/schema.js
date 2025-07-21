import * as Yup from "yup";

export const schema = Yup.object().shape({
  Name: Yup.string()
    .trim()
    .min(2, "Week name is too short")
    .max(50, "Week name is too long")
    .required("Week name is required"),

  TermId: Yup.number()
    .typeError("Term ID must be a number")
    .required("Term ID is required"),

  StartDate: Yup.date()
    .typeError("Start Date must be a valid date")
    .required("Start Date is required"),

  EndDate: Yup.date()
    .typeError("End Date must be a valid date")
    .required("End Date is required")
    .min(Yup.ref("StartDate"), "End Date cannot be before Start Date"),

  TenantId: Yup.number()
    .typeError("Tenant ID must be a number")
    .required("Tenant ID is required"),

  CreatedBy: Yup.number()
    .typeError("Created By must be a number")
    .required("Created By is required"),
});
