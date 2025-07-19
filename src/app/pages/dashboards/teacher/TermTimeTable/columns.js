// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

// ----- Cell Renderers -----

export function DayCell(cell) {
  const day = cell.getValue?.() ?? "";
  return React.createElement(
    "span",
    {
      className: "whitespace-pre-line font-semibold text-sm text-primary-950 dark:text-dark-100  dark:text-dark-100",
    },
    day
  );
}

export function FileCell(cell) {
  const value = cell.getValue?.() ?? "";
  const trimmed = value.trim();

  // Split by comma, trim each part, and render each on a new line
  const parts = trimmed.split(",").map((part) => part.trim());

  return React.createElement(
    "div",
    { className: "space-y-1" },
    parts.map((line, index) => {
      let textClass = "text-primary-950 dark:text-dark-100 "; // default fallback

      if (line.startsWith("AS:") || line.startsWith("Action Song")) {
        textClass = "text-[#713427] font-bold";
      } else if (line.startsWith("FT:") || line.startsWith("Fairytale")) {
        textClass = "text-[#E27257] font-bold";
      } else if (line.startsWith("NR:") || line.startsWith("Nursery Rhyme")) {
        textClass = "text-[#B14434] font-bold";
      } else if (line.startsWith("ET:") || line.startsWith("Event")) {
        textClass = "text-[#52AA97] font-bold";
      }

      return React.createElement(
        "div",
        { key: index, className: clsx("text-sm", textClass) },
        line || "-"
      );
    })
  );
}



// ----- Columns -----

export const columns = [
  columnHelper.accessor((row) => row.column1, {
    id: "week",
    header: "Week",
    cell: DayCell,
  }),

  columnHelper.accessor((row) => row.column2, {
    id: "summary",
    header: "Fairytale / Action Song / Nursery Rhyme / Event",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column3, {
    id: "monday",
    header: "Monday",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column4, {
    id: "tuesday",
    header: "Tuesday",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column5, {
    id: "wednesday",
    header: "Wednesday",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column6, {
    id: "thursday",
    header: "Thursday",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column7, {
    id: "friday",
    header: "Friday",
    cell: FileCell,
  }),
];
