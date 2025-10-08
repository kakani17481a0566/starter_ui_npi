// Import Dependencies
import { createElement } from "react";
import { createColumnHelper } from "@tanstack/react-table";

// Heroicons
import {
  BookOpenIcon,
  TagIcon,
  ArrowsPointingOutIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Local Imports
// import { RowActions } from "./RowActions";
import { CourseNameCell, PriceCell, StatusCell } from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(BookOpenIcon, {
          className: "w-4 h-4 text-primary-500",
        }),
        createElement("span", null, "Item")
      ),
    label: "Item",
    cell: CourseNameCell,
  }),
  columnHelper.accessor((row) => row.categoryName, {
    id: "category",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(TagIcon, {
          className: "w-4 h-4 text-primary-500",
        }),
        createElement("span", null, "Category")
      ),
    label: "Category",
  }),
  columnHelper.accessor((row) => row.size, {
    id: "size",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(ArrowsPointingOutIcon, {
          className: "w-4 h-4 text-primary-500",
        }),
        createElement("span", null, "Size")
      ),
    label: "Size",
    filter: "searchableSelect",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor((row) => row.price, {
    id: "price",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(CurrencyRupeeIcon, {
          className: "w-4 h-4 text-primary-500",
        }),
        createElement("span", null, "Price")
      ),
    label: "Price",
    cell: PriceCell,
    filterFn: "inNumberRange",
    filter: "numberRange",
  }),
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(CheckCircleIcon, {
          className: "w-4 h-4 text-primary-500",
        }),
        createElement("span", null, "Status")
      ),
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
