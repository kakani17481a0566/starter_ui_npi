import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
  StudentNameCell,
  DateCell,
  TimeCell,
  StatusCell,
  UserCell,
} from "./rows";

// Heroicons (outline)
import {
  UserCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  BoltIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const columnHelper = createColumnHelper();

function formatHeader(header) {
  if (header === "id" || header.toLowerCase().endsWith("id")) {
    return header.toUpperCase();
  }
  return header
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

const skipHeaders = [
  "studentId",
  "parentId",
  "courseId",
  "attendanceId",
  "fromTime",
  "toTime",
  "markedBy",
  "markedOn",
  "updatedBy",
  "updatedOn",
  "imageUrl",
  "attendanceDate",
];

// 🎨 Map ALL possible column headers → icons
const headerIcons = {
  studentName: UserCircleIcon,
  className: BuildingOffice2Icon,
  parentName: UserGroupIcon,
  mobileNumber: PhoneIcon,
  alternateNumber: DevicePhoneMobileIcon,
  attendanceDate: CalendarDaysIcon,
  markedOn: CalendarDaysIcon,
  updatedOn: ArrowPathIcon,
  fromTime: ClockIcon,
  toTime: ClockIcon,
  attendanceStatus: CheckCircleIcon,
  markedBy: PencilSquareIcon,
  updatedBy: BoltIcon,
  bloodGroup: HeartIcon,
  gender: UserCircleIcon,
};

export function generateAttendanceColumns(headers) {
  const columns = [
    columnHelper.display({
      id: "select",
      label: "Row Selection",
      header: SelectHeader,
      cell: SelectCell,
    }),
  ];

  headers
    .filter((header) => !skipHeaders.includes(header))
    .forEach((header) => {
      let cell = (info) => info.getValue();
      let filter = "text";
      let filterFn = "includesString";

      switch (header) {
        case "studentName":
          cell = (info) => StudentNameCell({ ...info, row: info.row });
          break;
        case "attendanceDate":
        case "markedOn":
        case "updatedOn":
          cell = DateCell;
          filter = "dateRange";
          filterFn = "inNumberRange";
          break;
        case "fromTime":
        case "toTime":
          cell = TimeCell;
          break;
        case "attendanceStatus":
          cell = StatusCell;
          break;
        case "markedBy":
        case "updatedBy":
          cell = UserCell;
          break;
      }

      const Icon = headerIcons[header];
      const label = formatHeader(header);

      columns.push(
        columnHelper.accessor(header, {
          id: header,
          header: () =>
            React.createElement(
              "span",
              {
                className: "flex items-center gap-1 text-primary-600",
                title: label,
              },
              Icon &&
                React.createElement(Icon, {
                  className: "w-4 h-4 text-primary-600",
                  title: label,
                }),
              label
            ),
          cell,
          filter,
          filterFn,
          enableSorting: true,
          enableColumnFilter: true,
        }),
      );
    });

  columns.push(
    columnHelper.display({
      id: "actions",
      header: () =>
        React.createElement(
          "span",
          {
            className: "flex items-center gap-1 text-primary-600",
            title: "Actions",
          },
          "Actions"
        ),
      cell: RowActions,
    }),
  );

  return columns;
}
