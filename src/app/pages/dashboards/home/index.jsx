import { Page } from "components/shared/Page";
import Teacher from "app/pages/dashboards/teacher";

export default function Home() {
  return (
    <Page title="Homepage">
      {/* <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6"> */}

      <div className="transition-content w-full  pt-5 lg:pt-6">
        {/* Optional heading if you still want one */}
        {/* <div className="min-w-0 mb-4">
          <h2 className="truncate text-xl font-medium tracking-wide text-primary-950 dark:text-dark-100  dark:text-dark-50">
            Welcome, Teacher
          </h2>
        </div> */}

        {/* Render the Teacher dashboard */}
        <Teacher />
      </div>
    </Page>
  );
}
