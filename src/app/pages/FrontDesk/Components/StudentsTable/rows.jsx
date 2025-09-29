// src/app/pages/FrontDesk/Components/StudentsTable/rows.jsx

import dayjs from "dayjs";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { Highlight } from "components/shared/Highlight";
import { Avatar, Tag } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";
import { attendanceStatusOptions } from "./data"; // ✅ dynamic from API

// ----------------------------------------------------------------------
// 🔑 helper to normalize values for comparison
const normalize = (s) =>
  s?.toString().trim().toLowerCase().replace(/[\s-_]/g, "");

// ----------------------------------------------------------------------
// StudentNameCell
export function StudentNameCell({ row, getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const name = getValue();

  return (
    <div className="flex items-center gap-3">
      <Avatar
        size={9}
        name={name}
        src={row.original.imageUrl}
        classNames={{ display: "mask is-squircle rounded-none text-sm" }}
      />
      <span className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// DateCell
export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestamp = getValue();
  if (!timestamp) return null;
  return (
    <p className="font-medium">
      {dayjs(timestamp).locale(locale).format("DD MMM YYYY")}
    </p>
  );
}

// ----------------------------------------------------------------------
// TimeCell
export function TimeCell({ getValue }) {
  const { locale } = useLocaleContext();
  const time = getValue();
  if (!time) return null;
  return (
    <p className="text-xs text-gray-600 dark:text-dark-300">
      {dayjs(time, "HH:mm:ss").locale(locale).format("hh:mm A")}
    </p>
  );
}

// ----------------------------------------------------------------------
// StatusCell
export function StatusCell({ getValue, row, column, table }) {
  let val = getValue();

  // 🔑 Auto mark "Absent" after 12:00 PM if still "Not Marked"
  if (!val || normalize(val) === normalize("Not Marked")) {
    const now = dayjs();
    if (now.hour() >= 12) {
      val = "Absent";
    }
  }

  // ensure "Absent" is in options
  const extendedOptions = [
    ...attendanceStatusOptions,
    { value: "Absent", label: "Absent", color: "error" },
  ];

  // match using normalized values
  const option = extendedOptions.find(
    (o) => normalize(o.value) === normalize(val)
  );

  const handleChangeStatus = (status) => {
    table.options.meta?.updateData(row.index, column.id, status);

    const newOpt = extendedOptions.find(
      (o) => normalize(o.value) === normalize(status)
    );
    toast.success(`Attendance status updated to ${newOpt?.label}`);
  };

  return (
    <Listbox onChange={handleChangeStatus} value={val}>
      <ListboxButton
        as={Tag}
        component="button"
        color={option?.color || "dark"}
        className="gap-1.5 cursor-pointer"
      >
        <span>{option?.label || "Unknown"}</span>
      </ListboxButton>
      <Transition
        as={ListboxOptions}
        className="max-h-60 z-100 w-40 overflow-auto rounded-lg border bg-white py-1 text-xs capitalize shadow-soft dark:border-dark-500 dark:bg-dark-750"
      >
        {extendedOptions.map((item) => (
          <ListboxOption
            key={item.value}
            value={item.value}
            className={({ focus }) =>
              clsx(
                "flex justify-between px-3 py-2",
                focus && "bg-gray-100 dark:bg-dark-600"
              )
            }
          >
            {({ selected }) => (
              <>
                <span>{item.label}</span>
                {selected && <CheckIcon className="w-4 h-4" />}
              </>
            )}
          </ListboxOption>
        ))}
      </Transition>
    </Listbox>
  );
}

// ----------------------------------------------------------------------
// UserCell
export function UserCell({ getValue }) {
  return (
    <p className="text-sm font-medium text-gray-700 dark:text-dark-200">
      {getValue()}
    </p>
  );
}

// ----------------------------------------------------------------------
// PropTypes
StudentNameCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};
DateCell.propTypes = { getValue: PropTypes.func };
TimeCell.propTypes = { getValue: PropTypes.func };
StatusCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};
UserCell.propTypes = { getValue: PropTypes.func };
