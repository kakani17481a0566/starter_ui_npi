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
import { ClockIcon, LogOutIcon, CalendarDaysIcon } from "lucide-react";
import { fetchAttendanceGraph } from "./data";
import { timeFormatter } from "./column";

// Series with icon-based legend names
const attendanceGraphLines = [
  {
    name: "In Time",
    icon: <ClockIcon className="inline w-4 h-4 text-emerald-500 mr-1" />,
    dataKey: "inTime",
    stroke: "#10B981",
  },
  {
    name: "Out Time",
    icon: <LogOutIcon className="inline w-4 h-4 text-red-400 mr-1" />,
    dataKey: "outTime",
    stroke: "#F87171",
  },
];

// Format x-axis label like "29 Jul"
const formatDayLabel = (dateStr) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateStr));

export default function StudentAttendanceGraph({
  studentId,
  tenantId = 1,
  branchId = 1,
}) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAttendanceGraph({ studentId, tenantId, branchId })
      .then((res) => setAttendanceData(res ?? []))
      .finally(() => setLoading(false));
  }, [studentId, tenantId, branchId]);

  const maxHour =
    Math.max(...attendanceData.flatMap((d) => [d.inTime, d.outTime]), 0) + 1;

  if (loading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 dark:border-dark-400 bg-white dark:bg-dark-700 p-5 text-center text-gray-500 dark:text-dark-200 shadow-sm">
        Loading attendance graph...
      </div>
    );
  }

  if (!attendanceData.length) {
    return (
      <div className="w-full rounded-lg border border-gray-200 dark:border-dark-400 bg-white dark:bg-dark-700 p-5 text-center text-gray-500 dark:text-dark-200 shadow-sm">
        No attendance data available.
      </div>
    );
  }

  return (
   <div className="w-full rounded-lg border border-gray-200 dark:border-dark-400 bg-white dark:bg-dark-700 p-5 shadow-sm">
  <div className="mb-4 text-center">
    <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
      <CalendarDaysIcon className="w-5 h-5 text-primary-500" />
      In & Out Time
    </h2>
    <p className="text-xs text-gray-500 dark:text-dark-300">Daily time overview</p>
  </div>

      {/* Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={attendanceData}
            margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDayLabel}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <YAxis
              domain={[0, maxHour]}
              tickFormatter={timeFormatter}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <Tooltip
              formatter={(val, name) => [timeFormatter(val), name]}
              contentStyle={{
                backgroundColor: "#1f2937", // gray-800
                borderColor: "#4B5563",
                color: "#F9FAFB",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#D1D5DB" }}
              itemStyle={{ color: "#F9FAFB" }}
            />
            <Legend
              formatter={(value) => {
                const item = attendanceGraphLines.find((l) => l.name === value);
                return (
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                    {item?.icon}
                    {value}
                  </span>
                );
              }}
              iconType="circle"
            />
            {attendanceGraphLines.map((line) => (
              <Line
                key={line.dataKey}
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
