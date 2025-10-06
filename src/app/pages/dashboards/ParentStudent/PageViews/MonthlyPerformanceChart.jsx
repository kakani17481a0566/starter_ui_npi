import { useMemo } from "react";
import Chart from "react-apexcharts";

// ✅ Subject → consistent color mapping
const subjectColors = {
  CLL: "#93C5FD",  // Blue 300
  PSRN: "#FCA5A5", // Red 300
  KUW: "#FCD34D",  // Amber 300
  PD: "#6EE7B7",   // Emerald 300
  EAD: "#C4B5FD",  // Violet 300
  PSED: "#F9A8D4", // Pink 300
};

// 🔹 Extract data
function getWeeklySubjectPerformance(weeklyAnalysis) {
  if (!weeklyAnalysis) return { weeks: [], seriesMap: {} };

  const weeks = weeklyAnalysis.map((w) => w.weekName);
  const seriesMap = {};

  for (const week of weeklyAnalysis) {
    for (const subject of week.subjectWiseAssessments) {
      if (!seriesMap[subject.subjectCode]) {
        seriesMap[subject.subjectCode] = [];
      }
      seriesMap[subject.subjectCode].push(
        subject.averageScore != null ? Number(subject.averageScore.toFixed(2)) : null
      );
    }
  }

  return { weeks, seriesMap };
}

export function MonthlyPerformanceChart({ weeklyAnalysis }) {
  const { weeks, seriesMap } = useMemo(() => {
    if (!weeklyAnalysis) return { weeks: [], seriesMap: {} };
    return getWeeklySubjectPerformance(weeklyAnalysis);
  }, [weeklyAnalysis]);

  if (!weeks.length) {
    return (
      <div className="px-4 py-6">
        <p className="text-sm text-gray-500 dark:text-dark-300">
          No weekly performance data available.
        </p>
      </div>
    );
  }

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
    plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: weeks,
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      title: { text: "Average Score (%)" },
    },
    legend: { position: "top", horizontalAlign: "center", fontSize: "13px" },
    grid: { borderColor: "#E5E7EB" },
    tooltip: {
      y: {
        formatter: (val) => (val !== null ? `${val}%` : "No data"),
      },
    },
    responsive: [
      {
        breakpoint: 768, // tablets & below
        options: {
          plotOptions: { bar: { columnWidth: "60%" } },
          xaxis: { labels: { rotate: -30, style: { fontSize: "10px" } } },
          legend: { fontSize: "11px" },
        },
      },
      {
        breakpoint: 480, // mobiles
        options: {
          plotOptions: { bar: { columnWidth: "70%" } },
          chart: { height: 260 },
          xaxis: { labels: { rotate: -25, style: { fontSize: "9px" } } },
          legend: { position: "bottom", fontSize: "10px" },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-8 overflow-x-auto">
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
