import { useMemo } from "react";
import Chart from "react-apexcharts";

// Subject → consistent color mapping
// const subjectColors = {
//   CLL: "#465C8A",
//   PSRN: "#D2486E",
//   KUW: "#E27257",
//   PD: "#713427",
//   EAD: "#DA973A",
//   PSED: "#475468",
// };

// Subject → consistent color mapping (colorblind-safe palette)
const subjectColors = {
  CLL: "#93C5FD",  // Blue 300
  PSRN: "#FCA5A5", // Red 300
  KUW: "#FCD34D",  // Amber 300
  PD: "#6EE7B7",   // Emerald 300
  EAD: "#C4B5FD",  // Violet 300
  PSED: "#F9A8D4", // Pink 300
};


// Helper: Transform assessments → weekly scores
function getWeeklySubjectPerformance(subjectWiseAssessments, studentId) {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const seriesMap = {};

  for (const subject of subjectWiseAssessments) {
    const weeklyScores = [0, 0, 0, 0]; // 4 weeks
    const weeklyCounts = [0, 0, 0, 0];

    for (const skill of subject.skills) {
      for (const scoreEntry of skill.studentScores) {
        if (scoreEntry.studentId === studentId) {
          const weekIdx = (scoreEntry.week || 1) - 1;
          weeklyScores[weekIdx] += scoreEntry.score;
          weeklyCounts[weekIdx] += 1;
        }
      }
    }

    // average per week
    const avgScores = weeklyScores.map((sum, i) =>
      weeklyCounts[i] > 0 ? Number((sum / weeklyCounts[i]).toFixed(2)) : null
    );

    seriesMap[subject.subjectCode] = avgScores;
  }

  return { weeks, seriesMap };
}

export function MonthlyPerformanceChart({ subjectWiseAssessments, selectedStudentId }) {
  const { weeks, seriesMap } = useMemo(() => {
    if (!subjectWiseAssessments || !selectedStudentId) return { weeks: [], seriesMap: {} };
    return getWeeklySubjectPerformance(subjectWiseAssessments, selectedStudentId);
  }, [subjectWiseAssessments, selectedStudentId]);

  if (!weeks.length) {
    return (
      <div className="px-4 py-6">
        <p className="text-sm text-gray-500 dark:text-dark-300">
          No weekly performance data available.
        </p>
      </div>
    );
  }

  // Build Apex series (each subject is one colored series)
  const series = Object.entries(seriesMap).map(([subjectCode, scores]) => ({
    name: subjectCode,
    data: scores,
    color: subjectColors[subjectCode] || "#A5B4FC", // ✅ ensure same subject always same color
  }));

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 500 },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40%",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: weeks,
      labels: { style: { fontSize: "12px", colors: "#374151" } },
    },
    yaxis: {
      title: {
        text: "Average Score (%)",
        style: { fontSize: "12px" },
      },
      labels: { style: { fontSize: "12px", colors: "#6B7280" } },
      min: 0,
      max: 100,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: { colors: "#374151" },
    },
    grid: { borderColor: "#E5E7EB" },
  };

  return (
    <div className="ax-transparent-gridline col-span-12 px-2 sm:col-span-6 lg:col-span-8">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
