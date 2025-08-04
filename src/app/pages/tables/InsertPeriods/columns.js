// src/app/pages/tables/InsertPeriods/columns.js
import { createColumnHelper } from "@tanstack/react-table";
import {
  ClockIcon,
  BookOpenIcon,
  BadgeIcon,
  LayoutDashboardIcon,
  TagIcon,
} from "lucide-react";
import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat); // ⬅️ Required to parse "HH:mm" manually

const columnHelper = createColumnHelper();

const allowedHeaders = [
  "id",
  "name",
  "courseName",
  "startTime",
  "endTime",
  "tenantName",
];

const iconMap = {
  id: TagIcon,
  name: BadgeIcon,
  courseName: BookOpenIcon,
  startTime: ClockIcon,
  endTime: ClockIcon,
  tenantName: LayoutDashboardIcon,
};

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
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
            )
          ),
        cell: (info) => {
          const value = info.getValue();
          const isTimeField = key.toLowerCase().includes("time");

          return React.createElement(
            "span",
            { className: "text-sm text-primary-950" },
            isTimeField && value
              ? dayjs(value, "HH:mm").isValid()
                ? dayjs(value, "HH:mm").format("h:mm A")
                : value
              : value
          );
        },
      });
    });
};
