import { useEffect, useState } from "react";
import { Page } from "components/shared/Page";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { WeekTimeTable } from "app/pages/dashboards/teacher/WeekTimeTable";
import { getSessionData } from "utils/sessionStorage";

export default function TermPlan() {
  const { course: allCourses } = getSessionData();
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Load stored or lowest ID course
  useEffect(() => {
    if (allCourses?.length > 0) {
      const storedId = Number(localStorage.getItem("selectedCourseId"));
      const initial =
        allCourses.find((c) => c.id === storedId) ||
        allCourses.reduce((min, c) => (c.id < min.id ? c : min), allCourses[0]);

      setSelectedCourseId(initial?.id ?? null);
    }
  }, [allCourses]);

  return (
    <Page title="Academic Term Plan">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Heading with icon */}
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
            <h2 className="truncate text-xl font-semibold tracking-wide text-primary-950 dark:text-dark-50">
              Academic Week Plan
            </h2>
          </div>

          <div className="mt-4">
            <WeekTimeTable courseId={selectedCourseId} />
          </div>
        </div>
      </div>
    </Page>
  );
}
