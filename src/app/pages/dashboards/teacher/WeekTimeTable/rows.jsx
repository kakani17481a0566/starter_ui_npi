// src/app/pages/dashboards/teacher/WeekTimeTable/rows.jsx

import clsx from "clsx";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------
// Cell: Day (column1, always uppercase)
export function DayCell({ getValue }) {
  const value = getValue();
  return (
    <span className="font-semibold text-primary-950 dark:text-white uppercase">
      {value ? value.toString() : ""}
    </span>
  );
}

// Cell: File (columns 2–7, always uppercase, fallback placeholder)
export function FileCell({ getValue }) {
  const value = getValue();
  return (
    <div
      className={clsx(
        "whitespace-normal text-sm uppercase",
        value ? "text-primary-950 dark:text-dark-100" : "text-gray-400 italic"
      )}
    >
      {value ? value.toString() : "—"}
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
