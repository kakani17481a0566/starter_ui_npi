import { Page } from "components/shared/Page";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { TermTimeTable } from "app/pages/dashboards/teacher/TermTimeTable";
import { getSessionData } from "utils/sessionStorage";

export default function TermPlan() {
  const { course: courses,role,selectedCourseId } = getSessionData();
  const storedId = Number(localStorage.getItem("selectedCourseId"));
  let selectedCourse =
    courses?.find((c) => c.id === storedId).id || courses?.[0].id;
  if(role==="PARENT"){
    selectedCourse=selectedCourseId;

  }


  return (
    <Page title="Academic Term Plan">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Heading with icon */}
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
            <h2 className="truncate text-xl font-semibold tracking-wide text-primary-950 dark:text-dark-50">
              Academic Term Plan
            </h2>
          </div>

          <div className="mt-4">
            <TermTimeTable courseId={selectedCourse} />
          </div>
        </div>
      </div>
    </Page>
  );
}
