import { Fragment, useState, useEffect } from "react";
import {
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Button } from "components/ui";
import { getSessionData } from "utils/sessionStorage"; // ✅ make sure path matches your project

export function SelectCourseDropDown({ onSelect }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const { course } = getSessionData(); // ⚠️ field is called `course`, but it's an array
    setCourses(Array.isArray(course) ? course : []);
    if (Array.isArray(course) && course.length > 0) {
      setSelectedCourse(course[0]);
      onSelect?.(course[0]);
    }
  }, []);

  const handleSelect = (course) => {
    setSelectedCourse(course);
    onSelect?.(course); // optional callback
  };

  return (
    <div className="max-w-sm">
      <Menu as="div" className="relative inline-block text-start">
        {({ open }) => (
          <>
            <MenuButton as={Button} className="space-x-2">
              <span>{selectedCourse?.name || "Select Course"}</span>
              <ChevronDownIcon
                className={clsx(
                  "size-4 transition-transform",
                  open && "rotate-180"
                )}
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
              <MenuItems className="absolute z-50 mt-1.5 min-w-[12rem] rounded-lg border border-gray-300 bg-white py-1 text-sm font-medium shadow-lg outline-none dark:border-dark-500 dark:bg-dark-700">
                {courses.map((course) => (
                  <MenuItem key={course.id}>
                    {({ active }) => (
                      <button
                        onClick={() => handleSelect(course)}
                        className={clsx(
                          "flex w-full items-center justify-between px-4 py-2 transition-colors",
                          active
                            ? "bg-gray-100 text-gray-900 dark:bg-dark-600 dark:text-white"
                            : "text-gray-700 dark:text-dark-100"
                        )}
                      >
                        <span>{course.name}</span>
                        {selectedCourse?.id === course.id && (
                          <CheckIcon className="w-4 h-4 text-green-500" />
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
