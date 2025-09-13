import {
  ChartBarIcon,
  ChartPieIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  TrophyIcon,
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
          icon={<ChartBarIcon className="h-5 w-5 text-white" />}
          label="Average"
          value={selectedStudent.averageScore ?? "N/A"}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon={<ChartPieIcon className="h-5 w-5 text-white" />}
          label="Std Dev"
          value={selectedStudent.standardDeviation ?? "N/A"}
          gradient="from-purple-500 to-pink-600"
        />
      </Section>

      {/* 📝 Assessment Stats */}
      <Section title="Assessments">
        <StatCard
          icon={<ClipboardDocumentCheckIcon className="h-5 w-5 text-white" />}
          label="Total"
          value={totalAssessments}
          gradient="from-emerald-400 to-teal-600"
        />
        <StatCard
          icon={<CheckCircleIcon className="h-5 w-5 text-white" />}
          label="Graded"
          value={totalGraded}
          gradient="from-cyan-500 to-sky-600"
        />
        <StatCard
          icon={<PresentationChartBarIcon className="h-5 w-5 text-white" />}
          label="Graded %"
          value={`${gradedPercentage}%`}
          gradient="from-pink-500 to-rose-600"
        />
      </Section>

      {/* 🏆 Grade Breakdown */}
      <Section title="Grade Breakdown">
        {Object.entries(gradeMap).map(([grade, count], idx) => (
          <StatCard
            key={grade}
            icon={<TrophyIcon className="h-5 w-5 text-white" />}
            label={grade}
            value={count}
            gradient={
              idx % 2 === 0
                ? "from-yellow-400 to-orange-500"
                : "from-amber-500 to-red-500"
            }
          />
        ))}
      </Section>
    </div>
  );
}

// ✅ Reusable Section Wrapper
function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

// ✅ Compact Chip-Style Stat Card
function StatCard({ icon, label, value, gradient }) {
  return (
    <div
      className={`flex items-center justify-between rounded-md bg-gradient-to-r ${gradient} px-3 py-2 text-white shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-center gap-2">
        <div className="rounded bg-white/20 p-1">{icon}</div>
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
