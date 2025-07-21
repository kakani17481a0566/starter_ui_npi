import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .required("Topic name is required")
    .max(100, "Topic name must be under 100 characters"),

  code: yup
    .string()
    .nullable()
    .max(20, "Code must be under 20 characters"),

  description: yup
    .string()
    .nullable()
    .max(250, "Description must be under 250 characters"),

  courseId: yup
    .string()
    .required("Course is required"),

  subjectId: yup
    .string()
    .required("Subject is required"),

  topicTypeId: yup
    .number()
    .typeError("Topic Type ID must be a number")
    .required("Topic Type ID is required")
    .integer("Must be an integer")
    .positive("Must be a positive number"),

  tenantId: yup
    .number()
    .required("Tenant ID is required"),

  createdBy: yup
    .number()
    .required("Created By is required"),
});
