// src/app/pages/FrontDesk/data.js

// ---------------- VISITORS ----------------
export const visitors = [
  {
    visitor: "Sarah Lee",
    person: "Mr. Davis",
    time: "10:00 AM",
    status: "Waiting",
    date: "2025-09-16",
  },
  {
    visitor: "Robert Kim",
    person: "Ms. Chen",
    time: "10:30 AM",
    status: "Checked In",
    date: "2025-09-16",
  },
  {
    visitor: "Alicia Gomez",
    person: "Principal",
    time: "11:15 AM",
    status: "Waiting",
    date: "2025-09-17",
  },
];

// ---------------- PAYMENTS ----------------
export const payments = [
  {
    payer: "Lisa Doe",
    studentId: "12345",
    type: "Tuition",
    amount: 500,
    method: "Card",
    date: "2025-09-16",
  },
  {
    payer: "Mark Smith",
    studentId: "12346",
    type: "Activity",
    amount: 50,
    method: "Cash",
    date: "2025-09-16",
  },
  {
    payer: "Sophia Johnson",
    studentId: "12347",
    type: "Library Fee",
    amount: 25,
    method: "Cash",
    date: "2025-09-17",
  },
];

// ---------------- TRANSACTIONS ----------------
export const transactions = [
  {
    uid: "1",
    name: "Konnor Guzman",
    avatar: "https://tailux.piniastudio.com/images/avatar/avatar-20.jpg",
    time: "2025-09-16T08:05:00",
    amount: 660.22,
    date: "2025-09-16",
  },
  {
    uid: "2",
    name: "Henry Curtis",
    avatar: "https://tailux.piniastudio.com/images/avatar/avatar-20.jpg",
    time: "2025-09-16T11:55:00",
    amount: -33.63,
    date: "2025-09-16",
  },
  {
    uid: "3",
    name: "Derrick Simmons",
    avatar: "https://tailux.piniastudio.com/images/avatar/avatar-5.jpg",
    time: "2025-09-17T14:45:00",
    amount: 674.63,
    date: "2025-09-17",
  },
];

// ---------------- STUDENT ATTENDANCE ----------------
export const StudentAttedenceList = [
  {
    id: "S-001",
    name: "Alice Brown",
    status: "Present",
    date: "2025-09-16",
  },
  {
    id: "S-002",
    name: "David White",
    status: "Absent",
    date: "2025-09-16",
  },
  {
    id: "S-003",
    name: "Emma Wilson",
    status: "Present",
    date: "2025-09-17",
  },
];

// ---------------- TEACHER ATTENDANCE ----------------
export const teachersList = [
  {
    id: "T-001",
    name: "Mr. Davis",
    subject: "Mathematics",
    status: "Present",
    date: "2025-09-16",
  },
  {
    id: "T-002",
    name: "Ms. Chen",
    subject: "English",
    status: "Absent",
    date: "2025-09-16",
  },
  {
    id: "T-003",
    name: "Mrs. Lee",
    subject: "Science",
    status: "Present",
    date: "2025-09-17",
  },
];
