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

// 🔹 Compute averages
function getSubjectVsScores(subjectWiseAssessments, studentId) {
  const subjects = [];
  const scores = [];

  for (const subject of subjectWiseAssessments) {
    let total = 0;
    let count = 0;

    for (const skill of subject.skills) {
      const studentScore = skill.studentScores.find((s) => s.studentId === studentId);
      if (studentScore?.score != null) {
        total += studentScore.score;
        count++;
      }
    }

    if (count > 0) {
      subjects.push(subject.subjectCode);
      scores.push(Number((total / count).toFixed(2)));
    }
  }

  return { subjects, scores };
}

// 🔹 Chart Component
export function ViewChart({ subjectWiseAssessments, selectedStudentId, onSubjectSelect }) {
  const { subjects, scores } = useMemo(() => {
    if (!subjectWiseAssessments || !selectedStudentId)
      return { subjects: [], scores: [] };
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

  // 🎨 Map fills & strokes
  const fillColors = subjects.map((code) => domainColorMap[code]?.fill || "#E5E7EB");
  const strokeColors = subjects.map((code) => domainColorMap[code]?.stroke || "#374151");

  const series = [{ name: "Average Score", data: scores }];

  const chartOptions = {
    chart: {
      type: "bar",
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
    colors: fillColors,
    stroke: {
      show: true,
      width: 2,
      colors: strokeColors,
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex }) =>
          `${subjects[dataPointIndex]}: ${val}%`,
      },
      style: { fontSize: "12px" },
    },
    xaxis: {
      categories: subjects,
      labels: {
        style: { fontSize: "13px", colors: "#374151" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Average Marks (%)",
        style: { fontSize: "12px" },
      },
      labels: {
        style: { fontSize: "12px", colors: "#6B7280" },
      },
    },
    grid: {
      borderColor: "#F3F4F6", // lighter grid
      strokeDashArray: 4,
    },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: { bar: { columnWidth: "60%" } },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-8">
      <div className="rounded-xl bg-white shadow-sm dark:bg-dark-700 p-4">
        <Chart options={chartOptions} series={series} type="bar" height={280} />
      </div>
    </div>
  );
}
