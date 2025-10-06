// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
// import { RowActions } from "./RowActions";
import {
  CourseNameCell,
  PriceCell,
  StatusCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: "Course",
    label: "Course",
    cell: CourseNameCell,
  }),
  columnHelper.accessor((row) => row.categoryName, {
    id: "category",
    header: "Category",
    label: "Category",
  }),
  columnHelper.accessor((row) => row.size, {
    id: "size",
    header: "Size",
    label: "Size",
    filter: "searchableSelect",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor((row) => row.price, {
    id: "price",
    header: "Price",
    label: "Price",
    cell: PriceCell,
    filterFn: "inNumberRange",
    filter: "numberRange",
  }),
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Status",
    label: "Status",
    cell: StatusCell,
    filter: "searchableSelect",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor((row) => row.lesson_count ?? 0, {
    id: "lesson_count",
    isHiddenColumn: true,
    filterFn: "inNumberRange",
    filter: "numberRange",
  }),
];
