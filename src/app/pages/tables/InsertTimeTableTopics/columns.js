import { createColumnHelper } from "@tanstack/react-table";
import {
  TagIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  Table2Icon,
} from "lucide-react";
import React from "react";

// ✅ 1. Define allowed keys you want as table columns (edit as needed)
const allowedHeaders = [
  // "id",
  // "topicId",
  "topicName",
  "subjectName",
  "courseName",
  // "periodId",
  "periodName",
  "timeTableName",
  "timeTableDate",
];

// ✅ 2. Your icon map for fancy headers (add more if you like)
const iconMap = {
  id: TagIcon,
  topicId: TagIcon,
  timeTableDetailId: TagIcon,
  topicName: BookOpenIcon,
  subjectName: BookOpenIcon,
  courseName: BookOpenIcon,
  periodId: ClockIcon,
  periodName: ClockIcon,
  timeTableName: Table2Icon,
  timeTableDate: CalendarIcon,
};

const columnHelper = createColumnHelper();

/**
 * Dynamically generate columns for Time Table Topics based on headers and a sample row.
 * Only includes keys present in the allowedHeaders list.
 * @param {Object} headers - headers object from API, ex: { key: "Display Name", ... }
 * @param {Object} sampleRow - a sample data row (to check existence)
 * @returns {Array} column definitions
 */
export const generateTimeTableTopicsColumns = (headers = {}, sampleRow = {}) => {
  // Only show columns present in allowedHeaders, in this order
  const keys = allowedHeaders.filter(
    (key) => key in headers && key in sampleRow
  );

  return keys.map((key) => {
    const Icon = iconMap[key];
    return columnHelper.accessor((row) => row[key], {
      id: key,
      header: () =>
        React.createElement(
          "div",
          { className: "flex items-center gap-1 text-primary-950" },
          Icon ? React.createElement(Icon, { className: "size-4 text-primary-600" }) : null,
          React.createElement("span", null, headers[key] || key)
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
