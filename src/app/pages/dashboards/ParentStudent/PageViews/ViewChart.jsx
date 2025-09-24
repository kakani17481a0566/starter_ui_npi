import { useMemo } from "react";
import Chart from "react-apexcharts";

// ✅ Subject color mapping (light fill, dark stroke)
const domainColorMap = {
  CLL: { fill: "#BFDBFE", stroke: "#3B82F6" },  // Blue
  PSRN: { fill: "#FECACA", stroke: "#EF4444" }, // Red
  KUW: { fill: "#FDE68A", stroke: "#F59E0B" },  // Amber
  PD: { fill: "#A7F3D0", stroke: "#10B981" },   // Emerald
  EAD: { fill: "#DDD6FE", stroke: "#8B5CF6" },  // Violet
  PSED: { fill: "#FBCFE8", stroke: "#EC4899" }, // Pink
};

// 🔹 Compute averages + SD per subject
function getSubjectVsScores(subjectWiseAssessments, studentId) {
  const subjects = [];
  const scores = [];
  const sds = [];

  for (const subject of subjectWiseAssessments) {
    const values = subject.skills
      .map((skill) =>
        skill.studentScores.find((s) => s.studentId === studentId)?.score ?? null
      )
      .filter((v) => v != null);

    if (values.length > 0) {
      const avg =
        values.reduce((sum, v) => sum + v, 0) / values.length;
      const variance =
        values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
      const sd = Math.sqrt(variance);

      subjects.push(subject.subjectCode);
      scores.push(Number(avg.toFixed(2)));
      sds.push(Number(sd.toFixed(2)));
    }
  }

  return { subjects, scores, sds };
}

// 🔹 Chart Component
export function ViewChart({ subjectWiseAssessments, selectedStudentId, onSubjectSelect }) {
  const { subjects, scores, sds } = useMemo(() => {
    if (!subjectWiseAssessments || !selectedStudentId)
      return { subjects: [], scores: [], sds: [] };
    return getSubjectVsScores(subjectWiseAssessments, selectedStudentId);
  }, [subjectWiseAssessments, selectedStudentId]);

  if (!subjects.length) {
    return (
      <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-8">
        <p className="text-sm text-gray-500 dark:text-dark-300">
          No score data available for the selected student.
        </p>
      </div>
    );
  }

  // 🎨 Map fills
  const fillColors = subjects.map((code) => domainColorMap[code]?.fill || "#E5E7EB");

  // 🔹 Two series: Bars (avg), Line (SD)
  const series = [
    { name: "Average Score", type: "bar", data: scores },
    { name: "Std Dev", type: "line", data: sds },
  ];

  const chartOptions = {
    chart: {
      type: "line",   // allows mixed bar + line
      stacked: false,
      toolbar: { show: false },
      parentHeightOffset: 0,
      animations: { enabled: true, easing: "easeinout", speed: 400 },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const subjectCode = subjects[config.dataPointIndex];
          if (onSubjectSelect) onSubjectSelect(subjectCode);
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "40%",
        distributed: true,
      },
    },
    colors: [
      ...fillColors, // bar colors
      "#111827",     // SD line (dark gray/black)
    ],
    stroke: {
      show: true,
      width: [2, 3], // bar border, line thickness
      curve: "smooth",
    },
    markers: {
      size: [0, 5],  // no markers for bars, dots for SD line
      colors: ["#fff"],
      strokeColors: ["#111827"],
      strokeWidth: 2,
    },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          return seriesIndex === 0
            ? `${subjects[dataPointIndex]} Avg: ${val}%`
            : `SD: ${val}`;
        },
      },
      style: { fontSize: "12px" },
    },
    xaxis: {
      categories: subjects,
      labels: { style: { fontSize: "13px", colors: "#374151" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: "Average Marks (%)", style: { fontSize: "12px" } },
        labels: { style: { fontSize: "12px", colors: "#6B7280" } },
      },
      {
        opposite: true,
        title: { text: "Std Dev", style: { fontSize: "12px" } },
        labels: { style: { fontSize: "12px", colors: "#374151" } },
      },
    ],
    grid: { borderColor: "#F3F4F6", strokeDashArray: 4 },
    legend: { show: true, position: "top" },
    responsive: [
      {
        breakpoint: 1024,
        options: { plotOptions: { bar: { columnWidth: "60%" } } },
      },
    ],
  };

  return (
    <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-8">
      <div className="rounded-xl bg-white shadow-sm dark:bg-dark-700 p-4">
        <Chart options={chartOptions} series={series} height={280} />
      </div>
    </div>
  );
}
