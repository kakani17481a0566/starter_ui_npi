// src/app/pages/tables/InsertTimeTableDetails/columns.js
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

/**
 * Generates columns for TanStack Table based on dynamic tableHeaders.
 */
export const generateTimeTableDetailColumns = (tableHeaders = []) => {
  if (!Array.isArray(tableHeaders) || tableHeaders.length === 0) return [];
  return tableHeaders.map((header) =>
    columnHelper.accessor(
      (row) => {
        const value = row[header.key];
        if (
          header.type === "object" &&
          header.displayField &&
          value &&
          typeof value === "object"
        ) {
          return value[header.displayField] ?? value.id ?? "";
        }
        return value ?? "";
      },
      {
        id: header.key,
        header: header.label,
        cell: (info) => info.getValue(),
      }
    )
  );
};
