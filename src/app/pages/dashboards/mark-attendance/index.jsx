import { Page } from "components/shared/Page";
import AttendanceTable from "app/pages/tables/Att"; // ✅ Correct path

export default function MarkAttendance() {
  return (
    <Page title="Mark Attendance">
      <div className="transition-content w-full px-[--margin-x] pt-5 lg:pt-6">
        <div className="min-w-0 mb-6">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Mark Attendance
          </h2>
        </div>

        {/* Render Attendance Table */}
        <AttendanceTable />
      </div>
    </Page>
  );
}
