// src/app/pages/tables/InsertWeek/rows.jsx

import dayjs from "dayjs";
import PropTypes from "prop-types";

/**
 * Formats a date (e.g., startDate, endDate) into readable text
 */
export function DateCell({ getValue }) {
  const value = getValue();
  const formatted = dayjs(value).format("DD MMM YYYY");
  return (
    <p className="text-sm font-medium text-gray-900 dark:text-dark-100">
      {formatted}
    </p>
  );
}

/**
 * Displays plain text for string/integer fields
 */
export function TextCell({ getValue }) {
  return (
    <p className="text-sm text-gray-800 dark:text-dark-100">{getValue()}</p>
  );
}

DateCell.propTypes = {
  getValue: PropTypes.func,
};

TextCell.propTypes = {
  getValue: PropTypes.func,
};
