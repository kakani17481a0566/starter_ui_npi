// columns.js

// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

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

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.bookId, {
    id: "book_id",
    header: "Book ID",
    cell: BookIdCell,
  }),
  columnHelper.accessor((row) => row.createdOn, {
    id: "created_at",
    header: "Added On",
    cell: DateCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.book.title, {
    id: "title",
    header: "Title",
    cell: TitleCell,
  }),
  columnHelper.accessor((row) => row.author, {
    id: "author",
    header: "Author",
    cell: AuthorCell,
  }),
  columnHelper.accessor((row) => row.category, {
    id: "category",
    header: "Category",
    cell: CategoryCell,
  }),
  columnHelper.accessor((row) => row.price, {
    id: "price",
    header: "Price",
    cell: PriceCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.stock, {
    id: "stock",
    header: "Stock",
    cell: StockCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Status",
    cell: StatusCell,
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor(
    (row) =>
      `${row.publisherAddress?.street}, ${row.publisherAddress?.line}`,
    {
      id: "publisher_address",
      header: "Publisher Address",
      cell: AddressCell,
    }
  ),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
