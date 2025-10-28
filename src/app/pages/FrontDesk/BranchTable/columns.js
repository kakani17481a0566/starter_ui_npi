import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";

import {
  BranchNameCell,
  ContactCell,
  AddressCell,
  TextCell,
//   CreatedOnCell,
} from "./rows";

// ✅ Outline icons
import {
  BuildingOffice2Icon,
  PhoneIcon,
  MapIcon,
//   MapPinSquareIcon,
  MapPinIcon,
//   CalendarDaysIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const columnHelper = createColumnHelper();

// ✅ Helper for icon + text (JSX-free)
function HeaderWithIcon(Icon, label) {
  return function HeaderRenderer() {
    return React.createElement(
      "div",
      { className: "flex items-center gap-1.5" },
      React.createElement(Icon, {
        className: "h-4 w-4 text-primary-600 dark:text-primary-400",
      }),
      React.createElement("span", null, label)
    );
  };
}

export const columns = [
  // ✅ Row selection
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),

  // ✅ Branch name
  columnHelper.accessor("name", {
    id: "name",
    label: "Branch",
    header: HeaderWithIcon(BuildingOffice2Icon, "Branch"),
    cell: BranchNameCell,
  }),

  // ✅ Contact
  columnHelper.accessor("contact", {
    id: "contact",
    label: "Contact",
    header: HeaderWithIcon(PhoneIcon, "Contact"),
    cell: ContactCell,
  }),

  // ✅ Address
  columnHelper.accessor("address", {
    id: "address",
    label: "Address",
    header: HeaderWithIcon(MapIcon, "Address"),
    cell: AddressCell,
  }),

  // ✅ Pincode
  columnHelper.accessor("pincode", {
    id: "pincode",
    label: "Pincode",
    header: HeaderWithIcon(MapIcon, "Pincode"),
    cell: TextCell,
  }),

  // ✅ District
  columnHelper.accessor("district", {
    id: "district",
    label: "District",
    header: HeaderWithIcon(MapPinIcon, "District"),
    cell: TextCell,
  }),

  // ✅ State
  columnHelper.accessor("state", {
    id: "state",
    label: "State",
    header: HeaderWithIcon(MapPinIcon, "State"),
    cell: TextCell,
  }),

  // ✅ Created On
//   columnHelper.accessor((row) => row.createdOn ?? null, {
//     id: "createdOn",
//     label: "Created On",
//     header: HeaderWithIcon(CalendarDaysIcon, "Created On"),
//     cell: CreatedOnCell,
//     filterFn: "inNumberRange",
//   }),

  // ✅ Row Actions
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: HeaderWithIcon(WrenchScrewdriverIcon, "Actions"),
    cell: RowActions,
  }),
];
