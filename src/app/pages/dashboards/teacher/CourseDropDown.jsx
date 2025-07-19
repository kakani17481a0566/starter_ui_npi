import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

import { Button } from "components/ui";
import { getSessionData } from "utils/sessionStorage";

export function CourseDropDown({ onSelect }) {
  const { course: courses } = getSessionData();
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Select from localStorage or default to lowest ID
  useEffect(() => {
    if (courses?.length > 0) {
      const storedId = Number(localStorage.getItem("selectedCourseId"));
      const initial =
        courses.find((c) => c.id === storedId) ||
        courses.reduce((min, c) => (c.id < min.id ? c : min), courses[0]);

      setSelectedCourse(initial);
    }
  }, [courses]);

  // Trigger onSelect and store selection
  useEffect(() => {
    if (selectedCourse) {
      onSelect?.(selectedCourse);
      localStorage.setItem("selectedCourseId", selectedCourse.id);
    }
  }, [selectedCourse]);

  if (!courses?.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-dark-200">
        No courses available
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Menu as="div" className="relative inline-block text-start">
        {({ open }) => (
          <>
            <MenuButton as={Button} className="space-x-2 flex items-center">
              <span>{selectedCourse?.name || "Select Course"}</span>
              <ChevronDownIcon
                className={clsx("size-4 transition-transform", open && "rotate-180")}
              />
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
                {courses.map((c) => (
                  <MenuItem key={c.id} as={Fragment}>
                    {({ focus }) => (
                      <button
                        onClick={() => setSelectedCourse(c)}
                        className={clsx(
                          "flex h-9 w-full items-center justify-between px-3 tracking-wide outline-none transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                        )}
                      >
                        <span>{c.name}</span>
                        {selectedCourse?.id === c.id && (
                          <CheckIcon className="size-4 text-primary-600" />
                        )}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
