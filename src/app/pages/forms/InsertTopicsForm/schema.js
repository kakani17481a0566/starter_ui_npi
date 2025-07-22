import * as yup from "yup";

const numberSelect = (msg) =>
  yup
    .number()
    .transform((value, originalValue) => {
      // If the field is empty string, return undefined to trigger required
      if (originalValue === "" || originalValue === undefined || originalValue === null) return undefined;
      // If originalValue is a string that looks like a number, parse it
      if (typeof originalValue === "string" && !isNaN(originalValue)) return Number(originalValue);
      return value;
    })
    .typeError(msg)
    .required(msg);

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

  courseId: numberSelect("Course is required"),
  subjectId: numberSelect("Subject is required"),
  topicTypeId: numberSelect("Topic Type is required")
    .integer("Must be an integer")
    .positive("Must be a positive number"),

  tenantId: numberSelect("Tenant ID is required"),
  // Use createdBy or updatedBy as needed in your form. For Update, use updatedBy.
  createdBy: yup.number().notRequired(),
  updatedBy: yup.number().notRequired(),
});
