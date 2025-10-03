import { useMemo } from "react";
import Chart from "react-apexcharts";

// ✅ Subject color mapping
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
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
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
      <div className="px-2">
        <p className="text-sm text-gray-500 dark:text-dark-300">
          No score data available for the selected student.
        </p>
      </div>
    );
  }

  // 🎨 Map bar fills
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
      labels: {
        style: {
          fontSize: "13px",
          colors: subjects.map(() =>
            document.documentElement.classList.contains("dark")
              ? "#E5E7EB" // light gray for dark mode
              : "#374151" // dark gray for light mode
          ),
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        min: 0,
        max: 100, // ✅ keep scores between 0–100
        title: { text: "Average Marks (%)", style: { fontSize: "12px" } },
        labels: {
          style: {
            fontSize: "12px",
            colors: [document.documentElement.classList.contains("dark") ? "#9CA3AF" : "#6B7280"],
          },
        },
      },
      {
        opposite: true,
        title: { text: "Std Dev", style: { fontSize: "12px" } },
        labels: {
          style: {
            fontSize: "12px",
            colors: [document.documentElement.classList.contains("dark") ? "#E5E7EB" : "#374151"],
          },
        },
      },
    ],
    grid: { borderColor: "#F3F4F6", strokeDashArray: 4 },
    legend: { show: true, position: "bottom", horizontalAlign: "center" },
    states: {
      active: {
        filter: { type: "lighten", value: 0.85 }, // highlight clicked bar
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: { plotOptions: { bar: { columnWidth: "60%" } } },
      },
    ],
  };

  return (
    <div className="h-full w-full">
      <Chart options={chartOptions} series={series} height={300} />
    </div>
  );
}
