// src/app/pages/forms/StudentEnquiryTable/EnquiryTable/columns.js

// Import Dependencies
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";

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

// ✅ Custom Parent Cell (no JSX)
function ParentCell({ row }) {
  const parentName = row.original.parentName;
  const parentPhone = row.original.parentPhone;

  if (!parentName && !parentPhone) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }

  return React.createElement(
    "div",
    { className: "flex flex-col" },
    React.createElement(
      "span",
      { className: "text-sm font-medium text-gray-800 dark:text-dark-100" },
      parentName
    ),
    parentPhone
      ? React.createElement(
          "span",
          { className: "text-xs text-gray-500 dark:text-dark-300" },
          parentPhone
        )
      : null
  );
}

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

  // ✅ Enquiry ID
  columnHelper.accessor((row) => row.studentEnquiryId, {
    id: "studentEnquiryId",
    label: "Enquiry ID",
    header: "ID",
    cell: EnquiryIdCell,
  }),

  // ✅ Student Name
  columnHelper.accessor((row) => row.fullName, {
    id: "fullName",
    label: "Student Name",
    header: "Student Name",
    cell: NameCell,
  }),

  // ✅ Date of Birth
  columnHelper.accessor(
    (row) => (row.dob ? new Date(row.dob).getTime() : null),
    {
      id: "dob",
      label: "Date of Birth",
      header: "DOB",
      cell: DateCell,
      filterFn: "inNumberRange",
    }
  ),

  // ✅ Gender
  columnHelper.accessor((row) => row.gender, {
    id: "gender",
    label: "Gender",
    header: "Gender",
    cell: GenderCell,
  }),

  // ✅ Admission Course
  columnHelper.accessor((row) => row.admissionCourseName, {
    id: "admissionCourseName",
    label: "Admission Course",
    header: "Course",
    cell: CourseCell,
  }),

  // ✅ Branch
  columnHelper.accessor((row) => row.branchName, {
    id: "branchName",
    label: "Branch",
    header: "Branch",
    cell: BranchCell,
  }),

  // ✅ Status
  columnHelper.accessor((row) => row.statusName, {
    id: "statusName",
    label: "Status",
    header: "Status",
    cell: StatusCell,
  }),

  // ✅ Parent Info
  columnHelper.display({
    id: "parent",
    label: "Parent",
    header: "Parent",
    cell: ParentCell,
  }),

  // ✅ Created On
  columnHelper.accessor(
    (row) => (row.createdOn ? new Date(row.createdOn).getTime() : null),
    {
      id: "createdOn",
      label: "Created On",
      header: "Created On",
      cell: DateCell,
      filterFn: "inNumberRange",
    }
  ),

  // ✅ Row Actions
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  }),
];
