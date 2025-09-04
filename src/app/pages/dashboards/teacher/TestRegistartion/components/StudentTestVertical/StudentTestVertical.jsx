// src/app/pages/teacher/StudentTestVertical.jsx

import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { Box } from "components/ui";

const StudentTestVertical = () => {
  return (
    <>
      {/* Header Box */}
      <Box className="flex w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-500 p-4">
        <div className="flex items-center gap-3">
          <ClipboardDocumentIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Test</h1>
        </div>
      </Box>

      {/* Divider */}
      <div className="my-4 flex items-center space-x-3">
        <div className="h-px flex-1 bg-gray-300 dark:bg-dark-500"></div>
        <div className="h-px flex-1 bg-gray-300 dark:bg-dark-500"></div>
      </div>
    </>
  );
};

export { StudentTestVertical };
