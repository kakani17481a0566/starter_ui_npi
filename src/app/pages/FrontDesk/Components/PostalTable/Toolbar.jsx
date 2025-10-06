// src/app/pages/FrontDesk/Components/PostalTable/Toolbar.js

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
import { FacedtedFilter } from "components/shared/table/FacedtedFilter";
import { RangeFilter } from "components/shared/table/RangeFilter";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { postalStatusOptions } from "./data"; // ✅ new status options

// ----------------------------------------------------------------------

export function Toolbar({ table }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x) pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Postal Deliveries
          </h2>
        </div>

        {/* --- Action Buttons --- */}
        {isXs ? (
          <MobileMenu />
        ) : (
          <DesktopActions />
        )}
      </div>

      {/* --- Filters + Search --- */}
      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4  [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 ",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 ",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled
              ? "1.25rem"
              : "var(--margin-x)",
          }}
        >
          <div className="flex shrink-0 space-x-2 ">
            <SearchInput table={table} />
            <Filters table={table} />
          </div>
          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

/* -------------------- Sub Components -------------------- */

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
      placeholder="Search Parcel ID, Sender, Receiver..."
    />
  );
}

function Filters({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {/* Status Filter */}
      {table.getColumn("status") && (
        <FacedtedFilter
          options={postalStatusOptions}
          column={table.getColumn("status")}
          title="Status"
          Icon={MapPinIcon}
        />
      )}

      {/* Date Filter */}
      {table.getColumn("created_on") && (
        <DateFilter
          column={table.getColumn("created_on")}
          title="Delivery Date Range"
          config={{
            maxDate: new Date().fp_incr(1),
            mode: "range",
          }}
        />
      )}

      {/* Amount Filter */}
      {table.getColumn("amount") && (
        <RangeFilter
          column={table.getColumn("amount")}
          title="Amount"
          Icon={TbCurrencyDollar}
          MinPrefixIcon={TbCurrencyDollar}
          MaxPrefixIcon={TbCurrencyDollar}
          buttonText={({ min, max }) => (
            <>
              {min && <>From ₹{min}</>}
              {min && max && " - "}
              {max && <>To ₹{max}</>}
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

/* --- Desktop Action Buttons --- */
function DesktopActions() {
  return (
    <div className="flex space-x-2 ">
      <Button
        variant="outlined"
        className="h-8 space-x-2 rounded-md px-3 text-xs "
      >
        <PrinterIcon className="size-4" />
        <span>Print</span>
      </Button>

      <Menu as="div" className="relative inline-block whitespace-nowrap text-left">
        <MenuButton
          as={Button}
          variant="outlined"
          className="h-8 space-x-2 rounded-md px-3 text-xs "
        >
          <TbUpload className="size-4" />
          <span>Export</span>
          <ChevronUpDownIcon className="size-4" />
        </MenuButton>
        <Transition as={MenuItems} className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-700">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide",
                  focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                Export as PDF
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide",
                  focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                Export as CSV
              </button>
            )}
          </MenuItem>
        </Transition>
      </Menu>
    </div>
  );
}

/* --- Mobile Dropdown --- */
function MobileMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton as={Button} variant="flat" className="size-8 shrink-0 rounded-full p-0">
        <EllipsisHorizontalIcon className="size-4.5" />
      </MenuButton>
      <Transition
        as={MenuItems}
        className="absolute z-100 mt-1.5 min-w-[10rem] whitespace-nowrap rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-700"
      >
        <MenuItem>
          {({ focus }) => (
            <button className={clsx("flex h-9 w-full items-center px-3", focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100")}>
              Print
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button className={clsx("flex h-9 w-full items-center px-3", focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100")}>
              Export as PDF
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button className={clsx("flex h-9 w-full items-center px-3", focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100")}>
              Export as CSV
            </button>
          )}
        </MenuItem>
      </Transition>
    </Menu>
  );
}

Toolbar.propTypes = { table: PropTypes.object };
SearchInput.propTypes = { table: PropTypes.object };
Filters.propTypes = { table: PropTypes.object };
