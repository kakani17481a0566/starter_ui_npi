// src/app/pages/tables/InsertTimeTableTopics/index.jsx

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Button, Card, Table, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";
import { Toolbar } from "./Toolbar";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { generateTimeTableTopicsColumns } from "./columns";
import { fetchTimeTableTopicsStructuredData } from "./data";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { useThemeContext } from "app/contexts/theme/context";
import InsertTimeTableTopicForm from "app/pages/forms/InsertTimeTableTopicForm";
import UpdateTimeTableTopicForm from "app/pages/forms/InsertTimeTableTopicForm/UpdateTimeTableTopicForm";

const isSafari = getUserAgentBrowser() === "Safari";

export default function InsertTimeTableTopics() {
  const { cardSkin } = useThemeContext();
  const cardRef = useRef();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [topicData, setTopicData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-insert-timetabletopics", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-insert-timetabletopics", {});
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const loadData = useCallback(async () => {
    skipAutoResetPageIndex();
    setLoading(true);
    try {
      const { headers, data } = await fetchTimeTableTopicsStructuredData();
      setTopicData(data);
      if (data.length > 0) {
        setColumns(generateTimeTableTopicsColumns(headers, data[0]));
      }
    } finally {
      setLoading(false);
    }
  }, [skipAutoResetPageIndex]);

  useEffect(() => {
    console.log("📦 useEffect triggered → calling loadData()");
    loadData();
  }, [loadData]);

  const table = useReactTable({
    data: topicData,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
    },
    meta: {
      tableSettings,
      setTableSettings,
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setTopicData((old) => old.filter((r) => r.id !== row.original.id));
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const ids = rows.map((r) => r.original.id);
        setTopicData((old) => old.filter((r) => !ids.includes(r.id)));
      },
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    globalFilterFn: fuzzyFilter,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [topicData]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <>
      <div className="transition-content grid grid-cols-1 px-(--margin-x) py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Time Table Topics</h2>
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs"
            color="primary"
            onClick={() => {
              setSelectedRow(null);
              setIsFormOpen(true);
            }}
          >
            <PlusIcon className="size-5" />
            <span>New Time Table Topic</span>
          </Button>
        </div>

        <div
          className={clsx(
            "flex flex-col pt-4",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-61 h-full w-full bg-white dark:bg-dark-900 pt-3"
          )}
        >
          <Toolbar table={table} />
          <Card ref={cardRef} className="relative mt-3 flex grow flex-col">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner color="primary" className="size-10" />
              </div>
            ) : (
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold text-gray-800 dark:bg-dark-800 dark:text-dark-100",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            {header.column.getCanSort() ? (
                              <div
                                className="flex cursor-pointer items-center space-x-3"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                <TableSortIcon sorted={header.column.getIsSorted()} />
                              </div>
                            ) : (
                              flexRender(header.column.columnDef.header, header.getContext())
                            )}
                            {header.column.getCanFilter() ? (
                              <ColumnFilter column={header.column} />
                            ) : null}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.length === 0 ? (
                      <Tr>
                        <Td colSpan={columns.length} className="text-center py-10 text-gray-500">
                          No topics available.
                        </Td>
                      </Tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <Fragment key={row.id}>
                          <Tr
                            className={clsx(
                              "border-b border-gray-200 dark:border-dark-500 cursor-pointer",
                              row.getIsSelected() &&
                                !isSafari &&
                                "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:border-l-2 after:border-primary-500 after:bg-primary-500/10"
                            )}
                            onClick={() => {
                              setSelectedRow(row.original);
                              setIsFormOpen(true);
                            }}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <Td
                                key={cell.id}
                                className={clsx(
                                  "relative",
                                  cardSkin === "shadow-sm" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                                  cell.column.getCanPin() && [
                                    cell.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                                    cell.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                                  ]
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </Td>
                            ))}
                          </Tr>
                        </Fragment>
                      ))
                    )}
                  </TBody>
                </Table>
              </div>
            )}
            <SelectedRowsActions table={table} />
            <div className="px-4 pb-4 sm:px-5 sm:pt-4">
              <PaginationSection table={table} />
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-dark-800">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
                {selectedRow ? "Update Topic" : "Add New Topic"}
              </h3>
              <Button variant="outlined" size="icon-sm" onClick={() => setIsFormOpen(false)}>
                <XMarkIcon className="size-5" />
              </Button>
            </div>
            {selectedRow ? (
              <UpdateTimeTableTopicForm
                initialData={selectedRow}
                onSuccess={() => {
                  loadData();
                  setIsFormOpen(false);
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            ) : (
              <InsertTimeTableTopicForm
                onSuccess={() => {
                  loadData();
                  setIsFormOpen(false);
                }}
              />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
