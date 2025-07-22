import * as yup from "yup";

export const schema = yup.object().shape({
  courseId: yup
    .string()
    .required("Course is required"),
  subjectId: yup
    .string()
    .required("Subject is required"),
  topicId: yup
    .string()
    .required("Topic is required"),
  timeTableDetailId: yup
    .string()
    .required("Time Table Detail is required"),
  tenantId: yup
    .string()
    .required("Tenant ID is required"),
  createdBy: yup
    .string()
    .required("Created By is required"),
});
