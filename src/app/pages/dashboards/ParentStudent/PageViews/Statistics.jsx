import {
  ChartBarIcon,      // average score
  ChartPieIcon,      // std deviation
  ClipboardDocumentCheckIcon, // total assessments
  CheckCircleIcon,   // graded count
  TrophyIcon,        // grade count
  PresentationChartBarIcon, // graded %
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
    <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-4 space-y-4">
      {/* 📊 Performance */}
      <Section title="Performance">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCard
            icon={<ChartBarIcon className="h-4 w-4 text-blue-500" />}
            label="Average"
            value={
              selectedStudent.averageScore != null
                ? selectedStudent.averageScore.toFixed(1)
                : "N/A"
            }
            colorCode={true}
          />
          <StatCard
            icon={<ChartPieIcon className="h-4 w-4 text-purple-500" />}
            label="Std Dev"
            value={
              selectedStudent.standardDeviation != null
                ? selectedStudent.standardDeviation.toFixed(1)
                : "N/A"
            }
            colorCode={true}
          />
        </div>
      </Section>

      {/* 📝 Assessments */}
      <Section title="Assessments">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCard
            icon={<ClipboardDocumentCheckIcon className="h-4 w-4 text-emerald-500" />}
            label="Total"
            value={totalAssessments}
          />
          <StatCard
            icon={<CheckCircleIcon className="h-4 w-4 text-teal-500" />}
            label="Graded"
            value={totalGraded}
          />
          <StatCard
            icon={<PresentationChartBarIcon className="h-4 w-4 text-pink-500" />}
            label="Graded %"
            value={`${gradedPercentage}%`}
          />
        </div>
      </Section>

      {/* 🏆 Grades */}
      <Section title="Grade Breakdown">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(gradeMap).map(([grade, count]) => (
            <StatCard
              key={grade}
              icon={<TrophyIcon className="h-4 w-4 text-yellow-500" />}
              label={`Grade ${grade}`}
              value={count}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

// ✅ Section Wrapper with Divider
function Section({ title, children }) {
  return (
    <div className="pb-3 border-b border-gray-200 dark:border-dark-600">
      <h3 className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ✅ Compact Stat Card
function StatCard({ icon, label, value, colorCode = false }) {
  const getValueColor = () => {
    if (!colorCode || isNaN(value)) return "text-gray-900 dark:text-gray-100";
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center rounded-md border border-gray-200 dark:border-dark-500 bg-white dark:bg-dark-700 p-2 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        <div className="rounded bg-gray-100 dark:bg-dark-600 p-1">
          {icon}
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
          {label}
        </span>
      </div>
      <p className={`mt-1 text-sm font-bold ${getValueColor()}`}>{value}</p>
    </div>
  );
}
