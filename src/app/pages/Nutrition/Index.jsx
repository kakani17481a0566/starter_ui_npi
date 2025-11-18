// ----------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------
import { Page } from "components/shared/Page";
import { BasicInitial } from "./Component/NameCard/BasicInitial.jsx";
import WithIcon from "./Component/MainTab/MainTab";
import QuickChecklistCard from "./Component/QuickChecklistCard/index";
import MoodCard from "./Component/FeedBack/MoodCard";

// ----------------------------------------------------------------------
// Layout Component
// ----------------------------------------------------------------------
function ManiKLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#F5FFF5] via-[#E7FCEB] to-[#D9F8E0] bg-fixed">
      {/* 🌿 Background SVG pattern */}
      <div className="absolute inset-0 bg-[url('/images/nutration/ManiKLayoutBackground.svg')] bg-[length:900px_900px] bg-center bg-repeat opacity-100 mix-blend-multiply"></div>

      {/* 🌤 Soft overlay for tone balance */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-1 flex-col justify-start items-stretch px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Nutrition Page
// ----------------------------------------------------------------------
export default function Nutrition() {
  return (
    <Page title="Nutrition Dashboard">
      <ManiKLayout>
        {/* ===================== 🧩 HEADER SECTION ===================== */}
        <div className="mb-6 space-y-3 text-center sm:text-left">
          {/* 👤 Avatar + Name */}
          <div className="flex justify-center sm:justify-start">
            <BasicInitial />
          </div>

          {/* 🧠 Title + Subtitle + Arrow */}
          <div className="relative inline-block">
            <h2 className="text-sm sm:text-2xl tracking-tight text-primary-950">
              Nutrition
            </h2>

            <div className="flex items-center justify-center sm:justify-start relative">
              <p className="mt-0.5 text-sm text-primary-950">
                Find the right nutrition plan curated just for you here
              </p>

              {/* ➡️ Curved Arrow SVG */}
              <img
                src="/images/nutration/Arrow_pointingDow_curvy.svg"
                alt="Decorative Arrow"
                className="w-15 h-auto ml-2 sm:ml-3 absolute right-[-3rem] top-[-1.8rem] sm:right-[-1.5rem] sm:top-[-3rem] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ===================== 🧭 MAIN CONTENT SECTION ===================== */}
        <div className="mt-2 space-y-6">
          {/* 📋 Tabs Section */}
          <div className="section-tabs">
            <WithIcon />
          </div>

          {/* ✅ Checklist Section */}
          <div className="section-checklist">
            <QuickChecklistCard />
          </div>

          {/* 😊 Mood Feedback Section */}
          <div className="section-feedback">
            <MoodCard
              title="How are you feeling today?"
              placeholder="Tell us how you feel..."
              themeColor="#548C62"
              buttonColor="#8EB297"
              textColor="#1A4255"
            />
          </div>

          {/* 🗣️ General Feedback Section */}
          <div className="section-feedback">
            <MoodCard
              title="Share Your Feedback"
              placeholder="Tell us how you feel..."
              themeColor="#548C62"
              buttonColor="#8EB297"
              textColor="#1A4255"
            />
          </div>
        </div>
      </ManiKLayout>
    </Page>
  );
}
