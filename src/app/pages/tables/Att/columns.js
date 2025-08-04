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
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ShieldCheckIcon,
} from "lucide-react";

// ✅ Allowed headers
const allowedHeaders = [
  "studentName",
  "attendanceDate",
  "className",
  "fromTime",
  "toTime",
  "attendanceStatus",
  "markedBy",
];

const columnHelper = createColumnHelper();

// ✅ Fallback header formatter
function formatHeader(header) {
  if (header === "id" || header.toLowerCase().endsWith("id")) return header.toUpperCase();
  return header
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

// ✅ Pure JS icons + labels
const iconHeaderMap = {
  studentName: () =>
    React.createElement("div", { className: "flex items-center gap-1" }, [
      React.createElement(UserIcon, { className: "w-4 h-4 text-gray-500", key: "icon" }),
      React.createElement("span", { key: "label" }, "Name"),
    ]),
  attendanceDate: () =>
    React.createElement("div", { className: "flex items-center gap-1" }, [
      React.createElement(CalendarDaysIcon, { className: "w-4 h-4 text-gray-500", key: "icon" }),
      React.createElement("span", { key: "label" }, "Date"),
    ]),
  fromTime: () =>
    React.createElement("div", { className: "flex items-center gap-1" }, [
      React.createElement(ClockIcon, { className: "w-4 h-4 text-gray-500", key: "icon" }),
      React.createElement("span", { key: "label" }, "In"),
    ]),
  toTime: () =>
    React.createElement("div", { className: "flex items-center gap-1" }, [
      React.createElement(ClockIcon, { className: "w-4 h-4 text-gray-500", key: "icon" }),
      React.createElement("span", { key: "label" }, "Out"),
    ]),
  attendanceStatus: () =>
    React.createElement("div", { className: "flex items-center gap-1" }, [
      React.createElement(ShieldCheckIcon, { className: "w-4 h-4 text-gray-500", key: "icon" }),
      React.createElement("span", { key: "label" }, "Status"),
    ]),
};

export function generateAttendanceColumns(headers) {
  const columns = [];

  const shouldPin = typeof window !== "undefined" && window.innerWidth <= 1024;

  // ✅ RowActions column
  const actionsColumn = columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
    meta: {
      pinned: shouldPin ? "left" : false,
    },
  });

  // ✅ On small screens, show Actions column first
  if (shouldPin) {
    columns.push(actionsColumn);
  }

  // ✅ Selection checkbox column
  columns.push(
    columnHelper.display({
      id: "select",
      label: "Row Selection",
      header: SelectHeader,
      cell: SelectCell,
    })
  );

  // ✅ Dynamic data columns
  headers.forEach((header) => {
    if (!allowedHeaders.includes(header)) return;

    let cell = (info) => info.getValue();
    let filter = "text";
    let filterFn = "includesString";

    switch (header) {
      case "studentName":
        cell = StudentNameCell;
        break;
      case "attendanceDate":
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
        cell = UserCell;
        break;
    }

    columns.push(
      columnHelper.accessor(header, {
        id: header,
        header: iconHeaderMap[header]
          ? iconHeaderMap[header]()
          : formatHeader(header),
        cell,
        filter,
        filterFn,
        enableSorting: true,
        enableColumnFilter: true,
      })
    );
  });

  // ✅ On large screens, show Actions column last
  if (!shouldPin) {
    columns.push(actionsColumn);
  }

  return columns;
}
