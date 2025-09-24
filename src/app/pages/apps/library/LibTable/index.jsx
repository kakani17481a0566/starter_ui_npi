// LibTable.jsx

// Import Dependencies
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
import { useState, useEffect } from "react";

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { libraryList } from "./data";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

export default function LibTable({ selectedCategory, onAddToBasket }) {
  const { cardSkin } = useThemeContext();

  const [books, setBooks] = useState([...libraryList]);

  // 🔹 Filter books based on selected category
  useEffect(() => {
    if (!selectedCategory || selectedCategory === "All") {
      setBooks(libraryList);
    } else {
      setBooks(libraryList.filter((book) => book.category === selectedCategory));
    }
  }, [selectedCategory]);

  const [tableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-library-1",
    {}
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-library-1",
    {}
  );

  const [autoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: books,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [books]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="transition-content w-full pb-5">
      <div
        className={clsx(
          "flex h-full w-full flex-col",
          tableSettings.enableFullScreen &&
            "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900"
        )}
      >
        <Toolbar table={table} />
        <div
          className={clsx(
            "transition-content flex grow flex-col pt-3",
            tableSettings.enableFullScreen
              ? "overflow-hidden"
              : "px-(--margin-x)"
          )}
        >
          <Card
            className={clsx(
              "relative flex grow flex-col",
              tableSettings.enableFullScreen && "overflow-hidden"
            )}
          >
            <div className="table-wrapper min-w-full grow overflow-x-auto">
              <Table
                hoverable
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="w-full text-left rtl:text-right"
              >
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          className={clsx(
                            "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100",
                            header.column.getCanPin() && [
                              header.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                              header.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                            ]
                          )}
                        >
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer select-none items-center space-x-3 "
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
                      ))}
                    </Tr>
                  ))}
                </THead>
                <TBody>
                  {table.getRowModel().rows.map((row) => {
                    const book = row.original; // ✅ raw book data
                    return (
                      <Tr
                        key={row.id}
                        onClick={() => onAddToBasket?.(book)} // ✅ add to basket on click
                        className={clsx(
                          "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500 cursor-pointer hover:bg-primary-50 dark:hover:bg-dark-600",
                          row.getIsSelected() &&
                            !isSafari &&
                            "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            className={clsx(
                              "relative bg-white",
                              cardSkin === "shadow-sm"
                                ? "dark:bg-dark-700"
                                : "dark:bg-dark-900",
                              cell.column.getCanPin() && [
                                cell.column.getIsPinned() === "left" &&
                                  "sticky z-2 ltr:left-0 rtl:right-0",
                                cell.column.getIsPinned() === "right" &&
                                  "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            </div>
            <SelectedRowsActions table={table} />
            {table.getCoreRowModel().rows.length && (
              <div
                className={clsx(
                  "px-4 pb-4 sm:px-5 sm:pt-4",
                  tableSettings.enableFullScreen &&
                    "bg-gray-50 dark:bg-dark-800",
                  !(
                    table.getIsSomeRowsSelected() ||
                    table.getIsAllRowsSelected()
                  ) && "pt-4"
                )}
              >
                <PaginationSection table={table} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
