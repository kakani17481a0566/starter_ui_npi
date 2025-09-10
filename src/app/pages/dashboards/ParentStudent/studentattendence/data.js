// import axios from "axios";

// export async function fetchAttendanceGraph({ studentId, tenantId, branchId, days = 7 }) {
//   try {
//     const res = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/graph", {
//       params: { studentId, tenantId, branchId, days }
//     });

//     const raw = res.data?.data || [];

//     return raw.map(row => ({
//       date: row.date,
//       inTime: timeToDecimal(row.inTime),
//       outTime: timeToDecimal(row.outTime)
//     }));
//   } catch (err) {
//     console.error("Failed to fetch attendance graph data", err);
//     return [];
//   }
// }

// function timeToDecimal(timeStr) {
//   const [hour, minute] = timeStr.split(":").map(Number);
//   return hour + minute / 60;
// }


// src/app/pages/dashboards/ParentStudent/studentattendence/data.js

export async function fetchAttendanceGraph({ studentId }) {
  // Simulated API delay
  await new Promise((res) => setTimeout(res, 500));

  const dummy = {
    201: [
      { date: "2025-09-02", inTime: 9.0, outTime: 15.0 },
      { date: "2025-09-03", inTime: 9.1, outTime: 15.1 },
      { date: "2025-09-04", inTime: 9.2, outTime: 15.2 },
      { date: "2025-09-05", inTime: 9.0, outTime: 14.9 },
      { date: "2025-09-06", inTime: 8.9, outTime: 15.0 },
    ],
    202: [
      { date: "2025-09-02", inTime: 8.5, outTime: 14.5 },
      { date: "2025-09-03", inTime: 8.7, outTime: 14.6 },
      { date: "2025-09-04", inTime: 8.8, outTime: 14.7 },
      { date: "2025-09-05", inTime: 8.6, outTime: 14.4 },
      { date: "2025-09-06", inTime: 8.9, outTime: 14.5 },
    ],
  };

  return dummy[studentId] ?? [];
}
