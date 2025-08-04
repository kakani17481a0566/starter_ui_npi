// src/app/pages/tables/InsertWeek/columns.js

import { createColumnHelper } from "@tanstack/react-table";
import { format, parseISO } from "date-fns"; // Optional: For better date display

const columnHelper = createColumnHelper();

/**
 * Generates column definitions dynamically from a sample row.
 * @param {object} sampleRow - An example object (e.g., week row)
 * @returns {Array} column definitions for TanStack Table
 */
export const generateWeekColumns = (sampleRow) => {
  if (!sampleRow) return [];

  return Object.keys(sampleRow).map((key) =>
    columnHelper.accessor((row) => row[key], {
      id: key,
      header: key
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()), // Capitalize first letter

      cell: (info) => {
        const value = info.getValue();

        // ✅ Format dates
        if (key.toLowerCase().includes("date") && value) {
          try {
            return format(parseISO(value), "dd MMM yyyy");
          } catch {
            return value;
          }
        }

        // ✅ Format tenantId or id fields if needed
        if (typeof value === "number") return value;

        return value ?? "-";
      },
    })
  );
};
