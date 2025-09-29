import { useMemo } from "react";
import Chart from "react-apexcharts";

// ✅ Subject → consistent color mapping (colorblind-safe palette)
const subjectColors = {
  CLL: "#93C5FD",  // Blue 300
  PSRN: "#FCA5A5", // Red 300
  KUW: "#FCD34D",  // Amber 300
  PD: "#6EE7B7",   // Emerald 300
  EAD: "#C4B5FD",  // Violet 300
  PSED: "#F9A8D4", // Pink 300
};

// 🔹 Transform weeklyAnalysis → chart data
function getWeeklySubjectPerformance(weeklyAnalysis, studentId) {
  if (!weeklyAnalysis) return { weeks: [], seriesMap: {} };

  const weeks = weeklyAnalysis.map((w) => w.weekName); // e.g., "Week 12 (10 Sep - 16 Sep)"
  const seriesMap = {};

  for (const week of weeklyAnalysis) {
    for (const subject of week.subjectWiseAssessments) {
      if (!seriesMap[subject.subjectCode]) {
        seriesMap[subject.subjectCode] = [];
      }

      let sum = 0, count = 0;
      for (const skill of subject.skills) {
        for (const scoreEntry of skill.studentScores) {
          if (scoreEntry.studentId === studentId && scoreEntry.score != null) {
            sum += scoreEntry.score;
            count++;
          }
        }
      }

      seriesMap[subject.subjectCode].push(count > 0 ? Number((sum / count).toFixed(2)) : null);
    }
  }

  return { weeks, seriesMap };
}

export function MonthlyPerformanceChart({ weeklyAnalysis, selectedStudentId }) {
  const { weeks, seriesMap } = useMemo(() => {
    if (!weeklyAnalysis || !selectedStudentId) {
      return { weeks: [], seriesMap: {} };
    }
    return getWeeklySubjectPerformance(weeklyAnalysis, selectedStudentId);
  }, [weeklyAnalysis, selectedStudentId]);

  if (!weeks.length) {
    return (
      <div className="px-4 py-6">
        <p className="text-sm text-gray-500 dark:text-dark-300">
          No weekly performance data available.
        </p>
      </div>
    );
  }

  // ✅ Build Apex series (one per subject)
  const series = Object.entries(seriesMap).map(([subjectCode, scores]) => ({
    name: subjectCode,
    data: scores,
    color: subjectColors[subjectCode] || "#A5B4FC",
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
