// ----------------------------------------------------------------------
// 📦 Import Dependencies
// ----------------------------------------------------------------------
import { createElement } from "react";
import { createColumnHelper } from "@tanstack/react-table";

// Heroicons
import {
  BookOpenIcon,
  TagIcon,
  ArrowsPointingOutIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { ItemNameCell, PriceCell, StatusCell } from "./rows";

// ----------------------------------------------------------------------
// 🧮 Column Helper
// ----------------------------------------------------------------------
const columnHelper = createColumnHelper();

// ----------------------------------------------------------------------
// 🧱 Columns Definition
// ----------------------------------------------------------------------
export const columns = [
  // --------------------------------------------------------------------
  // 🏷️ Item Name (default sorted column)
  // --------------------------------------------------------------------
  columnHelper.accessor("name", {
    id: "name",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(BookOpenIcon, { className: "w-4 h-4 text-primary-500" }),
        createElement("span", null, "Item")
      ),
    label: "Item",
    cell: ItemNameCell,
    enableSorting: true,
    sortingFn: (a, b) =>
      (a.getValue("name") ?? "").localeCompare(b.getValue("name") ?? "", undefined, {
        sensitivity: "base",
      }),
  }),

  // --------------------------------------------------------------------
  // 📚 Category
  // --------------------------------------------------------------------
  columnHelper.accessor("categoryName", {
    id: "category",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(TagIcon, { className: "w-4 h-4 text-primary-500" }),
        createElement("span", null, "Category")
      ),
    label: "Category",
    filter: "searchableSelect",
    filterFn: "arrIncludesSome",
    enableSorting: true,
    sortingFn: (a, b) =>
      (a.getValue("categoryName") ?? "").localeCompare(
        b.getValue("categoryName") ?? "",
        undefined,
        { sensitivity: "base" }
      ),
  }),

  // --------------------------------------------------------------------
  // 📏 Size
  // --------------------------------------------------------------------
  columnHelper.accessor("size", {
    id: "size",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(ArrowsPointingOutIcon, { className: "w-4 h-4 text-primary-500" }),
        createElement("span", null, "Size")
      ),
    label: "Size",
    filter: "searchableSelect",
    filterFn: "arrIncludesSome",
    enableSorting: true,
    sortingFn: (a, b) =>
      (a.getValue("size") ?? "").localeCompare(b.getValue("size") ?? "", undefined, {
        sensitivity: "base",
      }),
  }),

  // --------------------------------------------------------------------
  // 💰 Price
  // --------------------------------------------------------------------
  columnHelper.accessor("price", {
    id: "price",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(CurrencyRupeeIcon, { className: "w-4 h-4 text-primary-500" }),
        createElement("span", null, "Price")
      ),
    label: "Price",
    cell: PriceCell,
    filterFn: "inNumberRange",
    filter: "numberRange",
    enableSorting: true,
    sortDescFirst: true,
  }),

  // --------------------------------------------------------------------
  // 📦 Quantity
  // --------------------------------------------------------------------
  columnHelper.accessor("itemQuantity", {
    id: "itemQuantity",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(CubeIcon, { className: "w-4 h-4 text-primary-500" }),
        createElement("span", null, "Quantity")
      ),
    label: "Quantity",
    cell: (info) => {
      const value = info.getValue() ?? 0;
      let color = "text-green-600";
      let text = value;

      if (value <= 5 && value > 0) {
        color = "text-yellow-600";
        text = `${value} (Low)`;
      } else if (value === 0) {
        color = "text-red-500";
        text = "Out of Stock";
      }

      return createElement("span", { className: `font-medium ${color}` }, text);
    },
    filterFn: "inNumberRange",
    filter: "numberRange",
    sortUndefined: "last",
    enableSorting: true,
  }),

  // --------------------------------------------------------------------
  // ✅ Status
  // --------------------------------------------------------------------
  columnHelper.accessor("status", {
    id: "status",
    header: () =>
      createElement(
        "div",
        { className: "flex items-center gap-1" },
        createElement(CheckCircleIcon, { className: "w-4 h-4 text-primary-500" }),
        createElement("span", null, "Status")
      ),
    label: "Status",
    cell: StatusCell,
    filter: "searchableSelect",
    filterFn: "arrIncludesSome",
    enableSorting: false, // static labels, no sorting needed
  }),

  // --------------------------------------------------------------------
  // 🧮 Hidden Column: Lesson Count (placeholder)
  // --------------------------------------------------------------------
  columnHelper.accessor("lesson_count", {
    id: "lesson_count",
    isHiddenColumn: true,
    filterFn: "inNumberRange",
    filter: "numberRange",
    enableSorting: false,
  }),
];
