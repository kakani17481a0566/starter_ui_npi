// src/app/pages/dashboards/teacher/WeekTimeTable/index.jsx

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { SelectedRowsActions } from "components/shared/table/SelectedRowsActions";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useBoxSize, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { PaginationSection } from "./PaginationSection";
import { MenuAction } from "./MenuActions";
import { fetchWeekTimeTableData } from "./weektimetabledata";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { generateColumns } from "./columns";

const isSafari = getUserAgentBrowser() === "Safari";

export function WeekTimeTable({ courseId }) {
  const [autoResetPageIndex] = useSkipper();
  const theadRef = useRef();
  const { height: theadHeight } = useBoxSize({ ref: theadRef });

  const [media, setMedia] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Received courseId:", courseId);
    if (!courseId) return;

    setLoading(true);
    fetchWeekTimeTableData(courseId)
      .then((data) => {
        // 🔹 Dynamically map row columns based on headers length
        const trimmed = data.timeTableData.map((row) => {
          const mapped = {};
          data.headers.forEach((_, idx) => {
            mapped[`column${idx + 1}`] = row[`column${idx + 1}`];
          });
          mapped.timeTableId = row.timeTableId;
          return mapped;
        });

        setMedia(trimmed);
        setHeaders(data.headers);
        console.log("📦 Auto headers:", data.headers);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const columns = useMemo(() => generateColumns(headers), [headers]);

  const table = useReactTable({
    data: media,
    columns,
    state: { globalFilter, sorting },
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // ✅ Show 7 rows per page
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  useDidUpdate(() => table.resetRowSelection(), [media.length]);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      {/* Toolbar */}
      <div className="table-toolbar flex items-center justify-between">
        <h2 className="dark:text-dark-100 truncate text-base font-medium tracking-wide text-gray-800">
          Weekly Timetable
        </h2>
        <div className="flex">
          <CollapsibleSearch
            placeholder="Search here..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <MenuAction />
        </div>
      </div>

      {/* Table Container */}
      <Card className="relative mt-3 flex min-h-[200px] items-center justify-center">
        {loading ? (
          <div className="dark:text-dark-300 flex flex-col items-center gap-2 text-sm text-gray-600">
            <div className="border-primary-500 h-6 w-6 animate-spin rounded-full border-4 border-dashed" />
            Loading timetable...
          </div>
        ) : (
          <div className="table-wrapper w-full min-w-full overflow-x-auto">
            <Table hoverable className="w-full text-left rtl:text-right">
              <THead ref={theadRef}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isDayCol = header.column.id === "days";
                      return (
                        <Th
                          key={header.id}
                          className={clsx(
                            "text-center text-xs font-semibold uppercase",
                            isDayCol ? "text-primary-950" : "text-white"
                          )}
                          style={{
                            backgroundColor: isDayCol ? "#93E6E6" : "#33CDCD",
                            borderBottom: "none",
                            borderRight: "1px solid #2BBBAD",
                            transform: isDayCol ? "translateY(-1px)" : undefined,
                            boxShadow: isDayCol
                              ? "0px 4px 10px rgba(0,0,0,0.35), inset -2px 0 4px rgba(255,255,255,0.2), 1px 0 0 #2BBBAD"
                              : undefined,
                            zIndex: 2,
                            position: isDayCol ? "sticky" : "relative",
                            left: isDayCol ? 0 : undefined,
                            backgroundClip: "padding-box",
                          }}
                        >
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer items-center space-x-3 select-none"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="flex-1">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </span>
                              <TableSortIcon sorted={header.column.getIsSorted()} />
                            </div>
                          ) : (
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
                {table.getRowModel().rows.map((row) => (
                  <Tr
                    key={row.id}
                    className={clsx(
                      "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200",
                      row.getIsSelected() &&
                        !isSafari &&
                        "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isDayCol = cell.column.id === "days";
                      return (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "border-r px-2 py-2 text-center text-sm",
                            isDayCol
                              ? "bg-[#93E6E6] text-gray-900"
                              : "bg-white text-gray-900"
                          )}
                          style={{
                            borderRight: "1px solid #2BBBAD",
                            position: isDayCol ? "sticky" : "relative",
                            left: isDayCol ? 0 : undefined,
                            transform: isDayCol ? "translateY(-1px)" : undefined,
                            zIndex: isDayCol ? 1 : "auto",
                            backgroundClip: "padding-box",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                ))}
              </TBody>
            </Table>

            {table.getCoreRowModel().rows.length > 0 && (
              <div className="p-4 sm:px-5">
                <PaginationSection table={table} />
              </div>
            )}

            <SelectedRowsActions table={table} height={theadHeight} />
          </div>
        )}
      </Card>
    </div>
  );
}
