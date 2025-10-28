// ----------------------------------------------------------------------
// Branch cells for /api/Branch/tenant/:tenantId
// ----------------------------------------------------------------------
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Highlight } from "components/shared/Highlight";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
const formatPhone = (val) => (val ? String(val).replace(/\s+/g, "") : "-");

// ----------------------------------------------------------------------
// ID
// ----------------------------------------------------------------------
export function BranchIdCell({ getValue }) {
  return <span className="font-medium text-primary-600 dark:text-primary-400">{getValue()}</span>;
}

// ----------------------------------------------------------------------
// Name
// ----------------------------------------------------------------------
export function BranchNameCell({ getValue, column, table }) {
  const { globalFilter } = table.getState();
  const globalQuery = String(globalFilter ?? "");
  const columnQuery = String(column.getFilterValue?.() ?? "");
  const name = getValue();

  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
    </span>
  );
}

// ----------------------------------------------------------------------
// Contact
// ----------------------------------------------------------------------
export function ContactCell({ getValue }) {
  const phone = formatPhone(getValue());
  return <span className="text-gray-800 dark:text-dark-100">{phone}</span>;
}

// ----------------------------------------------------------------------
// Address (kept your highlight + truncation UX)
// ----------------------------------------------------------------------
export function AddressCell({ getValue, column, table }) {
  const { globalFilter } = table.getState();
  const globalQuery = String(globalFilter ?? "");
  const columnQuery = String(column.getFilterValue?.() ?? "");
  const val = getValue();

  return (
    <p className="w-48 truncate text-xs-plus xl:w-56 2xl:w-64">
      <Highlight query={[globalQuery, columnQuery]}>{val}</Highlight>
    </p>
  );
}

// ----------------------------------------------------------------------
// Pincode / District / State
// ----------------------------------------------------------------------
export function TextCell({ getValue }) {
  return <span className="text-gray-800 dark:text-dark-100">{getValue() ?? "-"}</span>;
}

// ----------------------------------------------------------------------
// Created On (Date)
// ----------------------------------------------------------------------
export function CreatedOnCell({ getValue }) {
  const { locale } = useLocaleContext();
  const ts = getValue();
  if (!ts) return <span>-</span>;

  // accepts ISO string or number
  const m = dayjs(isNaN(ts) ? ts : Number(ts)).locale(locale);
  return (
    <>
      <p className="font-medium">{m.format("DD MMM YYYY")}</p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">{m.format("hh:mm A")}</p>
    </>
  );
}

// ----------------------------------------------------------------------
// PropTypes
// ----------------------------------------------------------------------
const cellFn = PropTypes.func;
const obj = PropTypes.object;

BranchIdCell.propTypes = { getValue: cellFn };
BranchNameCell.propTypes = { getValue: cellFn, column: obj, table: obj };
ContactCell.propTypes = { getValue: cellFn };
AddressCell.propTypes = { getValue: cellFn, column: obj, table: obj };
TextCell.propTypes = { getValue: cellFn };
CreatedOnCell.propTypes = { getValue: cellFn };
