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

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns"; // ✅ must match API fields
import { fetchEnquiryData } from "./data"; // ✅ API fetcher
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

export default function EnquiryTable() {
  const { cardSkin } = useThemeContext();

  const [enquiries, setEnquiries] = useState([]); // start empty
  const [loading, setLoading] = useState(true);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-enquiries-1",
    {},
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-enquiries-1",
    {},
  );

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  // ✅ Fetch data from API on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchEnquiryData();
      setEnquiries(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const table = useReactTable({
    data: enquiries,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setEnquiries((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setEnquiries((old) =>
          old.filter((oldRow) => oldRow.id !== row.original.id),
        );
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const rowIds = rows.map((row) => row.original.id);
        setEnquiries((old) => old.filter((row) => !rowIds.includes(row.id)));
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
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

  useDidUpdate(() => table.resetRowSelection(), [enquiries]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    return (
      <Page title="Student Enquiries">
        <p className="p-4">Loading enquiries...</p>
      </Page>
    );
  }

  return (
    <Page title="Student Enquiries">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "dark:bg-dark-900 fixed inset-0 z-61 bg-white pt-3",
          )}
        >
          <Toolbar table={table} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)",
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
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
                              "text-xs-plus dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold tracking-wide text-gray-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                  "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                  "sticky z-2 ltr:right-0 rtl:left-0",
                              ],
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
                                        header.getContext(),
                                      )}
                                </span>
                                <TableSortIcon
                                  sorted={header.column.getIsSorted()}
                                />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
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
                        className={clsx(
                          "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200",
                          row.getIsSelected() &&
                            !isSafari &&
                            "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent",
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
                              ],
                            )}
                          >
                            {cell.column.getIsPinned() && (
                              <div
                                className={clsx(
                                  "dark:border-dark-500 pointer-events-none absolute inset-0 border-gray-200",
                                  cell.column.getIsPinned() === "left"
                                    ? "ltr:border-r rtl:border-l"
                                    : "ltr:border-l rtl:border-r",
                                )}
                              ></div>
                            )}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
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
                    ) && "pt-4",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
