import { Fragment } from "react";
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

export default function WeekSelector({
  selectedWeekId,
  setSelectedWeekId,
  weekDictionary = {},
}) {
  // -----------------------------
  // 🔹 Build options list
  // -----------------------------
  const options = [
    { value: -1, label: "Current Week" },
    { value: 0, label: "All Weeks" },
    ...Object.entries(weekDictionary).map(([id, label]) => ({
      value: Number(id),
      label,
    })),
  ];

  // -----------------------------
  // 🔹 Current selected label
  // -----------------------------
  const selectedLabel =
    options.find((o) => o.value === selectedWeekId)?.label || "Select Week";

  return (
    <div className="inline-block">
      <Menu as="div" className="relative inline-block text-start w-36"> {/* smaller width */}
        {/* 🔹 Dropdown Button */}
        <MenuButton
          as={Button}
          color="primary"
          size="sm" // use small size if your Button supports it
          className="w-full justify-between px-2 py-1 text-xs"
        >
          {({ open }) => (
            <>
              <span>{selectedLabel}</span>
              <ChevronDownIcon
                className={clsx("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
              />
            </>
          )}
        </MenuButton>

        {/* 🔹 Dropdown Menu */}
        <Transition
          as={Fragment}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <MenuItems className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white py-1 text-xs font-medium shadow-lg shadow-gray-200/50 outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none">
            {options.map((opt) => (
              <MenuItem key={opt.value}>
                {({ focus }) => (
                  <button
                    onClick={() => setSelectedWeekId(opt.value)}
                    className={clsx(
                      "flex h-7 w-full items-center px-2 outline-none transition-colors",
                      focus && "bg-primary-600 text-white"
                    )}
                  >
                    {opt.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
