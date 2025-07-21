import Chart from "react-apexcharts";

// Dark border color for each subject domain
const domainColorMap = {
  CLL: "#465C8A",
  PSRN: "#D2486E",
  KUW: "#E27257",
  PD: "#713427",
  EAD: "#DA973A",
  PSED: "#475468",
};

// Light inner fill color for each domain (pastel versions)
const domainFillMap = {
  CLL: "#CBD5E1",   // light slate
  PSRN: "#FBCFE8",  // light pink
  KUW: "#FFEEDD",   // light orange
  PD: "#EAD4C2",    // soft brown
  EAD: "#FFF3C2",   // light yellow
  PSED: "#E2E8F0",  // light grey-blue
};

// Extract subject-wise scores and color maps
function getSubjectVsMarks(subjectWiseAssessments, studentId) {
  const subjects = [];
  const scores = [];
  const fillColors = [];
  const strokeColors = [];

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
      const code = subject.subjectCode;
      subjects.push(code);
      scores.push(Number((total / count).toFixed(2)));
      fillColors.push(domainFillMap[code] || "#E0E7FF"); // fallback light
      strokeColors.push(domainColorMap[code] || "#4C4EE7"); // fallback dark
    }
  }

  return { subjects, scores, fillColors, strokeColors };
}

export function CombinationChart({ subjectWiseAssessments, selectedStudentId }) {
  if (!subjectWiseAssessments || !selectedStudentId) {
    return <div className="text-gray-500 p-4">No chart data</div>;
  }

  const { subjects, scores, fillColors, strokeColors } = getSubjectVsMarks(
    subjectWiseAssessments,
    selectedStudentId
  );

  const chartOptions = {
    chart: {
      height: 280,
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      width: [1, 3], // bar border, line
      colors: strokeColors.concat("#FF9800"),
    },
    fill: {
      opacity: 1,
      colors: fillColors.concat("#FF9800"), // Light bar fill + orange line
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 6,
        distributed: true, // for multi-colored bars
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: subjects,
    xaxis: {
      type: "category",
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      title: {
        text: "Marks (%)",
        style: { fontSize: "12px" },
      },
    },
    colors: fillColors.concat("#FF9800"),
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      fontSize: "12px",
    },
    grid: {
      padding: { top: 10, bottom: 0, left: 0, right: 0 },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: { columnWidth: "55%" },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Score (Bar)",
      type: "column",
      data: scores,
    },
    {
      name: "Score Trend (Line)",
      type: "line",
      data: scores,
    },
  ];

  return (
    <div className="col-span-12 px-4 mt-6">
      <div className="rounded-2xl bg-white shadow-sm dark:bg-dark-700 p-4">
        <Chart options={chartOptions} series={series} type="line" height={280} />
      </div>
    </div>
  );
}
