// src/app/pages/forms/StudentEnquiryTable/EnquiryTable/rows.js

// Import Dependencies
import React from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Highlight } from "components/shared/Highlight";
import { Avatar, Tag } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";

// ----------------------------------------------------------------------

// ✅ Enquiry ID Cell
export function EnquiryIdCell({ getValue }) {
  return React.createElement(
    "span",
    { className: "text-sm font-medium text-primary-600 dark:text-primary-400" },
    getValue()
  );
}
EnquiryIdCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

// ✅ Date Cell (DOB / Created On) → Only Date
export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestamps = getValue();
  if (!timestamps) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }

  const date = dayjs(timestamps).locale(locale).format("DD MMM YYYY");

  return React.createElement(
    "p",
    { className: "text-sm font-medium text-gray-800 dark:text-dark-100" },
    date
  );
}
DateCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

// ✅ Student Name Cell
export function NameCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const name = getValue();

  return (
    <div className="flex items-center space-x-3">
      <Avatar
        size={9}
        name={name}
        src={null} // 🔹 If you have student photo, bind here
        classNames={{
          display: "mask is-squircle rounded-none text-xs-plus",
        }}
      />
      <span className="text-sm font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
      </span>
    </div>
  );
}
NameCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};

// ✅ Gender Cell
export function GenderCell({ getValue }) {
  const gender = getValue();
  if (!gender) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }
  return React.createElement(
    Tag,
    { color: "info", className: "text-xs-plus font-medium capitalize" },
    gender
  );
}
GenderCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

// ✅ Course Cell (Admission Course)
export function CourseCell({ getValue }) {
  const course = getValue();
  if (!course) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }
  return React.createElement(
    Tag,
    { color: "primary", className: "text-xs-plus font-medium capitalize" },
    course
  );
}
CourseCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

// ✅ Branch Cell
export function BranchCell({ getValue }) {
  const branch = getValue();
  if (!branch) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }
  return React.createElement(
    Tag,
    { color: "warning", className: "text-xs-plus font-medium capitalize" },
    branch
  );
}
BranchCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

// ✅ Status Cell
// ✅ Status Cell
export function StatusCell({ getValue }) {
  const status = getValue();
  if (!status) {
    return React.createElement(
      "span",
      { className: "text-xs text-gray-400" },
      "N/A"
    );
  }

  // Normalize backend values
  const normalized = status.toUpperCase();

  let label = status; // fallback
  let color = "secondary";

  switch (normalized) {
    case "NEW":
      label = "New";
      color = "success"; // green
      break;
    case "IN_PROGRESS":
      label = "In Progress";
      color = "warning"; // yellow
      break;
    case "APPROVED":
      label = "Approved";
      color = "primary"; // blue
      break;
    case "REJECTED":
      label = "Rejected";
      color = "error"; // red
      break;
    case "CONVERTED":
      label = "Converted";
      color = "success"; // green
      break;
    default:
      label = status; // unknown → show raw
      color = "secondary";
  }

  return React.createElement(
    Tag,
    { color, className: "text-xs-plus font-medium capitalize" },
    label
  );
}

StatusCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};
