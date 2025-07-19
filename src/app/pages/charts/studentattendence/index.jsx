import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { fetchAttendanceGraph } from "./data";
import { timeFormatter } from "./column";

// Updated stroke colors here
const attendanceGraphLines = [
  {
    name: "In Time",
    dataKey: "inTime",
    stroke: "#10B981", // emerald-500
  },
  {
    name: "Out Time",
    dataKey: "outTime",
    stroke: "#F87171", // red-400
  },
];

export default function StudentAttendanceGraph({ studentId }) {
  const [data, setData] = useState([]);

  const tenantId = 1;
  const branchId = 1;
  const getDayOnly = (dateStr) => new Date(dateStr).getDate();


  useEffect(() => {
    fetchAttendanceGraph({ studentId, tenantId, branchId }).then(setData);
  }, [studentId]);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-primary-950 dark:text-dark-100 ">
          Student Attendance (In &amp; Out Time)
        </h2>
        <p className="text-sm text-gray-500">
          Line chart showing check-in/out times
        </p>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
  dataKey="date"
  stroke="#374151"
  tickFormatter={getDayOnly}
  tick={{ fontSize: 12, fill: "#374151" }}
/>

            <YAxis
              domain={[0, 24]}
              tickFormatter={timeFormatter}
              stroke="#374151"
              tick={{ fontSize: 12, fill: "#374151" }}
            />
            <Tooltip
              formatter={(val, name) => [timeFormatter(val), name]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#d1d5db",
                color: "#111827",
                fontSize: "13px",
              }}
            />
            <Legend wrapperStyle={{ color: "#374151", fontWeight: "500" }} />

            {attendanceGraphLines.map((line, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={3}
                name={line.name}
                dot={{
                  r: 4,
                  stroke: line.stroke,
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
