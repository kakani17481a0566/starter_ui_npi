// ----------------------------------------------------------------------
// 📦 Imports
// ----------------------------------------------------------------------
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";

import PuzzleGame from "../../Component/Games/PuzzleGame";
import FollowTheLineGame from "../../Component/Games/FollowTheLineGame";
import FollowTheLineGame2 from "../../Component/Games/FollowTheLineGame2";
import Blunder from "../../Component/Games/Blunder";

import { Button, Tag } from "components/ui";
import DynamicTabs from "./DynamicTabs";

// ----------------------------------------------------------------------
// 🧠 Component
// ----------------------------------------------------------------------
export default function WithIcon() {
  const [quote, setQuote] = useState("");

  // --------------------------------------------------------------------
  // 🌟 Fetch motivational quote
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
  // 🔘 Reusable Action Button
  // --------------------------------------------------------------------
  const ActionButton = ({ children }) => (
    <button className="rounded-lg bg-[#8EB197] px-5 py-2 font-semibold text-[#1A4255] shadow-sm transition-all duration-200 hover:bg-[#7AA587]">
      {children}
    </button>
  );

  // ----------------------------------------------------------------------
  // 🧭 Tabs Configuration
  // ----------------------------------------------------------------------
  const tabs = [
    // --------------------------------------------------------------
    // 🍽️ Meal Plan Tab
    // --------------------------------------------------------------
    {
      id: "meal",
      title: "Meal Plan",
      content: (
        <div className="w-full space-y-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold italic text-[#1A4255] leading-relaxed">
            {`“${quote}”`}
          </h1>

          <DynamicTabs />
        </div>
      ),
    },

    // --------------------------------------------------------------
    // 🎮 Games Tab
    // --------------------------------------------------------------
    {
      id: "games",
      title: "Games",
      content: (
        <div>
          <p className="text-[#1A4255]">
            Engage in fun games that improve motor skills, coordination, and
            problem-solving abilities.
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
            <ActionButton>Play Now on NeuroPi</ActionButton>
            <ActionButton>More Games</ActionButton>
          </div>
        </div>
      ),
    },

    // --------------------------------------------------------------
    // 📖 Story Tab
    // --------------------------------------------------------------
    {
      id: "story",
      title: "Story",
      content: (
        <div>
          <p className="text-[#1A4255]">
            Enjoy captivating stories that spark imagination and build
            comprehension.
          </p>

          <div className="space-x-2 pt-3">
            <Tag>Fairy Tales</Tag>
            <Tag>Adventure</Tag>
          </div>

          <div className="space-x-2 pt-4">
            <ActionButton>Read with NeuroPi</ActionButton>
            <ActionButton>More Stories</ActionButton>
          </div>
        </div>
      ),
    },

    // --------------------------------------------------------------
    // ⭐ Assessment Tab
    // --------------------------------------------------------------
    {
      id: "assessment",
      title: (
        <div className="relative -ml-[1px] flex w-full items-center justify-end">
          <div className="relative inline-flex items-center justify-center">
            <img
              src="/images/nutration/AssessmentButton.svg"
              alt="Assessment Button"
              className="h-8 w-28 object-contain drop-shadow-sm sm:h-9 sm:w-32"
            />

            <span className="absolute ml-[9px] flex items-center text-sm sm:text-base font-semibold text-[#1A4255]">
              Assessment
              <img
                src="/images/nutration/AssessmentStar.svg"
                alt="Star"
                className="relative -mr-1 h-[40px] w-[40px]"
              />
            </span>
          </div>
        </div>
      ),
      content: (
        <div className="relative flex flex-col items-center text-center">
          <p className="max-w-lg text-[#1A4255]">
            Track your progress and assess your nutrition learning journey with
            NeuroPi’s smart evaluation tools.
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

  // ----------------------------------------------------------------------
  // 🎨 Render Layout
  // ----------------------------------------------------------------------
  return (
    <div className="w-full">
      <TabGroup defaultIndex={0}>
        {/* ---------------------------------------------------------- */}
        {/* Tabs Header */}
        {/* ---------------------------------------------------------- */}
        <div className="hide-scrollbar overflow-x-auto">
          <TabList className="flex flex-wrap justify-center gap-4 border-b border-transparent sm:justify-start">
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
                      <span className="rounded-md bg-[#83B197] px-5 text-sm font-semibold text-[#1A4255] transition-all">
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

        {/* ---------------------------------------------------------- */}
        {/* Tabs Panels */}
        {/* ---------------------------------------------------------- */}
        <TabPanels className="mt-0 w-full rounded-b-lg bg-white p-5 shadow-sm">
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>{tab.content}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
