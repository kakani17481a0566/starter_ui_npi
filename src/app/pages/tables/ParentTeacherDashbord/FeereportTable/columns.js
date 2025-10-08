// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";

// Import all cell components from one place
import { DateCell, AmountCell, StatusCell, TextCell } from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.id, {
    id: "id",
    label: "Transaction ID",
    header: "Txn ID",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => row.feeStructureName, {
    id: "feeStructureName",
    label: "Fee Type",
    header: "Fee Structure",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => new Date(row.trxDate).getTime(), {
    id: "trxDate",
    label: "Date",
    header: "Date",
    cell: DateCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.trxType, {
    id: "trxType",
    label: "Type",
    header: "Type",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => row.trxName, {
    id: "trxName",
    label: "Description",
    header: "Transaction",
    cell: TextCell,
  }),
  columnHelper.accessor((row) => row.debit, {
    id: "debit",
    label: "Debit",
    header: "Debit",
    cell: AmountCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.credit, {
    id: "credit",
    label: "Credit",
    header: "Credit",
    cell: AmountCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor((row) => row.trxStatus, {
    id: "trxStatus",
    label: "Status",
    header: "Status",
    cell: StatusCell,
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor((row) => row.paymentType, {
    id: "paymentType",
    label: "Payment Type",
    header: "Payment Type",
    cell: TextCell,
  }),
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  }),
];
