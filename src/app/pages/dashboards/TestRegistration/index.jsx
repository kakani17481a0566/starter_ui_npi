// src/app/pages/dashboards/Attendence/page.jsx

import { Page } from "components/shared/Page";
import StudentTest from "../teacher/TestRegistartion";

export default function TestRegistration() {

  return (
    <Page title="Attendance">
      <div
        className="transition-content w-full pt-5 lg:pt-6"
        style={{ paddingLeft: "var(--margin-x)", paddingRight: "var(--margin-x)" }}
      >

        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
           Student Test
          </h2>
        </div>
        <StudentTest/>

      </div>
    </Page>
  );
}

