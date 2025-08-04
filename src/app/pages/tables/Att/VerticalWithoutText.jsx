import PropTypes from "prop-types";
import { Box } from "components/ui";
import {
  CalendarDaysIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useEffect, useMemo, useState } from "react";
import { getSessionData } from "utils/sessionStorage";

const AttendanceHeaderBox = ({
  date,
  checkedIn,
  checkedOut,
  selectedCourseId,
  onCourseChange,
}) => {
  const session = useMemo(() => getSessionData(), []);
  const courseList = session?.course ?? [];

  const [localSelectedCourse, setLocalSelectedCourse] = useState(() => {
    return (
      courseList.find((c) => c.id === selectedCourseId) ??
      courseList[0] ??
      null
    );
  });

  useEffect(() => {
    if (localSelectedCourse && onCourseChange) {
      onCourseChange(localSelectedCourse.id);
    }
  }, [localSelectedCourse]);

  return (
    <Box className="flex flex-col sm:flex-row w-full justify-between gap-4 p-4 sm:h-20 rounded-lg bg-gray-200 dark:bg-dark-100">
      {/* Date */}
      <div className="flex items-center gap-2 text-sm font-medium text-primary-950">
        <CalendarDaysIcon className="size-5 shrink-0 text-primary-600" />
        <span>{date}</span>
      </div>

      {/* Course Dropdown */}
      <div className="flex items-center gap-2 text-sm text-primary-950 w-full sm:w-auto">
        <AcademicCapIcon className="h-5 w-5 shrink-0 text-primary-600" />
        <Listbox value={localSelectedCourse} onChange={setLocalSelectedCourse}>
          <div className="relative w-full sm:w-48">
            <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white px-2 py-1 pr-8 text-left text-sm font-medium text-primary-950 dark:bg-dark-200 dark:text-white">
              <span className="block truncate">{localSelectedCourse?.name ?? "Select Course"}</span>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-200 dark:text-white">
              {courseList.map((course) => (
                <Listbox.Option
                  key={course.id}
                  value={course}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-4 py-2 ${
                      active ? "bg-primary-100 text-primary-900 dark:bg-dark-300" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                        {course.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-2 flex items-center text-primary-600">
                          <CheckIcon className="h-4 w-4" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Attendance Counts */}
      <div className="flex flex-col items-end text-sm text-primary-950 space-y-1 sm:text-right">
        <div className="flex items-center gap-1">
          <ArrowDownCircleIcon className="size-4 text-green-600" />
          <span>Checked-In: {checkedIn}</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowUpCircleIcon className="size-4 text-red-500" />
          <span>Checked-Out: {checkedOut}</span>
        </div>
      </div>
    </Box>
  );
};

AttendanceHeaderBox.propTypes = {
  date: PropTypes.string,
  checkedIn: PropTypes.number,
  checkedOut: PropTypes.number,
  selectedCourseId: PropTypes.number,
  onCourseChange: PropTypes.func,
};

export { AttendanceHeaderBox };
