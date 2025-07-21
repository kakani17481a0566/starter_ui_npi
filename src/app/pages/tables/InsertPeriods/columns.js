// src/app/pages/tables/InsertPeriods/columns.js
import { createColumnHelper } from "@tanstack/react-table";
import {
  ClockIcon,
  BookOpenIcon,
  BadgeIcon,
  LayoutDashboardIcon,
  TagIcon,
} from "lucide-react";
import React from "react"; // Needed for createElement in .js

const columnHelper = createColumnHelper();

// ✅ Fields allowed in the table
const allowedHeaders = ["id", "name", "courseName", "startTime", "endTime", "tenantName"];

// ✅ Map each field to an icon
const iconMap = {
  id: TagIcon,
  name: BadgeIcon,
  courseName: BookOpenIcon,
  startTime: ClockIcon,
  endTime: ClockIcon,
  tenantName: LayoutDashboardIcon,
};

/**
 * Generate table columns with icons and Tailwind classes (compatible with .js file)
 */
export const generatePeriodColumns = (sampleRow) => {
  if (!sampleRow) return [];

  return allowedHeaders
    .filter((key) => key in sampleRow)
    .map((key) => {
      const Icon = iconMap[key];

      return columnHelper.accessor((row) => row[key], {
        id: key,
        header: () =>
          React.createElement(
            "div",
            { className: "flex items-center gap-1 text-primary-950" },
            Icon && React.createElement(Icon, { className: "size-4 text-primary-600" }),
            React.createElement(
              "span",
              null,
              key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            )
          ),
        cell: (info) =>
          React.createElement(
            "span",
            { className: "text-sm text-primary-950" },
            info.getValue()
          ),
      });
    });
};
