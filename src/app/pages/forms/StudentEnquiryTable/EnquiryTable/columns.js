// src/app/pages/forms/StudentEnquiryTable/EnquiryTable/columns.js

// Import Dependencies
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";

// Icons
import {
  IdentificationIcon,
  UserIcon,
  CalendarIcon,
  UserCircleIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";

import {
  EnquiryIdCell,
  DateCell,
  NameCell,
  GenderCell,
  CourseCell,
  BranchCell,
  StatusCell,
} from "./rows";

// ✅ Custom Parent Cell (Only Name, No Phone Number)
function ParentCell({ row }) {
  const parentName = row.original.parentName;

  if (!parentName) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }

  return React.createElement(
    "span",
    { className: "text-sm font-medium text-gray-800 dark:text-dark-100" },
    parentName
  );
}

// ----------------------------------------------------------------------

// ✅ Utility: header with icon (strict JS)
function withIcon(Icon, label) {
  return React.createElement(
    "div",
    { className: "flex items-center gap-2" },
    React.createElement(Icon, {
      className: "w-4 h-4 text-primary-600 dark:text-primary-400",
    }),
    React.createElement("span", null, label)
  );
}

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Row Selection
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),

  // ✅ Enquiry ID
  columnHelper.accessor((row) => row.studentEnquiryId, {
    id: "studentEnquiryId",
    label: "Enquiry ID",
    header: withIcon(IdentificationIcon, "ID"),
    cell: EnquiryIdCell,
  }),

  // ✅ Student Name
  columnHelper.accessor((row) => row.fullName, {
    id: "fullName",
    label: "Student Name",
    header: withIcon(UserIcon, "Student Name"),
    cell: NameCell,
  }),

  // ✅ Date of Birth
  columnHelper.accessor(
    (row) => (row.dob ? new Date(row.dob).getTime() : null),
    {
      id: "dob",
      label: "Date of Birth",
      header: withIcon(CalendarIcon, "DOB"),
      cell: DateCell,
      filterFn: "inNumberRange",
    }
  ),

  // ✅ Gender
  columnHelper.accessor((row) => row.gender, {
    id: "gender",
    label: "Gender",
    header: withIcon(UserCircleIcon, "Gender"),
    cell: GenderCell,
  }),

  // ✅ Admission Course
  columnHelper.accessor((row) => row.admissionCourseName, {
    id: "admissionCourseName",
    label: "Admission Course",
    header: withIcon(BookOpenIcon, "Course"),
    cell: CourseCell,
  }),

  // ✅ Branch
  columnHelper.accessor((row) => row.branchName, {
    id: "branchName",
    label: "Branch",
    header: withIcon(BuildingOfficeIcon, "Branch"),
    cell: BranchCell,
  }),

  // ✅ Status
  columnHelper.accessor((row) => row.statusName, {
    id: "statusName",
    label: "Status",
    header: withIcon(CheckCircleIcon, "Status"),
    cell: StatusCell,
  }),

  // ✅ Parent Info (Only Name)
  columnHelper.display({
    id: "parent",
    label: "Parent",
    header: withIcon(UserGroupIcon, "Parent"),
    cell: ParentCell,
  }),

  // ✅ Created On
  columnHelper.accessor(
    (row) => (row.createdOn ? new Date(row.createdOn).getTime() : null),
    {
      id: "createdOn",
      label: "Created On",
      header: withIcon(ClockIcon, "Created On"),
      cell: DateCell,
      filterFn: "inNumberRange",
    }
  ),

  // ✅ Row Actions
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: withIcon(Cog6ToothIcon, "Actions"),
    cell: RowActions,
  }),
];
