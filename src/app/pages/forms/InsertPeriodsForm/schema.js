// src/app/pages/forms/InsertPeriodsForm/schema.js

import * as Yup from "yup";

/**
 * Returns a Yup validation schema for Period forms.
 * @param {'insert'|'update'} mode - Use "insert" for Insert form (requires createdBy), "update" for Update form (requires updatedBy)
 */
export const schema = (mode = "insert") => {
  const baseFields = {
    name: Yup.string()
      .trim()
      .min(2, "Period name is too short")
      .max(50, "Period name is too long")
      .required("Period name is required"),

    // Accept string or number for courseId (from Select), always convert to number for backend.
    courseId: Yup.number()
      .transform((value, originalValue) =>
        typeof originalValue === "string" ? Number(originalValue) : value
      )
      .typeError("Course is required")
      .required("Course is required"),

    startTime: Yup.string()
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Start Time must be in HH:mm format")
      .required("Start Time is required"),

    endTime: Yup.string()
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "End Time must be in HH:mm format")
      .required("End Time is required")
      .test("is-after", "End Time must be after Start Time", function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const start = new Date(0, 0, 0, startH, startM);
        const end = new Date(0, 0, 0, endH, endM);
        return end > start;
      }),

    tenantId: Yup.number()
      .typeError("Tenant ID must be a number")
      .required("Tenant ID is required"),
  };

  // Only require the correct field based on form mode
  if (mode === "insert") {
    baseFields.createdBy = Yup.number()
      .typeError("Created By must be a number")
      .required("Created By is required");
  }
  if (mode === "update") {
    baseFields.updatedBy = Yup.number()
      .typeError("Updated By must be a number")
      .required("Updated By is required");
  }

  return Yup.object().shape(baseFields);
};
