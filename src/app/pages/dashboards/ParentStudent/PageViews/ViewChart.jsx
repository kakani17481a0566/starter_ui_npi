import { useMemo } from "react";
import Chart from "react-apexcharts";

// Domain color mapping
const domainColorMap = {
  CLL: "#465C8A",
  PSRN: "#D2486E",
  KUW: "#E27257",
  PD: "#713427",
  EAD: "#DA973A",
  PSED: "#475468",
};

// Helper: Calculate average scores for each subject
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

// Main component
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

  const barColors = subjects.map(
    (code) => domainColorMap[code] || "#A5B4FC" // fallback indigo-300
  );

  const series = [{ name: "Average Score", data: scores }];

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      parentHeightOffset: 0,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 400,
      },
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
        columnWidth: "30%",
        distributed: true,
      },
    },
    colors: barColors,
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["#111827"], // gray-900 for outline
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
        style: { fontSize: "12px", colors: "#6B7280" }, // gray-500
      },
    },
    legend: { show: false },
    grid: {
      padding: { top: 10, bottom: -10, left: 0, right: 0 },
      borderColor: "#E5E7EB",
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: { columnWidth: "60%" },
          },
        },
      },
    ],
  };

  return (
    <div className="ax-transparent-gridline col-span-12 px-2 sm:col-span-6 lg:col-span-8">
      <Chart options={chartOptions} series={series} type="bar" height={280} />
    </div>
  );
}
