import { Page } from "components/shared/Page";
import { Overview } from "./Components/Overview";
import { StudentTeacherAttendenceTracking } from "./Components/StudentTeacherAttendenceTracking";

export default function FrontDeskDashboard() {
  return (
    <Page title="Front Desk Dashboard">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 mb-4">
            Dashboard Overview
          </h2>

          {/* ✅ Row 1: Overview always full width */}
          <div className="w-full mb-6">
            <Overview />
          </div>

          {/* ✅ Row 2: Responsive Attendance */}
          <div className="w-full lg:w-3/4">
            <StudentTeacherAttendenceTracking />
          </div>
        </div>
      </div>
    </Page>
  );
}
