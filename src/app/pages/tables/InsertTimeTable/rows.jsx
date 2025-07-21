// src/app/pages/tables/InsertPeriods/columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { TextCell } from "../InsertWeek/rows"; // reuse the same TextCell

const columnHelper = createColumnHelper();

/**
 * Dynamically generates columns for Periods table.
 * @param {Object} sampleRow - any row object from API
 * @returns {Array} Column definitions
 */
export const generatePeriodColumns = (sampleRow) => {
  if (!sampleRow) return [];

  return Object.keys(sampleRow).map((key) =>
    columnHelper.accessor((row) => row[key], {
      id: key,
      header: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      cell: (info) => <TextCell getValue={info.getValue} />,
    })
  );
};
