// src/app/pages/FrontDesk/StudentAttendence/columns.js
import { createElement } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  StudentNameCell,
  ClassCell,
  AttendanceStatusCell,
} from "./rows";

// ✅ Heroicons outline only
import {
  UserIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("studentName", {
    id: "studentName",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(UserIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500", // 🔹 primary color
        }),
        createElement("span", { key: "label" }, "Student Name"),
      ]),
    cell: StudentNameCell,
  }),
  columnHelper.accessor("className", {
    id: "className",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(AcademicCapIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500", // 🔹 primary color
        }),
        createElement("span", { key: "label" }, "Class"),
      ]),
    cell: ClassCell,
  }),
  columnHelper.accessor("attendanceStatus", {
    id: "attendanceStatus",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(ClipboardDocumentCheckIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500", // 🔹 primary color
        }),
        createElement("span", { key: "label" }, "Status"),
      ]),
    cell: AttendanceStatusCell,
  }),
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(Cog6ToothIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500", // 🔹 primary color
        }),
        createElement("span", { key: "label" }, "Actions"),
      ]),
    cell: RowActions,
  }),
];
