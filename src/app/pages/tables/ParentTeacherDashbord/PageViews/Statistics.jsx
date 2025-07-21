import { Combobox } from "components/shared/form/Combobox";
import { Gauge, Activity, ListChecks, CheckCircle, Star } from "lucide-react";

// ----------------------------------------------------------------------

export function Statistics({
  students,
  assessmentGrades,
  selectedStudent,
  setSelectedStudent,
}) {
  if (!students || !selectedStudent) return null;

  const gradeMap = {};

  // Count graded assessments for selected student
  for (const header in assessmentGrades) {
    const gradeEntry = assessmentGrades[header][selectedStudent.studentId];
    if (!gradeEntry?.grade) continue;
    if (!gradeMap[gradeEntry.grade]) {
      gradeMap[gradeEntry.grade] = 0;
    }
    gradeMap[gradeEntry.grade]++;
  }

  const totalGraded = Object.values(gradeMap).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="col-span-12 px-4 sm:col-span-6 sm:px-5 lg:col-span-4">
      <Combobox
        data={students}
        displayField="studentName"
        value={selectedStudent}
        onChange={setSelectedStudent}
        placeholder="Select Student"
        searchFields={["studentName"]}
      />

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
        <StatItem
          icon={<Gauge className="h-5 w-5" />}
          label="Average Score"
          value={selectedStudent.averageScore ?? "N/A"}
        />
        <StatItem
          icon={<Activity className="h-5 w-5" />}
          label="Std. Deviation"
          value={selectedStudent.standardDeviation ?? "N/A"}
        />
        <StatItem
          icon={<ListChecks className="h-5 w-5" />}
          label="Total Assessments"
          value={Object.keys(assessmentGrades).length}
        />
        <StatItem
          icon={<CheckCircle className="h-5 w-5" />}
          label="Graded Count"
          value={totalGraded}
        />

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

// Reusable stat item component
function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 text-gray-500 dark:text-dark-300">{icon}</div>
      <div>
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
          {label}
        </p>
        <p className="mt-1 text-xl font-medium text-gray-800 dark:text-dark-100">
          {value}
        </p>
      </div>
    </div>
  );
}
