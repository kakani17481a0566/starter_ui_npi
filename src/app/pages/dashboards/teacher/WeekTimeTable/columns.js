// src/app/pages/dashboards/teacher/WeekTimeTable/columns.js

import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { RowActions } from "./RowActions";
import React from "react";

const columnHelper = createColumnHelper();

// Render cell for "Days" column (column1)
export function DayCell(cell) {
  const day = cell.getValue?.();
  return React.createElement(
    "span",
    { className: "font-semibold text-sm text-gray-800 dark:text-dark-100" },
    day
  );
}

// Render content cells (column2+)
export function FileCell(cell) {
  const value = cell.getValue?.() ?? "";
  const lines = value.trim().split("\n");

  const getClassForLine = (line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("AS:") || trimmed.startsWith("Action Song")) return "text-[#713427] font-bold";
    if (trimmed.startsWith("FT:") || trimmed.startsWith("Fairytale")) return "text-[#E27257] font-bold";
    if (trimmed.startsWith("NR:") || trimmed.startsWith("Nursery Rhyme")) return "text-[#B14434] font-bold";
    if (trimmed.startsWith("ET:") || trimmed.startsWith("Event")) return "text-[#52AA97] font-bold";
    if (trimmed.startsWith("PL:") || trimmed.startsWith("PHONICS LAB")) return "text-[#83CAE6] font-bold";
    if (trimmed.startsWith("SL:") || trimmed.startsWith("SCIENCE LAB")) return "text-[#8FD1E6] font-bold";
    if (trimmed.startsWith("AL:") || trimmed.startsWith("ART LAB")) return "text-[#437EB4] font-bold";
    if (trimmed.startsWith("ML:") || trimmed.startsWith("MATH LAB")) return "text-[#2F469A] font-bold";
    if (trimmed.startsWith("ST:") || trimmed.startsWith("Story Time")) return "text-[#465C8A] font-bold";
    if (trimmed.startsWith("LAB:") || trimmed.startsWith("LAB")) return "text-[#3366] font-bold";
    return "";
  };

  return React.createElement(
    "div",
    { className: "text-sm whitespace-pre-line" },
    lines.map((line, i) =>
      React.createElement(
        "div",
        { key: i, className: clsx(getClassForLine(line)) },
        line.trim() || "-"
      )
    )
  );
}

// Render row actions
export function ActionsCell(cell) {
  return React.createElement(RowActions, {
    row: cell.row,
    table: cell.table,
  });
}

// Generate columns from dynamic headers
export function generateColumns(headers = []) {
  const baseColumns = headers.map((header, index) => {
    const columnId = `column${index + 1}`;
    const isDayColumn = index === 0;

    return columnHelper.accessor((row) => row[columnId], {
      id: isDayColumn ? "days" : `col${index}`,
      header: () =>
        React.createElement(
          "div",
          {
            className: clsx(
              "whitespace-pre-line",
              isDayColumn ? "font-bold" : "text-xs font-semibold"
            ),
          },
          header
        ),
      cell: isDayColumn ? DayCell : FileCell,
    });
  });

  baseColumns.push(
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ActionsCell,
    })
  );

  return baseColumns;
}
