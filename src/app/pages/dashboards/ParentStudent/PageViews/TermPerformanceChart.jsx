import { useMemo } from "react";
import Chart from "react-apexcharts";

// ✅ Subject → consistent color mapping
const subjectColors = {
  CLL: "#93C5FD",  // Blue
  PSRN: "#FCA5A5", // Red
  KUW: "#FCD34D",  // Amber
  PD: "#6EE7B7",   // Emerald
  EAD: "#C4B5FD",  // Violet
  PSED: "#F9A8D4", // Pink
};

// 🔹 Transform termAnalysis → chart series
function getTermSubjectPerformance(termAnalysis) {
  if (!termAnalysis) return { terms: [], seriesMap: {} };

  const terms = termAnalysis.map((t) => t.termName);
  const seriesMap = {};

  for (const term of termAnalysis) {
    for (const subject of term.subjectWiseAssessments) {
      if (!seriesMap[subject.subjectCode]) {
        seriesMap[subject.subjectCode] = [];
      }

      seriesMap[subject.subjectCode].push(
        subject.averageScore != null ? Number(subject.averageScore.toFixed(2)) : null
      );
    }
  }

  return { terms, seriesMap };
}

export function TermPerformanceChart({ termAnalysis }) {
  const { terms, seriesMap } = useMemo(() => {
    if (!termAnalysis) return { terms: [], seriesMap: {} };
    return getTermSubjectPerformance(termAnalysis);
  }, [termAnalysis]);

  if (!terms.length) {
    return (
      <div className="px-4 py-6">
        <p className="text-sm text-gray-500 dark:text-dark-300">
          No term performance data available.
        </p>
      </div>
    );
  }

  const series = Object.entries(seriesMap).map(([subjectCode, scores]) => ({
    name: subjectCode,
    data: scores,
    color: subjectColors[subjectCode] || "#A5B4FC", // fallback violet
  }));

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 500 },
    },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "40%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: terms },
    yaxis: {
      min: 0,
      max: 100,
      title: { text: "Average Score (%)" },
    },
    legend: { position: "top", horizontalAlign: "center" },
    grid: { borderColor: "#E5E7EB" },
  };

  return (
    <div className="ax-transparent-gridline col-span-12 px-2 sm:col-span-6 lg:col-span-8">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
