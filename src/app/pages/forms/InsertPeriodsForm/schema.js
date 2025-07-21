import * as Yup from "yup";

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Period name is too short")
    .max(50, "Period name is too long")
    .required("Period name is required"),

  courseId: Yup.number()
    .typeError("Course ID must be a number")
    .required("Course ID is required"),

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

  createdBy: Yup.number()
    .typeError("Created By must be a number")
    .required("Created By is required"),
});
