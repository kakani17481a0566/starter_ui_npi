// Import Dependencies
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { TbUpload, TbCurrencyDollar } from "react-icons/tb";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Local Imports
import { DateFilter } from "components/shared/table/DateFilter";
import { FacedtedFilter } from "components/shared/table/FacedtedFilter"; // ✅ renamed file
import { RangeFilter } from "components/shared/table/RangeFilter";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { orderStatusOptions } from "./data";

// ----------------------------------------------------------------------

export function Toolbar({ table }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      {/* Header */}
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4 pt-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : ""
        )}
        style={!isFullScreenEnabled ? { paddingInline: "var(--margin-x)" } : {}}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Orders History
          </h2>
        </div>

        {/* Actions */}
        {isXs ? <MobileActions /> : <DesktopActions />}
      </div>

      {/* Search + Filters */}
      {isXs ? (
        <>
          <div
            className="flex space-x-2 pt-4 [&_.input-root]:flex-1"
            style={!isFullScreenEnabled ? { paddingInline: "var(--margin-x)" } : {}}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className="hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4"
            style={!isFullScreenEnabled ? { paddingInline: "var(--margin-x)" } : {}}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className="custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4"
          style={{
            paddingInline: isFullScreenEnabled ? "1.25rem" : "var(--margin-x)",
          }}
        >
          <div className="flex shrink-0 space-x-2">
            <SearchInput table={table} />
            <Filters table={table} />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Subcomponents

function MobileActions() {
  const items = [
    "New Order",
    "Share",
    "Print",
    "Import Orders",
    "Export as PDF",
    "Export as CSV",
    "Save Table as View",
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton as={Button} variant="flat" className="size-8 shrink-0 rounded-full p-0">
        <EllipsisHorizontalIcon className="size-4.5" />
      </MenuButton>
      <Transition
        as={MenuItems}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        className="absolute z-100 mt-1.5 min-w-[10rem] whitespace-nowrap rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
      >
        {items.map((label) => (
          <MenuItem key={label}>
            {({ focus }) => (
              <button
                type="button"
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                <span>{label}</span>
              </button>
            )}
          </MenuItem>
        ))}
      </Transition>
    </Menu>
  );
}

function DesktopActions() {
  return (
    <div className="flex space-x-2">
      <Button variant="outlined" className="h-8 space-x-2 rounded-md px-3 text-xs">
        <PrinterIcon className="size-4" />
        <span>Print</span>
      </Button>

      {/* Export */}
      <Menu as="div" className="relative inline-block whitespace-nowrap text-left">
        <MenuButton as={Button} variant="outlined" className="h-8 space-x-2 rounded-md px-3 text-xs">
          <TbUpload className="size-4" />
          <span>Export</span>
          <ChevronUpDownIcon className="size-4" />
        </MenuButton>
        <Transition
          as={MenuItems}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
        >
          {["Export as PDF", "Export as CSV"].map((label) => (
            <MenuItem key={label}>
              {({ focus }) => (
                <button
                  type="button"
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                    focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                  )}
                >
                  <span>{label}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </Transition>
      </Menu>

      {/* More */}
      <Menu as="div" className="relative inline-block whitespace-nowrap text-left">
        <MenuButton as={Button} variant="outlined" className="h-8 shrink-0 rounded-md px-2.5">
          <EllipsisHorizontalIcon className="size-4.5" />
        </MenuButton>
        <Transition
          as={MenuItems}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-100 mt-1.5 min-w-[10rem] whitespace-nowrap rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
        >
          {["New Order", "Share Orders", "Import Orders", "Save Table as View"].map((label) => (
            <MenuItem key={label}>
              {({ focus }) => (
                <button
                  type="button"
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                    focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                  )}
                >
                  <span>{label}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </Transition>
      </Menu>
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
        root: "shrink-0",
      }}
      placeholder="Search ID, Customer..."
    />
  );
}

function Filters({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {table.getColumn("order_status") && (
        <FacedtedFilter
          options={orderStatusOptions}
          column={table.getColumn("order_status")}
          title="Status"
          Icon={MapPinIcon}
        />
      )}

      {table.getColumn("created_at") && (
        <DateFilter
          column={table.getColumn("created_at")}
          title="Order Date Range"
          config={{
            maxDate: new Date(),
            mode: "range",
          }}
        />
      )}

      {table.getColumn("total") && (
        <RangeFilter
          column={table.getColumn("total")}
          title="Total Amount"
          Icon={TbCurrencyDollar}
          MinPrefixIcon={TbCurrencyDollar}
          MaxPrefixIcon={TbCurrencyDollar}
          buttonText={({ min, max }) => (
            <>
              {min && <>From ${min}</>}
              {min && max && " - "}
              {max && <>To ${max}</>}
            </>
          )}
        />
      )}

      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
        >
          Reset Filters
        </Button>
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// PropTypes

Toolbar.propTypes = {
  table: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};

Filters.propTypes = {
  table: PropTypes.object,
};
