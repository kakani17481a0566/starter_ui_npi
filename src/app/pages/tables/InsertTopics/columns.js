import { createColumnHelper } from "@tanstack/react-table";
import {
  TagIcon,
  BookOpenIcon,
  BadgeIcon,
  LayoutDashboardIcon,
  // LandmarkIcon,
  FileTextIcon,
  CheckCircleIcon,
  FileSignatureIcon,
} from "lucide-react";
import React from "react";

const columnHelper = createColumnHelper();

// ✅ Allowed fields from TopicFullResponseVM → TopicDetailVM
const allowedHeaders = [
  "id",           // Topic ID
  "name",         // Topic Name
  "code",         // Optional code
  "description",  // Description
  "subjectName",  // Subject
  "courseName",   // Course
  "topicTypeName",// Topic Type
  "tenantName",   // Tenant
];

// ✅ Field to icon mapping for topic columns
const iconMap = {
  id: TagIcon,
  name: BadgeIcon,
  code: FileSignatureIcon,
  description: FileTextIcon,
  subjectName: BookOpenIcon,
  courseName: BookOpenIcon,
  topicTypeName: CheckCircleIcon,
  tenantName: LayoutDashboardIcon,
};

/**
 * Dynamically generate Topic columns for TanStack Table
 * @param {Object} sampleRow - sample data row from API
 * @returns {Array} column definitions
 */
export const generateTopicColumns = (sampleRow) => {
  if (!sampleRow) return [];

  return allowedHeaders
    .filter((key) => key in sampleRow)
    .map((key) => {
      const Icon = iconMap[key];

      return columnHelper.accessor((row) => row[key], {
        id: key,
        header: () =>
          React.createElement(
            "div",
            { className: "flex items-center gap-1 text-primary-950" },
            Icon ? React.createElement(Icon, { className: "size-4 text-primary-600" }) : null,
            React.createElement(
              "span",
              null,
              key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            )
          ),
        cell: (info) =>
          React.createElement(
            "span",
            { className: "text-sm text-primary-950" },
            info.getValue()
          ),
      });
    });
};
