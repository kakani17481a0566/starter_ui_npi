import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Card } from "components/ui";

export function SkillsPerformance({
  subjectWiseAssessments,
  selectedStudentId,
  selectedStudentName,
  selectedSubjectCode,
}) {
  if (!subjectWiseAssessments || !selectedStudentId) return null;

  const skills = [];

  for (const subject of subjectWiseAssessments) {
    if (selectedSubjectCode && subject.subjectCode !== selectedSubjectCode) continue;

    for (const skill of subject.skills) {
      const scoreEntry = skill.studentScores.find(
        (entry) => entry.studentId === selectedStudentId
      );
      if (scoreEntry) {
        skills.push({
          skillName: skill.skillName,
          grade: scoreEntry.grade,
          score: scoreEntry.score,
        });
      }
    }
  }

  const sortedSkills = [...skills].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (!skills.length) {
    return (
      <Card className="px-6 py-8 text-center">
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-dark-100">
          Skills Performance
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-300">{selectedStudentName}</p>
        <div className="mt-4 text-sm text-gray-400 dark:text-dark-300">
          No skills found for{" "}
          {selectedSubjectCode ? `subject "${selectedSubjectCode}"` : "this student"}.
          <br />
          Try selecting a different subject or week.
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
            Skills Performance
          </h2>
          <p className="text-sm text-gray-500 dark:text-dark-300">{selectedStudentName}</p>
        </div>
        <div className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-dark-600 dark:text-dark-100">
          {skills.length} Skills
        </div>
      </div>

      {/* Skill cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sortedSkills.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-dark-500 dark:bg-dark-700"
          >
            {/* Skill Header */}
            <div className="mb-2 flex items-center justify-between gap-2">
              <p
                className="truncate text-sm font-medium text-gray-800 dark:text-dark-100"
                title={item.skillName}
              >
                {item.skillName}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.grade === "A+"
                      ? "bg-green-100 text-green-700"
                      : item.grade === "A"
                      ? "bg-blue-100 text-blue-700"
                      : item.grade === "B"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.grade}
                </span>
                {item.score >= 90 ? (
                  <ArrowUpIcon className="size-3 stroke-2 text-emerald-500" />
                ) : item.score < 75 ? (
                  <ArrowDownIcon className="size-3 stroke-2 text-red-500" />
                ) : null}
              </div>
            </div>

            {/* Score Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-600">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                style={{ width: `${item.score ?? 0}%` }}
              ></div>
            </div>

            {/* Score Text */}
            <p className="mt-2 text-right text-xs font-medium text-gray-500 dark:text-dark-300">
              {item.score} / 100
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
