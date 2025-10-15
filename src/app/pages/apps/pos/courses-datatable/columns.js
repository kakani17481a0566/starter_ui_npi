// ----------------------------------------------------------------------
// Import Dependencies
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
  CubeIcon, // ✅ For Quantity
} from "@heroicons/react/24/outline";

// Local Imports
import { ItemNameCell, PriceCell, StatusCell } from "./rows";

// ----------------------------------------------------------------------
// Column Helper
// ----------------------------------------------------------------------
const columnHelper = createColumnHelper();

// ----------------------------------------------------------------------
// Columns Definition
// ----------------------------------------------------------------------
export const columns = [
  // --------------------------------------------------------------------
  // 🏷️ Item Name
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.name, {
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
  }),

  // --------------------------------------------------------------------
  // 📚 Category
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.categoryName, {
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
  }),

  // --------------------------------------------------------------------
  // 📏 Size
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.size, {
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
  }),

  // --------------------------------------------------------------------
  // 💰 Price
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.price, {
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
    sortDescFirst: true,
  }),

  // --------------------------------------------------------------------
  // 📦 Quantity (from row.itemQuantity)
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.itemQuantity ?? 0, {
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
  }),

  // --------------------------------------------------------------------
  // ✅ Status
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.status, {
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
  }),

  // --------------------------------------------------------------------
  // 🧮 Hidden Column: Lesson Count (placeholder)
  // --------------------------------------------------------------------
  columnHelper.accessor((row) => row.lesson_count ?? 0, {
    id: "lesson_count",
    isHiddenColumn: true,
    filterFn: "inNumberRange",
    filter: "numberRange",
  }),
];
