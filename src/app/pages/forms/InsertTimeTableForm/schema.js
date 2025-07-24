import * as Yup from "yup";

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name is too short")
    .max(100, "Name is too long")
    .required("Name is required"),

  date: Yup.date()
    .typeError("Invalid date")
    .required("Date is required"),

  weekId: Yup.number()
    .typeError("Week is required")
    .required("Week is required"),

  holidayId: Yup.mixed()
    .nullable()
    .transform((value) => (value === "" ? null : Number(value))),

  status: Yup.string()
    .oneOf(["working", "holiday"], "Invalid status")
    .required("Status is required"),

  courseId: Yup.number()
    .typeError("Course is required")
    .required("Course is required"),

  assessmentStatusCode: Yup.number()
    .typeError("Assessment status is required")
    .required("Assessment status is required"),

  tenantId: Yup.number()
    .typeError("Tenant ID must be a number")
    .required("Tenant ID is required"),

  updatedBy: Yup.number()
    .typeError("Updated By must be a number")
    .required("Updated By is required"),
});
