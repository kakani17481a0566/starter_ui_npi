import { Page } from "components/shared/Page";
import { BasicInitial } from "./Component/NameCard/BasicInitial.jsx";
import { WithIcon } from "./Component/MainTab/MainTab";
import QuickChecklistCard from "./Component/QuickChecklistCard/index"
import MoodCard from "./Component/FeedBack/MoodCard"






// ----------------------------------------------------------------------

function ManiKLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#F5FFF5] via-[#E7FCEB] to-[#D9F8E0] bg-fixed">
      {/* Background SVG pattern */}
      <div className="absolute inset-0 bg-[url('/images/nutration/ManiKLayoutBackground.svg')] bg-[length:900px_900px] bg-center bg-repeat opacity-15"></div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-1 flex-col justify-start items-stretch px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

export default function Nutrition() {
  return (
    <Page title="Nutrition Dashboard">
      <ManiKLayout>
        {/* Header Section */}
        <div className="mb-6 space-y-3 text-center sm:text-left">
          {/* Avatar + Name */}
          <div className="flex justify-center sm:justify-start">
            <BasicInitial />
          </div>

          {/* Title + Subtitle */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-primary-950">
              Nutrition
            </h2>
            <p className="mt-0.5 text-sm text-primary-950">
              Find the right nutrition plan curated just for you here
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-2">
          <WithIcon />
          <QuickChecklistCard />
         <MoodCard
            title="How are you feeling today?"
            placeholder="Tell us how you feel..."
            themeColor="#5d8b63"
            buttonColor="#89a894"
            textColor="#1e2c22"
          />

          <MoodCard
            title="Share Your Feedback"
            placeholder="Tell us how you feel..."
            themeColor="#5d8b63"
            buttonColor="#89a894"
            textColor="#1e2c22"
          />


        </div>
      </ManiKLayout>
    </Page>
  );
}
