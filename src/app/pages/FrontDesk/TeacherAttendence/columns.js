// src/app/pages/FrontDesk/TeacherAttendence/columns.js
import { createElement } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  TeacherNameCell,
  SubjectCell,
  AttendanceStatusCell,
} from "./rows";

// ✅ Heroicons outline only
import {
  UserIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("teacherName", {
    id: "teacherName",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(UserIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500",
        }),
        createElement("span", { key: "label" }, "Teacher Name"),
      ]),
    cell: TeacherNameCell,
  }),
  columnHelper.accessor("subject", {
    id: "subject",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(BookOpenIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500",
        }),
        createElement("span", { key: "label" }, "Subject"),
      ]),
    cell: SubjectCell,
  }),
  columnHelper.accessor("attendanceStatus", {
    id: "attendanceStatus",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(ClipboardDocumentCheckIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500",
        }),
        createElement("span", { key: "label" }, "Status"),
      ]),
    cell: AttendanceStatusCell,
  }),
  columnHelper.display({
    id: "actions",
    header: () =>
      createElement("div", { className: "flex items-center gap-2" }, [
        createElement(Cog6ToothIcon, {
          key: "icon",
          className: "h-4 w-4 text-primary-500",
        }),
        createElement("span", { key: "label" }, "Actions"),
      ]),
    cell: RowActions,
  }),
];
