// ----------------------------------------------------------------------
// Import Dependencies
// ----------------------------------------------------------------------
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------
// Local Imports
// ----------------------------------------------------------------------
import { Table, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { fetchItemsData } from "./data";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";

// ----------------------------------------------------------------------
// Loading Component
// ----------------------------------------------------------------------
const Default = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner className="text-primary-900 w-12 h-12" />
  </div>
);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function CoursesDatatable({ categoryId, onRowClick }) {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [dropdowns, setDropdowns] = useState({});
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------
  // 1️⃣ Fetch Items + Filters from API
  // ----------------------------------------------------------------------
  useEffect(() => {
    const loadItems = async () => {
      try {
        const { items, dropdowns } = await fetchItemsData();
        setAllItems(items);
        setDropdowns(dropdowns);
      } catch (error) {
        console.error("❌ Error loading items:", error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  // ----------------------------------------------------------------------
  // 2️⃣ Filter by Category (if categoryId provided)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (categoryId) {
      setItems(
        allItems.filter((item) => String(item.categoryId) === String(categoryId))
      );
    } else {
      setItems(allItems);
    }
  }, [categoryId, allItems]);

  // ----------------------------------------------------------------------
  // 3️⃣ Table State Configurations
  // ----------------------------------------------------------------------
  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: true,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [toolbarFilters, setToolbarFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-items",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-items",
    {}
  );

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  // ----------------------------------------------------------------------
  // 4️⃣ Table Initialization
  // ----------------------------------------------------------------------
  const table = useReactTable({
    data: items,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
      toolbarFilters,
    },
    meta: {
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setItems((old) => old.filter((r) => r.id !== row.original.id));
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const ids = new Set(rows.map((r) => r.original.id));
        setItems((old) => old.filter((r) => !ids.has(r.id)));
      },
      setTableSettings,
      setToolbarFilters,
    },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  // ----------------------------------------------------------------------
  // 5️⃣ Hooks: Reset & Scroll Lock
  // ----------------------------------------------------------------------
  useDidUpdate(() => table.resetRowSelection(), [items]);
  useLockScrollbar(tableSettings.enableFullScreen);

  // ----------------------------------------------------------------------
  // 6️⃣ Handle Row Click (Add to Basket)
  // ----------------------------------------------------------------------
  const handleItemClick = (item) => {
    onRowClick?.(item);
  };

  // ----------------------------------------------------------------------
  // 7️⃣ Render
  // ----------------------------------------------------------------------
  if (loading) return <Default />;
  const hasRows = table.getCoreRowModel().rows.length > 0;

  return (
    <Page title="Items">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar table={table} dropdowns={dropdowns} />

          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen && "overflow-hidden"
            )}
          >
            <div className="table-wrapper min-w-full grow overflow-x-auto border border-gray-200 dark:border-dark-700 rounded-lg shadow-sm">
              <Table
                hoverable
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="w-full text-left rtl:text-right"
              >
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers
                        .filter(
                          (header) => !header.column.columnDef.isHiddenColumn
                        )
                        .map((header) => {
                          const canSort = header.column.getCanSort();
                          return (
                            <Th
                              key={header.id}
                              className={clsx(
                                "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                                header.column.getCanPin() && [
                                  header.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                  header.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                ]
                              )}
                            >
                              {canSort ? (
                                <div
                                  className="flex cursor-pointer select-none items-center space-x-3"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  <span className="flex-1">
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </span>
                                  <TableSortIcon
                                    sorted={header.column.getIsSorted()}
                                  />
                                </div>
                              ) : header.isPlaceholder ? null : (
                                flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )
                              )}
                            </Th>
                          );
                        })}
                    </Tr>
                  ))}
                </THead>

                <TBody>
                  {hasRows ? (
                    table.getRowModel().rows.map((row) => {
                      const item = row.original;
                      return (
                        <Tr
                          key={row.id}
                          onClick={() => handleItemClick(item)}
                          className="relative cursor-pointer border-y border-transparent border-b-gray-200 hover:bg-gray-50 dark:border-b-dark-500 dark:hover:bg-dark-600"
                        >
                          {row
                            .getVisibleCells()
                            .filter(
                              (cell) => !cell.column.columnDef.isHiddenColumn
                            )
                            .map((cell) => (
                              <Td key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            ))}
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Td
                        colSpan={columns.length}
                        className="py-8 text-center text-sm text-gray-500 dark:text-dark-400"
                      >
                        No items found
                      </Td>
                    </Tr>
                  )}
                </TBody>
              </Table>
            </div>

            <SelectedRowsActions table={table} />

            {hasRows && (
              <div
                className={clsx(
                  "px-4 pb-4 sm:px-5 sm:pt-4 mt-3 bg-gray-50 dark:bg-dark-800 rounded-b-lg",
                  !(table.getIsSomeRowsSelected() ||
                    table.getIsAllRowsSelected()) && "pt-4"
                )}
              >
                <PaginationSection table={table} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

// ----------------------------------------------------------------------
// PropTypes
// ----------------------------------------------------------------------
CoursesDatatable.propTypes = {
  categoryId: PropTypes.number,
  onRowClick: PropTypes.func,
};
