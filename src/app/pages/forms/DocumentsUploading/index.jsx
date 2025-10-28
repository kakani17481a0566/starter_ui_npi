import { Page } from "components/shared/Page";
import DocumentSection from "./DocumentSection";

export default function FrontDeskDashboard() {
  return (
    <Page title="Front Desk Dashboard">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* 🔹 Title */}
          <h2 className="dark:text-dark-50 mb-6 truncate text-xl font-medium tracking-wide text-gray-800">
            Upload Documents
          </h2>

          {/* 🔹 Only Document Section */}
          <div className="rounded-lg border border-gray-200 dark:border-dark-500 bg-white dark:bg-dark-700 shadow-sm p-6">
            <DocumentSection />
          </div>
        </div>
      </div>
    </Page>
  );
}
