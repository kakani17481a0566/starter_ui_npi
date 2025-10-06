import { Page } from "components/shared/Page";
import { BranchHome } from "./Branch/Home";


export default function Branch() {
  return (
    <Page title="Student Enquiry Form">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 mb-4">
            Branch Management
          </h2>
          <BranchHome />

        </div>
      </div>
    </Page>
  );
}
