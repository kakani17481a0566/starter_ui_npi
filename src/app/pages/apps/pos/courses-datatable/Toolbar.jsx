// ----------------------------------------------------------------------
// Import Dependencies
// ----------------------------------------------------------------------
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  EllipsisHorizontalIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Menu, MenuButton } from "@headlessui/react";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------
// Local Imports
// ----------------------------------------------------------------------
import { FacedtedFilter } from "components/shared/table/FacedtedFilter";
import { RangeFilter } from "components/shared/table/RangeFilter";
import { FilterSelector } from "components/shared/table/FilterSelector";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { filtersOptions } from "./data";

// ----------------------------------------------------------------------
// Toolbar Component
// ----------------------------------------------------------------------
export function Toolbar({ table, dropdowns }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      {/* Header + Actions */}
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-4 pt-4"
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Items
          </h2>
        </div>
        {isXs ? <MobileMenu /> : <DesktopMenu />}
      </div>

      {/* Filters & Search */}
      {isXs ? (
        <>
          {/* 🔍 Search & Table Config (mobile) */}
          <div
            className={clsx(
              "flex gap-2 pt-4 [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-4"
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>

          {/* 🔽 Filters (mobile scrollable row) */}
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 gap-2 overflow-x-auto pb-2 pt-4",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-4"
            )}
          >
            <Filters table={table} dropdowns={dropdowns} />
          </div>
        </>
      ) : (
        /* 💻 Desktop layout */
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between gap-4 overflow-x-auto pb-2 pt-4",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-4"
          )}
        >
          <div className="flex shrink-0 gap-2 items-center">
            <SearchInput table={table} />
            <Filters table={table} dropdowns={dropdowns} />
          </div>
          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Search Input
// ----------------------------------------------------------------------
function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter ?? ""}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      placeholder="Search Item, Category..."
      classNames={{
        root: "flex-1 min-w-[160px]",
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
      }}
    />
  );
}

// ----------------------------------------------------------------------
// Filters (Dynamic from dropdowns)
// ----------------------------------------------------------------------
function Filters({ table, dropdowns }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const toolbarFilters = table.getState().toolbarFilters || [];

  const selectOptionsMap = {
    status: dropdowns?.statusOptions ?? [],
    size: dropdowns?.sizeOptions ?? [],
    category: dropdowns?.categoryOptions ?? [],
  };

  const iconMap = {
    status: CheckCircleIcon,
    size: undefined,
    category: TagIcon,
  };

  return (
    <>
      {toolbarFilters.map((colId, i) => {
        const column = table.getColumn(colId);
        if (!column) return null;

        const filterType = column.columnDef.filter;

        switch (filterType) {
          case "searchableSelect":
            return (
              <div key={colId} style={{ order: i + 1 }}>
                <FacedtedFilter
                  options={selectOptionsMap[colId] || []}
                  column={column}
                  title={column.columnDef.label}
                  Icon={iconMap[colId]}
                />
              </div>
            );

          case "numberRange":
            return (
              <div key={colId} style={{ order: i + 1 }}>
                <RangeFilter
                  column={column}
                  title={column.columnDef.label}
                  Icon={colId === "price" ? CurrencyDollarIcon : undefined}
                  MinPrefixIcon={
                    colId === "price" ? CurrencyDollarIcon : undefined
                  }
                  MaxPrefixIcon={
                    colId === "price" ? CurrencyDollarIcon : undefined
                  }
                />
              </div>
            );

          default:
            return null;
        }
      })}

      {/* Filter Selector */}
      <div style={{ order: toolbarFilters.length + 1 }}>
        <FilterSelector options={filtersOptions} table={table} />
      </div>

      {/* Reset Filters */}
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
// Mobile & Desktop Menus
// ----------------------------------------------------------------------
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
    </Menu>
  );
}

function DesktopMenu() {
  return <div className="flex gap-2" />;
}

// ----------------------------------------------------------------------
// PropTypes
// ----------------------------------------------------------------------
Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  dropdowns: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object.isRequired,
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
  dropdowns: PropTypes.object,
};
