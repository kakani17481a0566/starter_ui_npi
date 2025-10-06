// src/app/pages/FrontDesk/Components/PostalTable/columns.js

import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";

import {
  DateCell,
  SenderCell,
  ReceiverCell,
  StatusCell,
  AmountCell,
  ParcelIdCell,
  PostalItemCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Row Selection
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),

  // ✅ Parcel ID
  columnHelper.accessor((row) => row.parcel_id, {
    id: "parcel_id",
    label: "Parcel ID",
    header: "Parcel ID",
    cell: ParcelIdCell,
  }),

  // ✅ Created On (Date)
  columnHelper.accessor((row) => Number(new Date(row.created_on).getTime()), {
    id: "created_on",
    label: "Created On",
    header: "Date",
    cell: DateCell,
    filterFn: "inNumberRange",
  }),

  // ✅ Sender Name
  columnHelper.accessor((row) => row.sender_name, {
    id: "sender_name",
    label: "Sender",
    header: "Sender",
    cell: SenderCell,
  }),

  // ✅ Receiver Name
  columnHelper.accessor((row) => row.receiver_name, {
    id: "receiver_name",
    label: "Receiver",
    header: "Receiver",
    cell: ReceiverCell,
  }),

  // ✅ Postal Item
  columnHelper.accessor((row) => row.postal_item, {
    id: "postal_item",
    label: "Postal Item",
    header: "Item",
    cell: PostalItemCell,
  }),

  // ✅ Amount
  columnHelper.accessor((row) => row.amount, {
    id: "amount",
    label: "Amount",
    header: "Amount",
    cell: AmountCell,
    filterFn: "inNumberRange",
  }),

  // ✅ Status
  columnHelper.accessor((row) => row.status, {
    id: "status",
    label: "Status",
    header: "Status",
    cell: StatusCell,
    filterFn: "arrIncludesSome",
  }),

  // ✅ Row Actions
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  }),
];
