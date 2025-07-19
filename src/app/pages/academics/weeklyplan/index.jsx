import { Page } from "components/shared/Page";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { WeekTimeTable } from "app/pages/dashboards/teacher/WeekTimeTable";
import { getSessionData } from "utils/sessionStorage"; // ✅ Import session helper

export default function TermPlan() {
  const { course } = getSessionData(); // ✅ Get courses from session
  const defaultCourseId = course?.[0]?.id ?? null; // ✅ Safely get the first course ID

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
            <WeekTimeTable selectedCourseId={defaultCourseId} /> {/* ✅ Passed as prop */}
          </div>
        </div>
      </div>
    </Page>
  );
}
