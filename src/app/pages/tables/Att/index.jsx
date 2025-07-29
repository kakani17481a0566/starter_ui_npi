import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import clsx from "clsx";

import { fetchAttendanceSummary } from "./data";
import { generateAttendanceColumns } from "./columns";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { Card, Table, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";
import { AttendanceHeaderBox } from "./VerticalWithoutText";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";

function SubRowComponent({ row }) {
  const { parentName, mobileNumber, alternateNumber } = row.original;
  return (
    <div className="space-y-1 p-4 text-sm">
      <p><strong>Parent:</strong> {parentName}</p>
      <p><strong>Mobile:</strong> {mobileNumber}</p>
      <p><strong>Alternate:</strong> {alternateNumber}</p>
    </div>
  );
}

export default function AttendanceTable() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const tenantId = 1;

  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-attendance", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-attendance", {});
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const formattedDate = useMemo(() => new Date(today).toLocaleDateString("en-GB"), [today]);
  const className = useMemo(() => data[0]?.className || "-", [data]);
  const checkedInCount = useMemo(() => data.filter(d => d.attendanceStatus === "Checked-In").length, [data]);
  const checkedOutCount = useMemo(() => data.filter(d => d.attendanceStatus === "Checked-Out").length, [data]);

  const cardRef = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAttendanceSummary({ date: today, tenantId });
      setData(response.data);
      const allowedHeaders = ["studentId", "studentName", "attendanceStatus", "className"];
      const filteredHeaders = response.headers.filter((h) => allowedHeaders.includes(h));
      setColumns(generateAttendanceColumns(filteredHeaders));
    } catch (err) {
      console.error("❌ Failed to fetch attendance data", err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, pagination, columnVisibility, columnPinning, tableSettings },
    onPaginationChange: setPagination,
    meta: { setTableSettings, fetchData },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    enableRowSelection: true,
    getRowCanSelect: (row) => row.original.attendanceStatus !== "Checked-Out",
    getRowCanExpand: () => true,
    autoResetPageIndex: false,
  });

  useDidUpdate(() => table.resetRowSelection(), [data]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="col-span-12">
      <AttendanceHeaderBox
        date={formattedDate}
        className={className}
        checkedIn={checkedInCount}
        checkedOut={checkedOutCount}
      />

      <div className={clsx("flex flex-col", tableSettings.enableFullScreen && "dark:bg-dark-900 fixed inset-0 z-61 bg-white pt-3")}>
        <Toolbar table={table} />

        <Card className={clsx("relative mt-3 flex grow flex-col", tableSettings.enableFullScreen ? "overflow-hidden" : "overflow-visible")} ref={cardRef}>
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[720px] md:min-w-full">
              <Table
                hoverable
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="w-full text-left text-xs sm:text-sm md:text-base rtl:text-right"
              >
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          className="dark:bg-dark-800 bg-neutral-100 px-2 py-3 text-xs font-semibold text-gray-700 sm:text-sm dark:text-gray-200"
                        >
                          {header.column.getCanSort() ? (
                            <div className="flex cursor-pointer items-center space-x-3" onClick={header.column.getToggleSortingHandler()}>
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              <TableSortIcon sorted={header.column.getIsSorted()} />
                            </div>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                          {header.column.getCanFilter() && <ColumnFilter column={header.column} />}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </THead>
                <TBody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={columns.length} className="py-10 text-center text-gray-500 dark:text-dark-300">
                        <Spinner color="primary" className="size-10 border-4 mx-auto" />
                        <div className="mt-2 text-sm">Loading attendance data…</div>
                      </Td>
                    </Tr>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length} className="py-10 text-center text-sm text-gray-500 dark:text-dark-300">
                        No attendance records found.
                      </Td>
                    </Tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <Tr className="dark:hover:bg-dark-700 dark:border-dark-500 border-b border-neutral-200 hover:bg-neutral-100">
                          {row.getVisibleCells().map((cell) => (
                            <Td key={cell.id} className="px-2 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          ))}
                        </Tr>
                        {row.getIsExpanded() && (
                          <tr>
                            <td colSpan={row.getVisibleCells().length}>
                              <SubRowComponent row={row} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </TBody>
              </Table>
            </div>
          </div>

          <SelectedRowsActions table={table} className="mt-4" />

          <div className="mt-4 flex w-full flex-col items-center justify-between gap-4 px-4 pb-4 sm:flex-row">
            <div className="dark:text-dark-300 text-sm text-gray-600">
              Showing{" "}
              {table.getRowModel().rows.length > 0
                ? `${pagination.pageIndex * pagination.pageSize + 1} - ${
                    pagination.pageIndex * pagination.pageSize + table.getRowModel().rows.length
                  }`
                : "0"}{" "}
              of {table.getCoreRowModel().rows.length} entries
            </div>

            <div className="mt-2 flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-primary-600 dark:bg-dark-700  dark:hover:bg-dark-600 flex w-full items-center justify-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 sm:w-auto"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-primary-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex w-full items-center justify-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 sm:w-auto"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
