import dayjs from "dayjs";
import PropTypes from "prop-types";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Badge } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";

// ✅ Student Name Cell (neutral color, no status icons)
export function StudentNameCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState()?.globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const name = getValue() ?? "—";

  return (
    <span className="font-medium truncate max-w-[160px] block uppercase text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
    </span>
  );
}

// ✅ Date Cell
export function DateCell({ getValue }) {
  const value = getValue();
  const { locale } = useLocaleContext();
  const isValidDate =
    value && value !== "Attendance not given" && dayjs(value).isValid();

  if (!isValidDate) {
    return <span className="text-sm text-gray-500 italic">Not given</span>;
  }

  const formatted = dayjs(value).locale(locale).format("DD MMM YYYY");
  return (
    <span className="text-sm text-gray-700 dark:text-dark-100">{formatted}</span>
  );
}

// ✅ Time Cell
export function TimeCell({ getValue }) {
  const value = getValue();
  return (
    <span className="text-sm text-gray-600 dark:text-dark-300 truncate max-w-[120px]">
      {value && value !== "Not marked" ? value : "—"}
    </span>
  );
}

// ✅ Attendance Status Cell
export function StatusCell({ getValue }) {
  const status = getValue() ?? "Not Marked";
  let color = "gray";

  switch (status) {
    case "Checked-In":
    case "Checked In":
      color = "info";
      break;
    case "Checked-Out":
    case "Checked Out":
      color = "success";
      break;
    case "Not Marked":
      color = "warning";
      break;
  }

  return (
    <Badge
      color={color}
      variant="soft"
      className="capitalize max-w-[140px] truncate"
    >
      {status}
    </Badge>
  );
}

// ✅ MarkedBy / UpdatedBy Cell
export function UserCell({ getValue }) {
  const value = getValue();
  return (
    <span className="text-xs text-gray-500 dark:text-dark-300 max-w-[140px] truncate">
      {value?.trim() || "—"}
    </span>
  );
}

// ----------------------------------------------------------------------
// PropTypes

StudentNameCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  column: PropTypes.object,
  table: PropTypes.object,
};

DateCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

TimeCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

StatusCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

UserCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};
