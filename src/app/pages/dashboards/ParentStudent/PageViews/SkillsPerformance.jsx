import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

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
      <div className="px-4 py-6 text-center">
        <h2 className="mb-1 text-base font-semibold text-gray-800 dark:text-dark-100">
          Skills Performance
        </h2>
        <p className="text-xs text-gray-500 dark:text-dark-300">{selectedStudentName}</p>
        <div className="mt-3 text-xs text-gray-400 dark:text-dark-300">
          No skills found for{" "}
          {selectedSubjectCode ? `subject "${selectedSubjectCode}"` : "this student"}.
        </div>
      </div>
    );
  }

  const getGradeClass = (grade) => {
    switch (grade) {
      case "A+": return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "A":  return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "B":  return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      case "C":  return "bg-orange-500/20 text-orange-600 dark:text-orange-400";
      case "D":  return "bg-red-500/20 text-red-600 dark:text-red-400";
      default:   return "bg-gray-400/20 text-gray-700 dark:text-gray-300";
    }
  };

  const getBarClass = (score) => {
    if (score >= 90) return "from-green-400 to-green-600";
    if (score >= 75) return "from-blue-400 to-blue-600";
    if (score >= 50) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
            Skills Performance
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-300">{selectedStudentName}</p>
        </div>
        <div className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-dark-600 dark:text-dark-100">
          {skills.length} Skills
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedSkills.map((item, index) => (
          <div
            key={index}
            className="rounded border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-dark-500 dark:bg-dark-700"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <p
                className="truncate text-xs font-medium text-gray-800 dark:text-dark-100"
                title={item.skillName}
              >
                {item.skillName}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getGradeClass(item.grade)}`}
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
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-600">
              <div
                className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getBarClass(
                  item.score
                )}`}
                style={{ width: `${item.score ?? 0}%` }}
              ></div>
            </div>

            <p className="mt-1 text-right text-[10px] font-medium text-gray-500 dark:text-dark-300">
              {item.score} / 100
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
