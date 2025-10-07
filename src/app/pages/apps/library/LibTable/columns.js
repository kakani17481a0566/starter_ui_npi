// src/app/pages/apps/library/LibTable/columns.js

import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  CurrencyRupeeIcon,
  ArchiveBoxIcon,
  SignalIcon,
  MapPinIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import {
  AddressCell,
  DateCell,
  BookIdCell,
  TitleCell,
  AuthorCell,
  CategoryCell,
  PriceCell,
  StockCell,
  StatusCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

// helper: build header with icon + text, including displayName
function headerWithIcon(Icon, text, name) {
  const HeaderComponent = () =>
    React.createElement(
      "div",
      { className: "flex items-center space-x-2 text-primary-500" },
      React.createElement(Icon, { className: "h-5 w-5" }),
      text ? React.createElement("span", null, text) : null
    );

  HeaderComponent.displayName = name || "HeaderWithIcon";
  return HeaderComponent;
}

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.bookId, {
    id: "book_id",
    header: headerWithIcon(TagIcon, "Book ID", "BookIdHeader"),
    cell: BookIdCell,
  }),
  columnHelper.accessor((row) => row.createdOn, {
    id: "created_at",
    header: headerWithIcon(CalendarDaysIcon, "Added On", "CreatedAtHeader"),
    cell: DateCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.book.title, {
    id: "title",
    header: headerWithIcon(BookOpenIcon, "Title", "TitleHeader"),
    cell: TitleCell,
  }),
  columnHelper.accessor((row) => row.author, {
    id: "author",
    header: headerWithIcon(UserIcon, "Author", "AuthorHeader"),
    cell: AuthorCell,
  }),
  columnHelper.accessor((row) => row.category, {
    id: "category",
    header: headerWithIcon(ArchiveBoxIcon, "Category", "CategoryHeader"),
    cell: CategoryCell,
  }),
  columnHelper.accessor((row) => row.price, {
    id: "price",
    header: headerWithIcon(CurrencyRupeeIcon, "Price", "PriceHeader"),
    cell: PriceCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.stock, {
    id: "stock",
    header: headerWithIcon(SignalIcon, "Stock", "StockHeader"),
    cell: StockCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: headerWithIcon(SignalIcon, "Status", "StatusHeader"),
    cell: StatusCell,
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor(
    (row) =>
      `${row.publisherAddress?.street}, ${row.publisherAddress?.line}`,
    {
      id: "publisher_address",
      header: headerWithIcon(MapPinIcon, "Publisher Address", "PublisherAddressHeader"),
      cell: AddressCell,
    }
  ),
  columnHelper.display({
    id: "actions",
    header: headerWithIcon(EllipsisHorizontalIcon, null, "ActionsHeader"),
    cell: RowActions,
  }),
];
