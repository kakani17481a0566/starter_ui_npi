import { createColumnHelper } from "@tanstack/react-table";
import {
  TagIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  Table2Icon,
} from "lucide-react";
import React from "react";
import { parseISO, format } from "date-fns"; // for date formatting

const allowedHeaders = [
  "topicName",
  "subjectName",
  "courseName",
  "periodName",
  "timeTableName",
  "timeTableDate",
];

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

export const generateTimeTableTopicsColumns = (headers = {}, sampleRow = {}) => {
  const keys = allowedHeaders.filter((key) => key in headers && key in sampleRow);

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
      cell: (info) => {
        const raw = info.getValue();

        if (key === "timeTableDate" && raw) {
          try {
            const parsed = parseISO(raw);
            const formatted = format(parsed, "dd MMM yyyy (EEE)");
            return React.createElement(
              "span",
              { className: "text-sm text-primary-950" },
              formatted
            );
          } catch {
            return React.createElement(
              "span",
              { className: "text-sm text-red-500" },
              "Invalid Date"
            );
          }
        }

        return React.createElement(
          "span",
          { className: "text-sm text-primary-950" },
          raw ?? "--"
        );
      },
    });
  });
};
