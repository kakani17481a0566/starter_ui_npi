import { Page } from "components/shared/Page";
import MoodCard from "./MoodCard"; // adjust the path based on your folder structure

export default function FeelingToday() {
  return (
    <Page title="Example">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 mb-6">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Example Page
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Share how you’re feeling today.
          </p>
        </div>

        {/* ✅ Add MoodCard here */}
        <div className="flex justify-center">
          <MoodCard
            title="How are you feeling today?111111"
            placeholder="Tell us how you feel..."
            themeColor="#5d8b63"
            buttonColor="#89a894"
            textColor="#1e2c22"
          />
        </div>
      </div>
    </Page>
  );
}
