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
    <div className="col-span-12 px-2 sm:col-span-6 lg:col-span-4">
      {/* ✅ Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<ChartBarIcon className="h-6 w-6 text-blue-500" />}
          label="Average Score"
          value={selectedStudent.averageScore ?? "N/A"}
          colorCode={true}
        />
        <StatCard
          icon={<ChartPieIcon className="h-6 w-6 text-purple-500" />}
          label="Std. Deviation"
          value={selectedStudent.standardDeviation ?? "N/A"}
          colorCode={true}
        />
        <StatCard
          icon={<ClipboardDocumentCheckIcon className="h-6 w-6 text-emerald-500" />}
          label="Total Assessments"
          value={totalAssessments}
        />
        <StatCard
          icon={<CheckCircleIcon className="h-6 w-6 text-teal-500" />}
          label="Graded Count"
          value={totalGraded}
        />
        <StatCard
          icon={<PresentationChartBarIcon className="h-6 w-6 text-pink-500" />}
          label="Graded %"
          value={`${gradedPercentage}%`}
        />

        {/* ✅ Grade Count per Grade */}
        {Object.entries(gradeMap).map(([grade, count]) => (
          <StatCard
            key={grade}
            icon={<TrophyIcon className="h-6 w-6 text-yellow-500" />}
            label={`${grade} Count`}
            value={count}
          />
        ))}
      </div>
    </div>
  );
}


// ✅ Mini Card Component
function StatCard({ icon, label, value, colorCode = false }) {
  const getValueColor = () => {
    if (!colorCode || isNaN(value)) return "text-gray-900 dark:text-gray-100";
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center rounded-lg border border-gray-200 dark:border-dark-500 bg-gray-50 dark:bg-dark-700 p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex flex-col items-center gap-2">
        <div className="rounded-md bg-gray-100 dark:bg-dark-600 p-2">
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
          {label}
        </span>
      </div>
      <p className={`text-lg font-bold ${getValueColor()}`}>{value}</p>
    </div>
  );
}
