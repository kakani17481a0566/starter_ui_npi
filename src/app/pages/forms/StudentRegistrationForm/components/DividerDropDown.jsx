// Import Dependencies
import { Fragment, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function DividerDropDown() {
  const [selected, setSelected] = useState("");

  const options = [
    "Ciao-Baby",
    "Pre-Nursery",
    "Nursery",
    "Kindergarten-1",
    "Kindergarten-2",
  ];

  return (
    <div className="max-w-xl flex items-center gap-3">
      <Menu as="div" className="relative inline-block text-start">
        <MenuButton as={Button} className="space-x-2 rounded-full">
          {({ open }) => (
            <>
              <span>Course</span>
              <ChevronDownIcon
                className={clsx(
                  "size-4 transition-transform",
                  open && "rotate-180",
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
          <MenuItems className="absolute z-[100] mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none">
            {options.map((option) => (
              <MenuItem key={option}>
                {({ focus }) => (
                  <button
                    onClick={() => setSelected(option)}
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>{option}</span>
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>

      {/* Display selected option */}
      {selected && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {selected}
        </span>
      )}
    </div>
  );
}
