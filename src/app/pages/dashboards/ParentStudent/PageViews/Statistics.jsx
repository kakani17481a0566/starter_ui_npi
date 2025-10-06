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

// 🎨 Grade → color map (used for pills + charts)
const gradeColorMap = {
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
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
          icon={<ChartBarIcon aria-hidden="true" className="h-4 w-4 text-blue-500" />}
          label="Average"
          value={
            selectedStudent.averageScore != null
              ? selectedStudent.averageScore.toFixed(1)
              : "N/A"
          }
        />
        <StatCard
          icon={<ChartPieIcon aria-hidden="true" className="h-4 w-4 text-purple-500" />}
          label="Std Dev"
          value={
            selectedStudent.standardDeviation != null
              ? selectedStudent.standardDeviation.toFixed(1)
              : "N/A"
          }
        />
      </Section>

      {/* 📝 Assessment Stats */}
      <Section title="Assessments">
        <StatCard
          icon={
            <ClipboardDocumentCheckIcon
              aria-hidden="true"
              className="h-4 w-4 text-emerald-500"
            />
          }
          label="Total"
          value={totalAssessments}
        />
        <StatCard
          icon={<CheckCircleIcon aria-hidden="true" className="h-4 w-4 text-cyan-500" />}
          label="Graded"
          value={totalGraded}
        />
        <StatCard
          icon={
            <PresentationChartBarIcon
              aria-hidden="true"
              className="h-4 w-4 text-pink-500"
            />
          }
          label="Graded %"
          value={`${gradedPercentage}%`}
          extra={
            <div className="w-full bg-gray-200 dark:bg-dark-600 h-1 rounded mt-1">
              <div
                className="h-1 rounded bg-pink-500"
                style={{ width: `${gradedPercentage}%` }}
              />
            </div>
          }
        />
      </Section>

      {/* 🏆 Grade Breakdown */}
      <div>
        <h3 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Grade Breakdown
        </h3>
        {Object.keys(gradeMap).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(gradeMap).map(([grade, count]) => (
              <div
                key={grade}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: gradeColorMap[grade] }}
              >
                <span>{grade}</span>
                <span className="opacity-90">({count})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
            No graded data
          </p>
        )}
      </div>
    </div>
  );
}

// ✅ Section Wrapper
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

// ✅ Small Stat Card
function StatCard({ icon, label, value, extra }) {
  return (
    <div className="flex flex-col items-center text-center rounded-md border border-gray-200 dark:border-dark-600 px-2.5 py-2 bg-white dark:bg-dark-700 shadow-sm">
      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      {extra}
    </div>
  );
}
