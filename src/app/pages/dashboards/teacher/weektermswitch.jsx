import { useState, Fragment } from "react";
import { Page } from "components/shared/Page";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Button } from "components/ui";

// Timetable modules
import { WeekTimeTable } from "./WeekTimeTable";
import { TermTimeTable } from "./TermTimeTable";

export default function WeekTermSwitch() {
  const [activeTab, setActiveTab] = useState("week");

  return (
    <Page title="Timetable View">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {activeTab === "week" ? "Weekly Timetable" : "Term Timetable"}
          </h2>

          <Menu as="div" className="relative inline-block text-left">
            <MenuButton as={Button} color="primary" className="space-x-2">
              {({ open }) => (
                <>
                  <span>Switch View</span>
                  <ChevronDownIcon
                    className={clsx(
                      "size-4 transition-transform",
                      open && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <MenuItems className="absolute z-[100] mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-700 dark:shadow-none">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setActiveTab("week")}
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus && "bg-primary-600 text-white"
                      )}
                    >
                      <span>Weekly View</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setActiveTab("term")}
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus && "bg-primary-600 text-white"
                      )}
                    >
                      <span>Term View</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>

        {/* Conditional rendering */}
        {activeTab === "week" ? <WeekTimeTable /> : <TermTimeTable />}
      </div>
    </Page>
  );
}
