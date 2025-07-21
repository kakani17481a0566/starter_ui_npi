import { useMemo } from "react";
import Chart from "react-apexcharts";

// Helper to compute average score per subject for a student
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
          No score data available.
        </p>
      </div>
    );
  }

  const series = [
    {
      name: "Average Score",
      data: scores,
    },
  ];

  const chartConfig = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 400,
      },
      events: {
        // ✅ Handle bar click
        dataPointSelection: (event, chartContext, config) => {
          const subjectCode = subjects[config.dataPointIndex];
          if (onSubjectSelect) {
            onSubjectSelect(subjectCode);
          }
        },
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "35%",
        barHeight: "90%",
        distributed: false,
      },
    },

    fill: {
      colors: ["#E0E7FF"], // Light indigo
      opacity: 1,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ["#3730A3"], // Indigo-800
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: subjects,
      labels: { hideOverlappingLabels: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },

    yaxis: {
      show: true,
      title: {
        text: "Marks (%)",
        style: { fontSize: "12px" },
      },
    },

    legend: { show: false },

    grid: {
      padding: { left: 0, right: 0, top: 0, bottom: -10 },
    },

    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "55%",
            },
          },
        },
      },
    ],
  };

  return (
    <div className="ax-transparent-gridline col-span-12 px-2 sm:col-span-6 lg:col-span-8">
      <Chart options={chartConfig} series={series} type="bar" height={280} />
    </div>
  );
}
