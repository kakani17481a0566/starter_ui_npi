import { Box } from "components/ui";
import { CourseDropDown } from "./CourseDropDown";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

const VerticalDividerCard = ({ onCourseSelect }) => {
  return (
    <>
      <Box className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-100 px-4 py-4 shadow-sm dark:bg-dark-600 sm:flex-nowrap sm:gap-6">
        {/* Left: Icon and Label */}
        <div className="flex items-center gap-2 text-base font-semibold text-primary-950 dark:text-white">
          <AcademicCapIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
          <span>Select Course</span>
        </div>

        {/* Right: Course Dropdown */}
        <div className="w-full sm:w-auto">
          <CourseDropDown onSelect={onCourseSelect} />
        </div>
      </Box>

      {/* Divider Line */}
      <div className="my-4 h-px bg-gray-300 dark:bg-dark-500" />
    </>
  );
};

export { VerticalDividerCard };
