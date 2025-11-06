// src/app/pages/dashboards/Attendence/page.jsx

import { Page } from "components/shared/Page";
// import AttendanceDashboard from "app/pages/tables/attendece_dash_bord_table";
import ExerciseCheckOut from "app/pages/forms/ExerrciseCheckOut";

export default function Exerxise() {
  return (
    <Page title="Attendance">
      <div
        className="transition-content w-full pt-5 lg:pt-6"
        style={{ paddingLeft: "var(--margin-x)", paddingRight: "var(--margin-x)" }}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Exercise Test
          </h2>
        </div>

        <ExerciseCheckOut />
      </div>
    </Page>
  );
}

