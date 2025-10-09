// src/app/pages/dashboards/teacher/WeekTimeTable/columns.js

import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { RowActions } from "./RowActions";
import React from "react";

const columnHelper = createColumnHelper();

// ----------------------------------------------------------------------
// Render cell for "Days" column (column1)
export function DayCell(cell) {
  const day = cell.getValue?.();
  return React.createElement(
    "span",
    { className: "font-semibold text-sm text-primary-950 uppercase" },
    day || "-"
  );
}

// {
//   className: "font-lato font-semibold text-sm text-primary-950 uppercase"
// }

// ----------------------------------------------------------------------
// Render content cells (columns 2+)
export function FileCell(cell) {
  const value = cell.getValue?.() ?? "";
  const lines = value.trim().split("\n");

  return React.createElement(
  "div",
  { className: "font-lato font-normal text-xs  whitespace-pre-line uppercase" },
  lines.map((line, i) =>
    React.createElement(
      "div",
      { key: i, className: "text-primary-950" },
      line.trim() || "-"
    )
  )
);

}

// ----------------------------------------------------------------------
// Render row actions
export function ActionsCell(cell) {
  return React.createElement(RowActions, {
    row: cell.row,
    table: cell.table,
  });
}

// ----------------------------------------------------------------------
// Generate columns from dynamic headers
export function generateColumns(headers = []) {


  const baseColumns = headers.map((header, index) => {
    const columnId = `column${index + 1}`;
    const isDayColumn = index === 0;

    console.log(`➡️ Header ${index}:`, header);

    // detect subject key
    let subjectKey = null;
    if (header.includes("Language")) subjectKey = "CLL";
    else if (header.includes("Numeracy")) subjectKey = "PSRN";
    else if (header.includes("Knowledge")) subjectKey = "KUW";
    else if (header.includes("Physical")) subjectKey = "PD";
    else if (header.includes("Arts")) subjectKey = "EAD";
    else if (header.includes("Social")) subjectKey = "PSED";

    return columnHelper.accessor((row) => row[columnId], {
      id: isDayColumn ? "days" : `col${index}`,
      header: () =>
        React.createElement(
          "div",
          {
            className: clsx(
              "whitespace-pre-line uppercase text-primary-950",
              isDayColumn ? "" : "text-xs",
            ),
          },
          header
        ),
      cell: isDayColumn ? DayCell : FileCell,
      meta: { subjectKey }, // ✅ store subjectKey for coloring
    });
  });

  baseColumns.push(
    columnHelper.display({
      id: "actions",
      header: () =>
        React.createElement(
          "div",
          { className: "uppercase text-white text-xs font-semibold" },
          "Actions"
        ),
      cell: ActionsCell,
    })
  );

  return baseColumns;
}
