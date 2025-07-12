// src/app/pages/dashboards/teacher/WeekTimeTable/columns.js

// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import React from "react";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

// ----- Cell Renderers -----

export function DayCell(cell) {
  const day = cell.getValue?.();
  return React.createElement(
    "span",
    {
      className: "font-semibold text-sm text-gray-800 dark:text-dark-100",
    },
    day,
  );
}

export function FileCell(cell) {
  const value = cell.getValue?.() ?? "";
  const trimmed = value.trim();

  let textClass = "";

  if (trimmed.startsWith("AS:") || trimmed.startsWith("Action Song")) {
    textClass = "text-[#713427] font-bold";
  } else if (trimmed.startsWith("FT:") || trimmed.startsWith("Fairytale")) {
    textClass = "text-[#E27257] font-bold";
  } else if (trimmed.startsWith("NR:") || trimmed.startsWith("Nursery Rhyme")) {
    textClass = "text-[#B14434] font-bold";
  } else if (trimmed.startsWith("ET:") || trimmed.startsWith("Event")) {
    textClass = "text-[#52AA97] font-bold";
  } else if (trimmed.startsWith("PL:") || trimmed.startsWith("PHONICS LAB")) {
    textClass = "text-[#83CAE6] font-bold";
  } else if (trimmed.startsWith("SL:") || trimmed.startsWith("SCIENCE LAB")) {
    textClass = "text-[#8FD1E6] font-bold";
  } else if (trimmed.startsWith("AL:") || trimmed.startsWith("ART LAB")) {
    textClass = "text-[#437EB4] font-bold";
  } else if (trimmed.startsWith("ML:") || trimmed.startsWith("MATH LAB")) {
    textClass = "text-[#2F469A] font-bold";
  } else if (trimmed.startsWith("ST:") || trimmed.startsWith("Story Time")) {
    textClass = "text-[#465C8A] font-bold";
  } else if (trimmed.startsWith("LAB:") || trimmed.startsWith("LAB")) {
    textClass = "text-[#3366] font-bold";
  }

  return React.createElement(
    "span",
    {
      className: clsx("text-sm", textClass),
    },
    trimmed || "-",
  );
}

export function ActionsCell(cell) {
  return React.createElement(RowActions, {
    row: cell.row,
    table: cell.table,
  });
}

// ----- Columns -----

export const columns = [
  columnHelper.display({
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
  }),

  columnHelper.accessor((row) => row.column1, {
    id: "days",
    header: "Days",
    cell: DayCell,
  }),

  columnHelper.accessor((row) => row.column2, {
    id: "psed",
    header: "PSED",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column3, {
    id: "cll",
    header: "CLL",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column4, {
    id: "psrn",
    header: "PSRN",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column5, {
    id: "kuw",
    header: "KUW",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column6, {
    id: "pd",
    header: "PD",
    cell: FileCell,
  }),

  columnHelper.accessor((row) => row.column7, {
    id: "ead",
    header: "EAD",
    cell: FileCell,
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ActionsCell,
  }),
];
