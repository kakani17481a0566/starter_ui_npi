import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Card } from "components/ui";

export function SkillsPerformance({
  subjectWiseAssessments,
  selectedStudentId,
  selectedStudentName,
  selectedSubjectCode, // ✅ new
}) {
  if (!subjectWiseAssessments || !selectedStudentId) return null;

  const skills = [];

  for (const subject of subjectWiseAssessments) {
    // ✅ filter only selected subject
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

  if (!skills.length) {
    return (
      <Card className="px-4 py-4">
        <h2 className="mb-2 font-medium text-gray-800 dark:text-dark-100">Skills Performance</h2>
        <p className="text-sm text-gray-500 dark:text-dark-300">{selectedStudentName}</p>
        <p className="mt-4 text-sm text-gray-400 dark:text-dark-300">
          No skills found for {selectedSubjectCode ? `subject "${selectedSubjectCode}"` : "this student"}.
        </p>
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

      <div className="mt-4 flex justify-between">
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">Skill</p>
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">Score</p>
      </div>

      <div className="mt-2 space-y-2.5">
        {skills.map((item, index) => (
          <div key={index} className="flex justify-between gap-4">
            <p className="truncate text-sm text-gray-800 dark:text-dark-100">
              {item.skillName}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm-plus text-gray-800 dark:text-dark-100">
                {item.grade} ({item.score})
              </p>
              {item.score >= 90 ? (
                <ArrowUpIcon className="text-success size-3 stroke-2" />
              ) : item.score < 75 ? (
                <ArrowDownIcon className="text-error size-3 stroke-2" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
