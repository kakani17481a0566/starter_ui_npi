import { Fragment } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Button } from "components/ui";

export default function WeekSelector({
  selectedWeekId,
  setSelectedWeekId,
  weekDictionary = {},
}) {
  // --------------------------------------------
  // 🧩 Build the options list for the dropdown
  // --------------------------------------------
  // Include static options for quick selection
  const options = [
    { value: -2, label: "Previous Week" },
    { value: -1, label: "Current Week" },
    // { value: 1, label: "Next Week" },
    { value: 0, label: "All Weeks" },
    // Dynamically add additional weeks from dictionary
    ...Object.entries(weekDictionary).map(([id, label]) => ({
      value: Number(id),
      label,
    })),
  ];

  // --------------------------------------------
  // 🏷️ Get currently selected week label
  // --------------------------------------------
  const selectedLabel =
    options.find((o) => o.value === selectedWeekId)?.label || "Select Week";

  return (
    <div className="inline-block">
      {/* ================================
          🔹 HeadlessUI Menu Container
         ================================ */}
      <Menu as="div" className="relative inline-block w-44 text-start">
        {/* --------------------------------
            🔘 Trigger Button for Dropdown
           -------------------------------- */}
        <MenuButton
          as={Button}
          color="primary"
          size="sm"
          className="w-full justify-between px-3 py-1.5 text-sm font-medium shadow-sm hover:shadow-md transition-all"
        >
          {({ open }) => (
            <>
              {/* Display the current selection */}
              <span>{selectedLabel}</span>

              {/* Chevron rotates on open */}
              <ChevronDownIcon
                className={clsx(
                  "h-4 w-4 ml-1 text-gray-600 transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </>
          )}
        </MenuButton>

        {/* --------------------------------
            📜 Dropdown Menu with Transition
           -------------------------------- */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {/* ================================
              📋 Dropdown List Container
             ================================ */}
          <MenuItems
            className={clsx(
              // Base styles
              "absolute z-50 mt-2 w-full overflow-y-auto rounded-md border border-gray-200 bg-white text-sm shadow-lg ring-1 ring-black/5 focus:outline-none",
              // Dark mode
              "dark:border-dark-500 dark:bg-dark-700",
              // Scrollable list (max height)
              "max-h-48 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-dark-500"
            )}
          >
            {/* Render each week option */}
            {options.map((opt) => {
              const isSelected = selectedWeekId === opt.value;

              return (
                <MenuItem key={opt.value}>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedWeekId(opt.value)}
                      className={clsx(
                        "flex w-full items-center justify-between px-3 py-2 text-left transition-colors",
                        active
                          ? "bg-primary-600 text-white"
                          : "text-gray-700 dark:text-gray-100",
                        isSelected && "font-semibold"
                      )}
                    >
                      {/* Option label */}
                      <span>{opt.label}</span>

                      {/* ✅ Check icon for selected item */}
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  )}
                </MenuItem>
              );
            })}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
