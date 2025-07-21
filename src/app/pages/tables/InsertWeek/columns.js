// src/app/pages/tables/InsertWeek/columns.js

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

/**
 * Generates column definitions dynamically from a sample row.
 * @param {object} sampleRow - An example object (e.g. week row)
 * @returns {Array} column definitions for TanStack Table
 */
export const generateWeekColumns = (sampleRow) => {
  if (!sampleRow) return [];

  return Object.keys(sampleRow).map((key) =>
    columnHelper.accessor((row) => row[key], {
      id: key,
      header: key
        .replace(/([A-Z])/g, " $1")         // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()), // Capitalize first letter
      cell: (info) => info.getValue(),
    })
  );
};
