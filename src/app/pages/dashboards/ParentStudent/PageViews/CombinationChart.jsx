import Chart from "react-apexcharts";

// ✅ Domain color mappings
const domainColorMap = {
  CLL: "#465C8A",
  PSRN: "#D2486E",
  KUW: "#E27257",
  PD: "#713427",
  EAD: "#DA973A",
  PSED: "#475468",
};

const domainFillMap = {
  CLL: "#CBD5E1",
  PSRN: "#FBCFE8",
  KUW: "#FFEEDD",
  PD: "#EAD4C2",
  EAD: "#FFF3C2",
  PSED: "#E2E8F0",
};

// ✅ Extract subject-wise scores and visual styles
function getSubjectVsMarks(subjectWiseAssessments, studentId) {
  const subjects = [];
  const scores = [];
  const fillColors = [];
  const strokeColors = [];

  for (const subject of subjectWiseAssessments) {
    let total = 0;
    let count = 0;

    for (const skill of subject.skills) {
      const score = skill.studentScores.find((s) => s.studentId === studentId);
      if (score?.score != null) {
        total += score.score;
        count++;
      }
    }

    if (count > 0) {
      const code = subject.subjectCode;
      subjects.push(code);
      scores.push(Number((total / count).toFixed(2)));
      fillColors.push(domainFillMap[code] || "#E0E7FF");
      strokeColors.push(domainColorMap[code] || "#4C4EE7");
    }
  }

  return { subjects, scores, fillColors, strokeColors };
}

// ✅ Chart Component
export function CombinationChart({ subjectWiseAssessments, selectedStudentId }) {
  if (!subjectWiseAssessments || !selectedStudentId) {
    return <div className="text-gray-500 p-4">No chart data</div>;
  }

  const { subjects, scores, fillColors, strokeColors } = getSubjectVsMarks(
    subjectWiseAssessments,
    selectedStudentId
  );

  const series = [
    {
      name: "Average Score",
      data: scores,
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: fillColors, // ✅ Per-bar fill colors
    stroke: {
      show: true,
      width: 2,
      colors: strokeColors, // ✅ Per-bar border colors
    },
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: "40%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: subjects,
      labels: {
        style: { fontSize: "12px", colors: "#374151" },
      },
    },
    yaxis: {
      title: {
        text: "Marks (%)",
        style: { fontSize: "12px" },
      },
      labels: {
        style: { fontSize: "12px", colors: "#6B7280" },
      },
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
    legend: { show: false },
    grid: {
      padding: { top: 10, bottom: 0, left: 0, right: 0 },
      borderColor: "#E5E7EB",
    },
   responsive: [
  {
    breakpoint: 768,
    options: {
      plotOptions: {
        bar: {
          columnWidth: "35%", // tighter bars
        },
      },
      xaxis: {
        labels: {
          rotate: -45, // rotate labels to avoid overlap
          style: { fontSize: "10px", colors: "#374151" },
        },
      },
      dataLabels: {
        style: {
          fontSize: "10px", // smaller font for data labels
        },
      },
    },
  },
],

  };

  return (
    <div className="col-span-12 px-4 mt-6">
      <div className="rounded-2xl bg-white shadow-sm dark:bg-dark-700 p-4">
        <Chart options={chartOptions} series={series} type="bar" height={280} />
      </div>
    </div>
  );
}
