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
      <Card className="px-4 py-4 text-center">
        <h2 className="mb-2 font-medium text-gray-800 dark:text-dark-100">
          Skills Performance
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-300">
          {selectedStudentName}
        </p>
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
    <Card className="px-4 pb-4">
      <div className="flex flex-col gap-1 py-3">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Skills Performance
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-300">{selectedStudentName}</p>
      </div>

      <p>
        <span className="text-3xl font-medium text-gray-800 dark:text-dark-100">
          {skills.length}
        </span>{" "}
        <span className="text-xs text-success dark:text-success-lighter">Total Skills</span>
      </p>
      <p className="mt-0.5 text-xs-plus text-gray-400 dark:text-dark-300">Grade & Score</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sortedSkills.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
              <p
                className="truncate text-sm font-medium text-gray-800 dark:text-dark-100"
                title={item.skillName}
              >
                {item.skillName}
              </p>
              <div className="flex items-center gap-1">
                {/* Grade Badge */}
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.grade === "A+"
                      ? "bg-green-100 text-green-700"
                      : item.grade === "A"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.grade === "B"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.grade}
                </span>
                {/* Arrow Icon */}
                {item.score >= 90 ? (
                  <ArrowUpIcon className="text-success size-3 stroke-2" />
                ) : item.score < 75 ? (
                  <ArrowDownIcon className="text-error size-3 stroke-2" />
                ) : null}
              </div>
            </div>

            {/* Score Bar */}
            <div className="relative h-2 w-full rounded bg-gray-200">
              <div
                className="absolute top-0 left-0 h-full rounded bg-emerald-500"
                style={{ width: `${item.score ?? 0}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-0.5">{item.score} / 100</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
