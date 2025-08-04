import { Combobox } from "components/shared/form/Combobox";
import {
  Gauge,
  Activity,
  ListChecks,
  CheckCircle,
  Star,
  Percent,
} from "lucide-react";

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
export function Statistics({
  students,
  assessmentGrades,
  selectedStudent,
  setSelectedStudent,
}) {
  if (!students || !selectedStudent) return null;

  const { gradeMap, totalGraded } = computeGradeStats(
    assessmentGrades,
    selectedStudent.studentId
  );

  const totalAssessments = Object.keys(assessmentGrades).length;
  const gradedPercentage = totalAssessments
    ? ((totalGraded / totalAssessments) * 100).toFixed(1)
    : 0;

  return (
    <div className="col-span-12 px-4 sm:col-span-6 sm:px-5 lg:col-span-4">
      {/* ✅ Student Selector */}
      <Combobox
        data={students}
        displayField="studentName"
        value={selectedStudent}
        onChange={setSelectedStudent}
        placeholder="Select Student"
        searchFields={["studentName"]}
      />

      {/* ✅ Statistics Grid */}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
        <StatItem
          icon={<Gauge className="h-5 w-5" />}
          label="Average Score"
          value={selectedStudent.averageScore ?? "N/A"}
          colorCode={true}
        />
        <StatItem
          icon={<Activity className="h-5 w-5" />}
          label="Std. Deviation"
          value={selectedStudent.standardDeviation ?? "N/A"}
          colorCode={true}
        />
        <StatItem
          icon={<ListChecks className="h-5 w-5" />}
          label="Total Assessments"
          value={totalAssessments}
        />
        <StatItem
          icon={<CheckCircle className="h-5 w-5" />}
          label="Graded Count"
          value={totalGraded}
        />
        <StatItem
          icon={<Percent className="h-5 w-5" />}
          label="Graded %"
          value={`${gradedPercentage}%`}
        />

        {/* ✅ Grade Count per Grade */}
        {Object.entries(gradeMap).map(([grade, count]) => (
          <StatItem
            key={grade}
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            label={`${grade} Count`}
            value={count}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ Reusable stat item component
function StatItem({ icon, label, value, colorCode = false }) {
  const getValueColor = () => {
    if (!colorCode || isNaN(value)) return "text-gray-800";
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 text-gray-500 dark:text-dark-300" title={label}>
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
          {label}
        </p>
        <p className={`mt-1 text-xl font-medium ${getValueColor()} dark:text-dark-100`}>
          {value}
        </p>
      </div>
    </div>
  );
}
