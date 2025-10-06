// src/app/pages/FrontDesk/Components/PostalTable/rows.js

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

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Tag } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";
import { postalStatusOptions } from "./data";

// ----------------------------------------------------------------------

// ✅ Parcel ID
export function ParcelIdCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

// ✅ Date (only date, no time)
export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestamp = getValue();
  const date = dayjs(timestamp).locale(locale).format("DD MMM YYYY");
  return (
    <p className="font-medium">{date}</p>
  );
}

// ✅ Sender
export function SenderCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{getValue()}</Highlight>
    </span>
  );
}

// ✅ Receiver
export function ReceiverCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{getValue()}</Highlight>
    </span>
  );
}

// ✅ Postal Item
export function PostalItemCell({ getValue }) {
  return (
    <span className="text-sm text-gray-700 dark:text-dark-200">
      {getValue()}
    </span>
  );
}

// ✅ Amount
export function AmountCell({ getValue }) {
  return (
    <p className="text-sm-plus font-medium text-gray-800 dark:text-dark-100">
      ₹{getValue()}
    </p>
  );
}

// ✅ Status (editable dropdown)
export function StatusCell({ getValue, row, column, table }) {
  const val = getValue();
  const option = postalStatusOptions.find((item) => item.value === val);

  const handleChangeStatus = (status) => {
    table.options.meta?.updateData(row.index, column.id, status);
    toast.success(`Status updated to ${status}`);
  };

  return (
    <Listbox onChange={handleChangeStatus} value={val}>
      <ListboxButton
        as={Tag}
        component="button"
        color={option?.color || "gray"}
        className="gap-1.5 cursor-pointer"
      >
        {option?.icon && <option.icon className="h-4 w-4" />}
        <span>{option?.label || val}</span>
      </ListboxButton>
      <Transition
        as={ListboxOptions}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        anchor={{ to: "bottom start", gap: "8px" }}
        className="max-h-60 z-100 w-40 overflow-auto rounded-lg border border-gray-300 bg-white py-1 text-xs-plus capitalize shadow-soft dark:border-dark-500 dark:bg-dark-750"
      >
        {postalStatusOptions.map((item) => (
          <ListboxOption
            key={item.value}
            value={item.value}
            className={({ focus }) =>
              clsx(
                "relative flex cursor-pointer select-none items-center justify-between space-x-2 px-3 py-2 text-gray-800 transition-colors dark:text-dark-100",
                focus && "bg-gray-100 dark:bg-dark-600",
              )
            }
          >
            {({ selected }) => (
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="size-4.5 stroke-1" />}
                  <span className="block truncate">{item.label}</span>
                </div>
                {selected && <CheckIcon className="-mr-1 size-4.5 stroke-1" />}
              </div>
            )}
          </ListboxOption>
        ))}
      </Transition>
    </Listbox>
  );
}

// ----------------------------------------------------------------------
// 🔹 PropTypes
ParcelIdCell.propTypes = { getValue: PropTypes.func };
DateCell.propTypes = { getValue: PropTypes.func };
SenderCell.propTypes = ReceiverCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};
PostalItemCell.propTypes = { getValue: PropTypes.func };
AmountCell.propTypes = { getValue: PropTypes.func };
StatusCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};
