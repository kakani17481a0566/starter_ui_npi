import * as yup from "yup";

export const schema = yup.object({
  courseId: yup
    .string()
    .required("Course is required")
    .matches(/^\d+$/, "Invalid Course selection"),

  subjectId: yup
    .string()
    .required("Subject is required")
    .matches(/^\d+$/, "Invalid Subject selection"),

  weekId: yup
    .string()
    .required("Week is required")
    .matches(/^\d+$/, "Invalid Week selection"),

  periodId: yup
    .string()
    .required("Period is required")
    .matches(/^\d+$/, "Invalid Period selection"),

  timeTableId: yup
    .string()
    .required("Time Table is required")
    .matches(/^\d+$/, "Invalid Time Table selection"),

  teacherId: yup
    .string()
    .required("Teacher is required")
    .matches(/^\d+$/, "Invalid Teacher selection"),

  tenantId: yup
    .number()
    .required("Tenant ID is required")
    .typeError("Tenant ID must be a number"),

  createdBy: yup
    .number()
    .required("Created By is required")
    .typeError("Created By must be a number"),
});
