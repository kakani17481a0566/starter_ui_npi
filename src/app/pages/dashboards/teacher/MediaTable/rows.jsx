// src/app/pages/dashboards/teacher/MediaTable/rows.jsx

import clsx from "clsx";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------
// Cell: Day (column1)
export function DayCell({ getValue }) {
  return (
    <span className="font-semibold text-gray-900 dark:text-white">
      {getValue()}
    </span>
  );
}

// Cell: File (column2–7)
export function FileCell({ getValue }) {
  const value = getValue();
  return (
    <div
      className={clsx(
        "whitespace-normal text-sm",
        value ? "text-gray-800 dark:text-dark-100" : "text-gray-400 italic"
      )}
    >
      {value || "—"}
    </div>
  );
}

// Cell: Action column (static placeholder)
export function ActionsCell() {
  return (
    <div className="text-sm text-right text-gray-500 dark:text-dark-300 italic">
      N/A
    </div>
  );
}

// ----------------------------------------------------------------------
// PropTypes
DayCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

FileCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

ActionsCell.propTypes = {};
