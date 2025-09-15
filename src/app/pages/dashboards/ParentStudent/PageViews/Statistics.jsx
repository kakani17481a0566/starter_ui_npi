import {
  ChartBarIcon,
  ChartPieIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

// ✅ Helper: Compute grade breakdown
function computeGradeStats(assessmentGrades, studentId) {
  const gradeMap = {};
  let totalGraded = 0;

  for (const key in assessmentGrades) {
    const entry = assessmentGrades[key][studentId];
    if (!entry?.grade || entry.grade === "Not Graded") continue;
    gradeMap[entry.grade] = (gradeMap[entry.grade] || 0) + 1;
    totalGraded++;
  }

  return { gradeMap, totalGraded };
}

// 🎨 Grade → Row color map
const gradeColorMap = {
  A: "bg-green-100 text-green-800 dark:bg-green-600/30 dark:text-green-300",
  B: "bg-blue-100 text-blue-800 dark:bg-blue-600/30 dark:text-blue-300",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-600/30 dark:text-yellow-300",
  D: "bg-orange-100 text-orange-800 dark:bg-orange-600/30 dark:text-orange-300",
  F: "bg-red-100 text-red-800 dark:bg-red-600/30 dark:text-red-300",
};

// ✅ Main Component
export function Statistics({ assessmentGrades, selectedStudent }) {
  if (!selectedStudent) return null;

  const { gradeMap, totalGraded } = computeGradeStats(
    assessmentGrades,
    selectedStudent.studentId
  );

  const totalAssessments = Object.keys(assessmentGrades).length;
  const gradedPercentage = totalAssessments
    ? ((totalGraded / totalAssessments) * 100).toFixed(1)
    : 0;

  return (
    <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-4 space-y-6">
      {/* 📊 Performance Metrics */}
      <Section title="Performance">
        <StatCard
          icon={<ChartBarIcon className="h-4 w-4 text-blue-500" />}
          label="Average"
          value={selectedStudent.averageScore ?? "N/A"}
          color="border-blue-300"
        />
        <StatCard
          icon={<ChartPieIcon className="h-4 w-4 text-purple-500" />}
          label="Std Dev"
          value={selectedStudent.standardDeviation ?? "N/A"}
          color="border-purple-300"
        />
      </Section>

      {/* 📝 Assessment Stats */}
      <Section title="Assessments">
        <StatCard
          icon={<ClipboardDocumentCheckIcon className="h-4 w-4 text-emerald-500" />}
          label="Total"
          value={totalAssessments}
          color="border-emerald-300"
        />
        <StatCard
          icon={<CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
          label="Graded"
          value={totalGraded}
          color="border-cyan-300"
        />
        <StatCard
          icon={<PresentationChartBarIcon className="h-4 w-4 text-pink-500" />}
          label="Graded %"
          value={`${gradedPercentage}%`}
          color="border-pink-300"
        />
      </Section>

      {/* 🏆 Grade Breakdown (Colored Table) */}
      <div>
        <h3 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Grade Breakdown
        </h3>
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-dark-600">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-3 py-1.5 font-medium">Grade</th>
                <th className="px-3 py-1.5 font-medium text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gradeMap).map(([grade, count]) => (
                <tr
                  key={grade}
                  className={`${gradeColorMap[grade] || "bg-gray-100 dark:bg-dark-600"}`}
                >
                  <td className="px-3 py-1.5 font-medium">{grade}</td>
                  <td className="px-3 py-1.5 text-right font-semibold">{count}</td>
                </tr>
              ))}
              {Object.keys(gradeMap).length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-2 text-center text-gray-500 dark:text-gray-400"
                  >
                    No graded data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Section Wrapper
function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

// ✅ Small Stat Card (kept clean white)
function StatCard({ icon, label, value, color }) {
  return (
    <div
      className={`flex flex-col items-center text-center rounded-md border ${color} px-2 py-2 bg-white dark:bg-dark-700 shadow-sm`}
    >
      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
