// src/app/pages/dashboards/Exam/DividerWithText.jsx
import clsx from "clsx";
import { Box } from "components/ui";

// 🔹 Reusable Divider
export const DividerWithText = ({ text = "OR", className = "" }) => {
  return (
    <div className={clsx("my-4 flex items-center space-x-3", className)}>
      <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {text}
      </span>
      <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
    </div>
  );
};

// 🔹 Example layout using Divider
export const Vertical = () => {
  return (
    <>
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content A</p>
      </Box>

      <DividerWithText text="OR" /> {/* ✅ Uses the reusable divider */}

      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content B</p>
      </Box>
    </>
  );
};
