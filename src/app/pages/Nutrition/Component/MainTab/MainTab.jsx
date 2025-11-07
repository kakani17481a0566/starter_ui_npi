// ----------------------------------------------------------------------
// Import Dependencies
// ----------------------------------------------------------------------
import {
    RestaurantMenu as RestaurantMenuIcon,
    SportsEsports as SportsEsportsIcon,
    MenuBook as MenuBookIcon,
    Assessment as AssessmentIcon,
} from "@mui/icons-material";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// ----------------------------------------------------------------------
// Local Imports
// ----------------------------------------------------------------------
import { Button, Tag } from "components/ui";
import DynamicTabs from "./DynamicTabs";

// ----------------------------------------------------------------------
// Component Definition
// ----------------------------------------------------------------------
export const WithIcon = () => {
    // ---- Dynamic Quote State ----
    const [quote, setQuote] = useState("");

    // ---- Fetch Quote from Backend ----
    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch("/api/Nutrition/quote"); // adjust endpoint
                const data = await response.json();

                // Expecting { quote: "You don't have to eat less, you just have to eat right." }
                setQuote(data.quote || "You don't have to eat less, you just have to eat right.");
            } catch (error) {
                console.error("Failed to fetch quote:", error);
                setQuote("You don't have to eat less, you just have to eat right."); // fallback
            }
        };

        fetchQuote();
    }, []);

    // ----------------------------------------------------------------------
    // Tab Configuration (dynamic content inside)
    // ----------------------------------------------------------------------
    const tabs = [
        {
            id: "meal",
            title: "Meal Plan",
            icon: RestaurantMenuIcon,
            content: (
                <div className="w-full text-left">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-primary-700 dark:text-primary-300 italic leading-relaxed mt-4 tracking-wide">
                        {quote && (
                            <span className="block text-primary-700 dark:text-primary-300">
                {`${quote}`}
              </span>
                        )}
                    </h1>
                    <div className="mt-6">
                        <DynamicTabs />
                    </div>
                </div>
            ),
        },
        {
            id: "games",
            title: "Games",
            icon: SportsEsportsIcon,
            content: (
                <div>
                    <p className="text-primary-950 dark:text-dark-200">
                        Engage in fun and interactive games designed to improve motor skills,
                        coordination, and problem-solving abilities.
                    </p>
                    <div className="space-x-2 pt-3">
                        <Tag href="#">Puzzle</Tag>
                        <Tag href="#">Memory</Tag>
                    </div>
                </div>
            ),
        },
        {
            id: "story",
            title: "Story",
            icon: MenuBookIcon,
            content: (
                <div>
                    <p className="dark:text-dark-200 text-gray-700">
                        Enjoy captivating stories that stimulate imagination and language
                        development while teaching moral values.
                    </p>
                    <div className="space-x-2 pt-3">
                        <Tag href="#">Fairy Tales</Tag>
                        <Tag href="#">Adventure</Tag>
                    </div>
                </div>
            ),
        },
        {
            id: "assessment",
            title: "Assessment",
            icon: AssessmentIcon,
            content: (
                <div>
                    <p className="dark:text-dark-200 text-gray-700">
                        View student progress reports, skill evaluations, and assessment
                        insights to track learning outcomes.
                    </p>
                    <div className="space-x-2 pt-3">
                        <Tag href="#">Skill</Tag>
                        <Tag href="#">Progress</Tag>
                    </div>
                </div>
            ),
        },
    ];

    // ----------------------------------------------------------------------
    // Render
    // ----------------------------------------------------------------------
    return (
        <div className="w-full">
            <TabGroup defaultIndex={0}>
                {/* --- Tabs Header --- */}
                <div className="hide-scrollbar overflow-x-auto">
                    <TabList className="dark:border-dark-500 flex flex-wrap justify-center border-b border-gray-200 sm:justify-start">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.id}
                                as={Button}
                                unstyled
                                className={({ selected }) =>
                                    clsx(
                                        "relative shrink-0 space-x-2 rounded-t-lg border-b-2 px-4 py-2 font-medium whitespace-nowrap transition-all duration-300",
                                        selected
                                            ? "text-primary-600 border-primary-600 dark:bg-dark-700 dark:text-primary-400 bg-white shadow-sm"
                                            : "dark:text-dark-200 dark:hover:text-dark-100 border-transparent bg-transparent text-gray-600 hover:text-gray-800"
                                    )
                                }
                            >
                                <tab.icon className="!size-5" />
                                <span>{tab.title}</span>
                            </Tab>
                        ))}
                    </TabList>
                </div>

                {/* --- Tab Panels --- */}
                <TabPanels className="dark:bg-dark-700 mt-0 w-full rounded-b-lg bg-white p-4 shadow-sm">
                    {tabs.map((tab) => (
                        <TabPanel key={tab.id}>{tab.content}</TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
};
