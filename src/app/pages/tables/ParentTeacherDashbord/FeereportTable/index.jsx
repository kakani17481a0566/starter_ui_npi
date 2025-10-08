// src/app/pages/tables/ParentTeacherDashboard/FeereportTable/FeereportTable.jsx

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
import { useEffect, useState } from "react";

// Heroicons
import {
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { fetchFeeReport } from "./data";
import { FeeTransactionsDrawer } from "./FeeTransactionsDrawer";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

export default function FeereportTable() {
  const { cardSkin } = useThemeContext();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);

  // 🔹 Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  // 🔹 Fetch fee report data
  useEffect(() => {
    const loadItems = async () => {
      try {
        const result = await fetchFeeReport(1, 374); // tenantId=1, studentId=374
        if (result) {
          setSummary(result);
          setTransactions(result.transactions || []);
        }
      } catch (error) {
        console.error("❌ Error fetching fee report", error);
      }
    };
    loadItems();
  }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-fee-1",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-fee-1",
    {}
  );

  const [autoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: { setTableSettings },
    filterFns: { fuzzy: fuzzyFilter },
    enableSorting: true,
    enableColumnFilters: true,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [transactions]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <Page title={`Fee Report - ${summary?.studentName || ""}`}>
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "dark:bg-dark-900 fixed inset-0 z-61 bg-white pt-3"
          )}
        >
          <Toolbar table={table} />

          {/* 🔹 Summary Cards above the table */}
          {summary && (
            <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-3 sm:grid-cols-3 sm:gap-5 sm:px-5">
              <Card className="flex justify-between p-5">
                <div>
                  <div className="flex items-center gap-1">
                    <CurrencyDollarIcon className="text-primary-500 size-5" />
                    <p className="font-bold">Total Fee</p>
                  </div>
                  <p className="mt-0.5 text-2xl font-medium text-gray-800 dark:text-dark-100">
                    ₹{summary.totalFee.toLocaleString("en-IN")}
                  </p>
                </div>
              </Card>

              <Card className="flex justify-between p-5">
                <div>
                  <div className="flex items-center gap-1">
                    <ArrowDownTrayIcon className="text-green-600 size-5" />
                    <p className="font-bold">Paid</p>
                  </div>
                  <p className="mt-0.5 text-2xl font-medium text-green-600">
                    ₹{summary.totalPaid.toLocaleString("en-IN")}
                  </p>
                </div>
              </Card>

              <Card className="flex justify-between p-5">
                <div>
                  <div className="flex items-center gap-1">
                    <ArrowUpTrayIcon className="text-red-600 size-5" />
                    <p className="font-bold">Pending</p>
                  </div>
                  <p className="mt-0.5 text-2xl font-medium text-red-500">
                    ₹{summary.pendingFee.toLocaleString("en-IN")}
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* 🔹 Table */}
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
                              "bg-gray-200 text-xs font-medium uppercase tracking-wide text-gray-700 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
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
                                className="flex cursor-pointer items-center space-x-2 select-none"
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
                    {table.getRowModel().rows.map((row) => (
                      <Tr
                        key={row.id}
                        onClick={() => setDrawerOpen(true)} // open drawer
                        className={clsx(
                          "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-600",
                          row.getIsSelected() &&
                            !isSafari &&
                            "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent"
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
                            {cell.column.getIsPinned() && (
                              <div
                                className={clsx(
                                  "dark:border-dark-500 pointer-events-none absolute inset-0 border-gray-200",
                                  cell.column.getIsPinned() === "left"
                                    ? "ltr:border-r rtl:border-l"
                                    : "ltr:border-l rtl:border-r"
                                )}
                              ></div>
                            )}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </div>

              <SelectedRowsActions table={table} />

              {table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                      "dark:bg-dark-800 bg-gray-50",
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

      {/* 🔹 Drawer */}
      <FeeTransactionsDrawer
        isOpen={drawerOpen}
        close={() => setDrawerOpen(false)}
        summary={summary}
      />
    </Page>
  );
}
