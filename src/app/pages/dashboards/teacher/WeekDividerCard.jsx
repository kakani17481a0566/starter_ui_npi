import { Box } from "components/ui";
import { SelectCourseDropDown } from "./SelectCourseDropDown";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const WeekDividerCard = ({ onCourseChange }) => {
  return (
    <>
      <Box className="flex h-20 w-full items-center justify-between rounded-lg bg-gray-200 px-4 dark:bg-dark-500 sm:px-6">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5 text-primary-600" />
          <p className="text-base font-medium text-primary-950 dark:text-dark-100">
            Select Course
          </p>
        </div>

        <SelectCourseDropDown onSelect={(course) => onCourseChange?.(course.id)} />
      </Box>

      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
    </>
  );
};

export { WeekDividerCard };
