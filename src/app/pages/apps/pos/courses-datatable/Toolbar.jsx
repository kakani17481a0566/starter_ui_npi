// Import Dependencies
import {
  CheckCircleIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { TbCurrencyDollar, TbUpload } from "react-icons/tb";
import clsx from "clsx";
import { Menu, MenuButton } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Local Imports
import { FacedtedFilter } from "components/shared/table/FacedtedFilter"; // ✅ check if typo
import { RangeFilter } from "components/shared/table/RangeFilter";
import { FilterSelector } from "components/shared/table/FilterSelector";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { courseStatusOptions, filtersOptions, sizeOptions } from "./data";

// ----------------------------------------------------------------------

export function Toolbar({ table }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      {/* Header + Actions */}
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x) pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Items
          </h2>
        </div>

        {/* Mobile vs Desktop Menus */}
        {isXs ? <MobileMenu /> : <DesktopMenu />}
      </div>

      {/* Filters */}
      {isXs ? (
        <>
          <div
            className={clsx(
              "flex gap-2 pt-4 [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 gap-2 overflow-x-auto pb-1 pt-4",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between gap-4 overflow-x-auto pb-1 pt-4",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled
              ? "1.25rem"
              : "var(--margin-x)",
          }}
        >
          <div className="flex shrink-0 gap-2">
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
// Search Input

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      placeholder="Search Course, Category..."
      classNames={{
        root: "shrink-0",
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
      }}
    />
  );
}

// ----------------------------------------------------------------------
// Filters — synced with data.js

function Filters({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const toolbarFilters = table.getState().toolbarFilters;

  return (
    <>
      {/* Status filter */}
      {toolbarFilters.includes("status") && table.getColumn("status") && (
        <div style={{ order: toolbarFilters.indexOf("status") + 1 }}>
          <FacedtedFilter
            options={courseStatusOptions}
            column={table.getColumn("status")}
            title="Status"
            Icon={CheckCircleIcon}
          />
        </div>
      )}

      {/* Size filter */}
      {toolbarFilters.includes("size") && table.getColumn("size") && (
        <div style={{ order: toolbarFilters.indexOf("size") + 1 }}>
          <FacedtedFilter
            options={sizeOptions}
            column={table.getColumn("size")}
            title="Size"
          />
        </div>
      )}

      {/* Lesson count filter */}
      {toolbarFilters.includes("lesson_count") &&
        table.getColumn("lesson_count") && (
          <div style={{ order: toolbarFilters.indexOf("lesson_count") + 1 }}>
            <RangeFilter
              column={table.getColumn("lesson_count")}
              title="Lesson Count"
              buttonText={({ min, max }) => (
                <>
                  {min && <>From {min} lessons</>}
                  {min && max && " - "}
                  {max && <>To {max} lessons</>}
                </>
              )}
            />
          </div>
        )}

      {/* Price filter */}
      {toolbarFilters.includes("price") && table.getColumn("price") && (
        <div style={{ order: toolbarFilters.indexOf("price") + 1 }}>
          <RangeFilter
            column={table.getColumn("price")}
            title="Price"
            buttonText={({ min, max }) => (
              <>
                {min && <>From ${min}</>}
                {min && max && " - "}
                {max && <>To ${max}</>}
              </>
            )}
            Icon={TbCurrencyDollar}
            MinPrefixIcon={TbCurrencyDollar}
            MaxPrefixIcon={TbCurrencyDollar}
          />
        </div>
      )}

      {/* Filter selector */}
      <div style={{ order: toolbarFilters.length + 1 }}>
        <FilterSelector options={filtersOptions} table={table} />
      </div>

      {/* Reset filters */}
      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
          style={{ order: toolbarFilters.length + 2 }}
        >
          Reset Filters
        </Button>
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// Menus (mobile & desktop)

function MobileMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </MenuButton>
      {/* Add <MenuItems> here later if needed */}
    </Menu>
  );
}

function DesktopMenu() {
  return (
    <div className="flex gap-2">
      <Button variant="outlined" className="h-8 gap-2 rounded-md px-3 text-xs">
        <PrinterIcon className="size-4" />
        <span>Print</span>
      </Button>
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
          as={Button}
          variant="outlined"
          className="h-8 gap-2 rounded-md px-3 text-xs"
        >
          <TbUpload className="size-4" />
          <span>Export</span>
          <ChevronUpDownIcon className="size-4" />
        </MenuButton>
        {/* Add <MenuItems> here later if needed */}
      </Menu>
    </div>
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
