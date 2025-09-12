// src/app/pages/dashboards/ParentStudent/satdata.js

export const students = [
  {
    studentId: 201,
    studentName: "Kid One",
    averageScore: 85,
    standardDeviation: 6.5,
  },
  {
    studentId: 202,
    studentName: "Kid Two",
    averageScore: 72,
    standardDeviation: 9.1,
  },
];

export const assessmentGrades = {
  mathTest1: {
    201: { grade: "A" },
    202: { grade: "B" },
  },
  scienceTest1: {
    201: { grade: "A" },
    202: { grade: "Not Graded" },
  },
  englishTest1: {
    201: { grade: "B" },
    202: { grade: "C" },
  },
  historyTest1: {
    201: { grade: "A" },
    202: { grade: "B" },
  },
  geographyTest1: {
    201: { grade: "C" },
    202: { grade: "B" },
  },
};
