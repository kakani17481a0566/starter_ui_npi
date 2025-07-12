import dayjs from "dayjs";
import PropTypes from "prop-types";

// Heroicons for status indicators
import {
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Badge } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";

// ✅ Student Name Cell
export function StudentNameCell({ getValue, column, table, row }) {
  const globalQuery = ensureString(table.getState()?.globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const name = getValue() ?? "—";
  const status = row?.original?.attendanceStatus;

  let textColor = "text-gray-800 dark:text-dark-100";
  let Icon = null;

  switch (status) {
    case "Checked-In":
    case "Checked In":
      textColor = "text-[#52AA97]";
      Icon = CheckCircleIcon;
      break;
    case "Checked-Out":
    case "Checked Out":
      textColor = "text-violet-500";
      Icon = ArrowRightOnRectangleIcon;
      break;
    case "Not Marked":
      textColor = "text-red-600";
      Icon = XCircleIcon;
      break;
  }

  return (
    <span className={`font-medium truncate max-w-[160px] block uppercase ${textColor}`}>
      <span className="flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4" />}
        <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
      </span>
    </span>
  );
}

// ✅ Date Cell
export function DateCell({ getValue }) {
  const value = getValue();
  const { locale } = useLocaleContext();
  const isValidDate = value && value !== "Attendance not given" && dayjs(value).isValid();

  if (!isValidDate) {
    return <span className="text-sm text-gray-500 italic">Not given</span>;
  }

  const formatted = dayjs(value).locale(locale).format("DD MMM YYYY");
  return <span className="text-sm text-gray-700 dark:text-dark-100">{formatted}</span>;
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
    <Badge color={color} variant="soft" className="capitalize max-w-[140px] truncate">
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
  row: PropTypes.object,
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
