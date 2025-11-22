// ----------------------------------------------------------------------
// 📦 Dependencies
// ----------------------------------------------------------------------
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// ----------------------------------------------------------------------
// 🎮 Games
// ----------------------------------------------------------------------
import PuzzleGame from "../../Component/Games/PuzzleGame";
import FollowTheLineGame from "../../Component/Games/FollowTheLineGame";
import FollowTheLineGame2 from "../../Component/Games/FollowTheLineGame2";
import Blunder from "../../Component/Games/Blunder";

import MusicPlayer from "../../Component/Story/MusicPlayer";

// ----------------------------------------------------------------------
// 📁 Local Components
// ----------------------------------------------------------------------
import { Button, Tag } from "components/ui";
import DynamicTabs from "./DynamicTabs";

// ----------------------------------------------------------------------
// 🧠 Component
// ----------------------------------------------------------------------
export default function WithIcon() {
  const [quote, setQuote] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // ⭐ COMMON DATE STATE

  // --------------------------------------------------------------------
  // 🔹 Fetch Quote on Mount
  // --------------------------------------------------------------------
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/Nutrition/quote");
        const data = await response.json();

        setQuote(
          data.quote ||
            "You don't have to eat less, you just have to eat right."
        );
      } catch (error) {
        console.error("Quote fetch failed:", error);
        setQuote("You don't have to eat less, you just have to eat right.");
      }
    };

    fetchQuote();
  }, []);

  // --------------------------------------------------------------------
  // 💚 Reusable Button
  // --------------------------------------------------------------------
  const ActionButton = ({ children }) => (
    <button className="rounded-lg bg-[#8EB197] px-5 py-2 font-semibold text-[#1A4255] shadow-sm transition hover:bg-[#7AA587]">
      {children}
    </button>
  );

  // --------------------------------------------------------------------
  // 🧭 Nutrition, Games, Story, Assessment Tabs
  // --------------------------------------------------------------------
  const tabs = [
    // ------------------------------------------------------------
    // 🍽️ MEAL PLAN TAB
    // ------------------------------------------------------------
    {
      id: "meal",
      title: "Meal Plan",
      content: (
        <div className="w-full space-y-6 text-left">

          {/* Quote */}
          <h1 className="text-2xl leading-relaxed font-semibold text-[#1A4255] italic sm:text-3xl">
            {`“${quote}”`}
          </h1>

          {/* Nutrition Module */}
          <DynamicTabs
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      ),
    },

    // ------------------------------------------------------------
    // 🎮 GAMES TAB
    // ------------------------------------------------------------
    {
      id: "games",
      title: "Games",
      content: (
        <div>
          <p className="text-[#1A4255]">
            Fun and interactive games to improve skills & coordination.
          </p>

          <PuzzleGame />
          <FollowTheLineGame />
          <FollowTheLineGame2 />
          <Blunder />

          <div className="space-x-2 pt-3">
            <Tag>Puzzle</Tag>
            <Tag>Memory</Tag>
          </div>

          <div className="space-x-2 pt-4">
            <ActionButton>Play Now</ActionButton>
            <ActionButton>More Games</ActionButton>
          </div>
        </div>
      ),
    },

    // ------------------------------------------------------------
    // 📚 STORY TAB
    // ------------------------------------------------------------
    {
      id: "story",
      title: "Story",
      content: (
        <div>
           <MusicPlayer />

        </div>
      ),
    },

    // ------------------------------------------------------------
    // ⭐ ASSESSMENT TAB (Custom SVG)
    // ------------------------------------------------------------
    {
      id: "assessment",
      title: (
        <div className="relative -ml-[1px] flex w-full items-center justify-end">
          <div className="relative inline-flex items-center justify-center">
            <img
              src="/images/nutration/AssessmentButton.svg"
              alt="Assessment Button"
              className="h-8 w-28 sm:h-9 sm:w-32 object-contain drop-shadow-sm"
            />

            <span className="absolute ml-[9px] flex items-center text-sm font-semibold text-[#1A4255] sm:text-base">
              Assessment
              <img
                src="/images/nutration/AssessmentStar.svg"
                alt="Star"
                className="h-[40px] w-[40px] -mr-1"
              />
            </span>
          </div>
        </div>
      ),
      content: (
        <div className="flex flex-col items-center text-center">
          <p className="max-w-lg text-[#1A4255]">
            Track your nutrition learning progress with assessments.
          </p>

          <div className="space-x-2 pt-3">
            <Tag>Skill</Tag>
            <Tag>Progress</Tag>
          </div>

          <div className="pt-4">
            <ActionButton>Start Assessment</ActionButton>
          </div>
        </div>
      ),
    },
  ];

  // --------------------------------------------------------------------
  // 🎨 Render Complete Tabs Section
  // --------------------------------------------------------------------
  return (
    <div className="w-full">
      <TabGroup defaultIndex={0}>

        {/* ------ Tab Headers ------ */}
        <div className="hide-scrollbar overflow-x-auto">
          <TabList className="flex flex-wrap justify-center gap-4 sm:justify-start">

            {tabs.map((tab) => (
              <Tab key={tab.id} as={Button} unstyled>
                {({ selected }) =>
                  tab.id !== "assessment" ? (
                    <div
                      className={clsx(
                        "flex items-center justify-center transition-all duration-300",
                        selected
                          ? "rounded-t-xl bg-white px-5 py-3 shadow-md"
                          : "bg-transparent"
                      )}
                    >
                      <span className="rounded-md bg-[#83B197] px-5 py-1 text-sm font-semibold text-[#1A4255]">
                        {tab.title}
                      </span>
                    </div>
                  ) : (
                    tab.title
                  )
                }
              </Tab>
            ))}

          </TabList>
        </div>

        {/* ------ Tab Content ------ */}
        <TabPanels className="mt-0 w-full rounded-b-lg bg-white p-5 shadow-sm">
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>{tab.content}</TabPanel>
          ))}
        </TabPanels>

      </TabGroup>
    </div>
  );
}
