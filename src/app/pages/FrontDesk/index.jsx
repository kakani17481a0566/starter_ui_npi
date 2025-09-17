import { Page } from "components/shared/Page";
import { Overview } from "./Components/Overview";
import { StudentTeacherAttendenceTracking } from "./Components/StudentTeacherAttendenceTracking";
import { MoneyControl } from "./Components/MoneyControl";


export default function FrontDeskDashboard() {
  return (
    <Page title="Front Desk Dashboard">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="dark:text-dark-50 mb-4 truncate text-xl font-medium tracking-wide text-gray-800">
            Dashboard Overview
          </h2>

          {/* ✅ Row 1: Overview always full width */}
          <div className="mb-6 w-full">
            <Overview />
          </div>

          {/* ✅ Row 2: Responsive Attendance */}
          <div className="grid grid-cols-12 gap-6">
            {/* 🔹 Attendance block: 75% width on lg screens */}
            <div className="col-span-12 lg:col-span-9">
              <StudentTeacherAttendenceTracking />
            </div>

            {/* 🔹 Optional right block: 25% width on lg screens */}
            <div className="col-span-12 lg:col-span-3">

                <MoneyControl />

            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
