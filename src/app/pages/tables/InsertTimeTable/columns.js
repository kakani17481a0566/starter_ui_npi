//src\app\pages\tables\InsertTimeTable\columns.js
import { createColumnHelper } from "@tanstack/react-table";
import {
  CalendarDaysIcon,
  BookOpenIcon,
  BadgeIcon,
  TagIcon,
  LayoutDashboardIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";

const columnHelper = createColumnHelper();

// ✅ Allowed fields from TimeTable API
const allowedHeaders = [
  "id",                    // TimeTable ID
  "name",                  // Title
  "date",                  // Scheduled Date
  "weekName",  
  "status",            // Week Name
  "courseName",            // Course
  "assessmentStatusName",  // Assessment Status
  "tenantName",            // Tenant
];

// ✅ Field to icon mapping
const iconMap = {
  id: TagIcon,
  name: BadgeIcon,
  date: CalendarDaysIcon,
  weekName: CalendarDaysIcon,
  courseName: BookOpenIcon,
  assessmentStatusName: CheckCircleIcon,
  tenantName: LayoutDashboardIcon,
};

/**
 * Dynamically generate TimeTable columns for TanStack Table
 * @param {Object} sampleRow - sample data row from API
 * @returns {Array} column definitions
 */
export const generateTimeTableColumns = (sampleRow) => {
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
            Icon ? React.createElement(Icon, { className: "size-4 text-primary-600" }) : null,
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
