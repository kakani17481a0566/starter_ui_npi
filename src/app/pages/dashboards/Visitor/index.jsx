// src/app/pages/dashboards/Attendence/page.jsx

import { Page } from "components/shared/Page";
import KYCForm from "app/pages/forms/KYCForm";
export default function KYCFORM() {
  return (
    <Page title="Attendance">
      <div
        className="transition-content w-full pt-5 lg:pt-6"
        style={{ paddingLeft: "var(--margin-x)", paddingRight: "var(--margin-x)" }}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Visitor
          </h2>
        </div>

        <KYCForm />
      </div>
    </Page>
  );
}

