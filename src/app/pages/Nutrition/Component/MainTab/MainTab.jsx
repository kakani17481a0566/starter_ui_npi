// ----------------------------------------------------------------------
// 📦 Import Dependencies
// ----------------------------------------------------------------------
import clsx from "clsx"; // Utility for conditional className combinations
import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"; // HeadlessUI Tabs

import PuzzleGame from "../../Component/Games/PuzzleGame";

import FollowTheLineGame from "../../Component/Games/FollowTheLineGame";
import FollowTheLineGame2 from "../../Component/Games/FollowTheLineGame2";
import Blunder from "../../Component/Games/Blunder";

// ----------------------------------------------------------------------
// 📁 Local Imports
// ----------------------------------------------------------------------
import { Button, Tag } from "components/ui"; // Custom UI components
import DynamicTabs from "./DynamicTabs"; // Nutrition DynamicTabs section

// ----------------------------------------------------------------------
// 🧠 Component Definition
// ----------------------------------------------------------------------
export default function WithIcon() {
  // --------------------------------------------------------------------
  // 🧩 Local State
  // --------------------------------------------------------------------
  const [quote, setQuote] = useState(""); // Stores motivational quote text

  // --------------------------------------------------------------------
  // ⚙️ Fetch Quote from API
  // --------------------------------------------------------------------
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Try fetching from backend API
        const response = await fetch("/api/Nutrition/quote");
        const data = await response.json();

        // If no quote found, use fallback quote
        setQuote(
          data.quote ||
            "You don't have to eat less, you just have to eat right.",
        );
      } catch (error) {
        // Handle network or API errors gracefully
        console.error("Failed to fetch quote:", error);
        setQuote("You don't have to eat less, you just have to eat right.");
      }
    };

    fetchQuote(); // Trigger quote fetch when component mounts
  }, []);

  // --------------------------------------------------------------------
  // 💚 Reusable Button Style
  // --------------------------------------------------------------------
  const ActionButton = ({ children }) => (
    <button className="rounded-lg bg-[#8EB197] px-5 py-2 font-semibold text-[#1A4255] shadow-sm transition-all duration-200 hover:bg-[#7AA587]">
      {children}
    </button>
  );

  // --------------------------------------------------------------------
  // 🧭 Tabs Configuration (content for each tab)
  // --------------------------------------------------------------------
  const tabs = [
    // --------------------------------------------------------------
    // 🍽️ Meal Plan Tab
    // --------------------------------------------------------------
    {
      id: "meal",
      title: "Meal Plan",
      content: (
        <div className="w-full space-y-6 text-left">
          {/* Quote Section */}
          <h1 className="text-2xl leading-relaxed font-semibold text-[#1A4255] italic sm:text-3xl">
            {`“${quote}”`}
          </h1>

          {/* Dynamic Tab Section */}
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
            Engage in fun and interactive games designed to improve motor
            skills, coordination, and problem-solving abilities.
          </p>

          <PuzzleGame />

          <FollowTheLineGame />

          <FollowTheLineGame2 />

          <Blunder />

          {/* Game Tags */}
          <div className="space-x-2 pt-3">
            <Tag href="#">Puzzle</Tag>
            <Tag href="#">Memory</Tag>
          </div>

          {/* CTA Buttons */}
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
            Enjoy captivating stories that spark imagination and teach moral
            values while improving comprehension.
          </p>

          {/* Story Tags */}
          <div className="space-x-2 pt-3">
            <Tag href="#">Fairy Tales</Tag>
            <Tag href="#">Adventure</Tag>
          </div>

          {/* CTA Buttons */}
          <div className="space-x-2 pt-4">
            <ActionButton>Read with NeuroPi</ActionButton>
            <ActionButton>Discover More Stories</ActionButton>
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
          {/* Outer Wrapper to align button on right side */}
          <div className="relative inline-flex items-center justify-center">
            {/* Background SVG for Assessment Tab */}
            <img
              src="/images/nutration/AssessmentButton.svg"
              alt="Assessment Button"
              className="h-8 w-28 object-contain drop-shadow-sm sm:h-9 sm:w-32"
            />

            {/* Text & Star Icon Overlay (shifted slightly right) */}
            <span className="absolute ml-[9px] flex items-center text-sm font-semibold text-[#1A4255] sm:text-base">
              Assessment
              <img
                src="/images/nutration/AssessmentStar.svg"
                alt="Star"
                className="relative -mr-1 h-[40px] w-[40px] sm:h-[40px] sm:w-[40px]"
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

          {/* Assessment Tags */}
          <div className="space-x-2 pt-3">
            <Tag href="#">Skill</Tag>
            <Tag href="#">Progress</Tag>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <ActionButton>Start Assessment</ActionButton>
          </div>
        </div>
      ),
    },
  ];

  // --------------------------------------------------------------------
  // 🎨 Render Tabs
  // --------------------------------------------------------------------
  return (
    <div className="w-full">
      <TabGroup defaultIndex={0}>
        {/* ---------------------------------------------------------- */}
        {/* 🔖 Tabs Header Section */}
        {/* ---------------------------------------------------------- */}
        <div className="hide-scrollbar overflow-x-auto">
          <TabList className="flex flex-wrap justify-center gap-4 border-b border-transparent sm:justify-start">
            {tabs.map((tab) => (
              <Tab key={tab.id} as={Button} unstyled>
                {({ selected }) =>
                  // Skip custom button styling for the Assessment tab
                  tab.id !== "assessment" ? (
                    <div
                      className={clsx(
                        // Base styles for each tab wrapper
                        "flex items-center justify-center transition-all duration-300",
                        // Selected tab → white rounded background (top corners only)
                        selected
                          ? "rounded-t-xl rounded-b-none bg-white px-5 py-3 shadow-md"
                          : "bg-transparent",
                      )}
                    >
                      {/* ✅ Green Button Element */}
                      {/* Reduced height for cleaner look (was py-2 → now py-1.5) */}
                      <span className="rounded-md bg-[#83B197] px-5 text-sm font-semibold text-[#1A4255] transition-all duration-300">
                        {tab.title}
                      </span>
                    </div>
                  ) : (
                    // Render Assessment tab as-is (custom SVG version)
                    tab.title
                  )
                }
              </Tab>
            ))}
          </TabList>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* 🧩 Tab Panels Section */}
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
