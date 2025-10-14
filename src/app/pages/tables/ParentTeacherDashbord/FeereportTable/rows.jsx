// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";
import clsx from "clsx";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Badge } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";

// ----------------------------------------------------------------------

export function TxnIdCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestamp = getValue();
  const date = dayjs(timestamp).locale(locale).format("DD MMM YYYY");
  const time = dayjs(timestamp).locale(locale).format("hh:mm A");

  return (
    <>
      <p className="font-medium">{date}</p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">{time}</p>
    </>
  );
}

export function TextCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const val = getValue();

  return (
    <p className="truncate text-sm text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{val}</Highlight>
    </p>
  );
}

export function AmountCell({ getValue, row }) {
  const val = getValue() || 0;
  const trxType = row?.original?.trxType; // "debit" or "credit"

  // ✅ If amount is 0 → neutral style (gray, no prefix)
  if (val === 0) {
    return (
      <p className="text-sm-plus font-medium text-gray-800 dark:text-dark-100">
        ₹{val.toLocaleString("en-IN")}
      </p>
    );
  }

  const color =
    trxType === "credit"
      ? "text-green-600 dark:text-green-400"
      : trxType === "debit"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-800 dark:text-dark-100";

  const prefix = trxType === "credit" ? "+" : trxType === "debit" ? "-" : "";

  return (
    <p className={clsx("text-sm-plus font-medium", color)}>
      {prefix}₹{val.toLocaleString("en-IN")}
    </p>
  );
}

export function StatusCell({ getValue }) {
  const val = getValue();
  const color =
    val === "Completed"
      ? "success"
      : val === "Pending"
      ? "warning"
      : "secondary";

  return (
    <Badge className="rounded-full" color={color} variant="soft">
      {val}
    </Badge>
  );
}

// ----------------------------------------------------------------------
// PropTypes
TxnIdCell.propTypes = { getValue: PropTypes.func };
DateCell.propTypes = { getValue: PropTypes.func };
TextCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};
AmountCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
};
StatusCell.propTypes = { getValue: PropTypes.func };
