// src/app/pages/dashboards/teacher/WeekTimeTable/index.jsx

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";

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

// 🎨 Subject background colors
const subjectColors = {
  CLL: "rgba(147,197,253,0.5)", // Blue 300 @70% opacity
  PSRN: "rgba(252,165,165,0.5)", // Red 300 @70%
  KUW: "rgba(252,211,77,0.5)", // Amber 300 @70%
  PD: "rgba(110,231,183,0.5)", // Emerald 300 @70%
  EAD: "rgba(196,181,253,0.5)", // Violet 300 @70%
  PSED: "rgba(249,168,212,0.5)", // Pink 300 @70%
};

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
        // console.log("data in week time table is",data.timeTableData);
       const trimmed = data.timeTableData.map(row => {
  const mapped = {};

  // copy all columnN keys present in the row (column1, column2, ..., column12, etc.)
  Object.keys(row)
    .filter(k => /^column\d+$/.test(k))
    .sort((a, b) => {
      const na = parseInt(a.slice(6), 10);
      const nb = parseInt(b.slice(6), 10);
      return na - nb;
    })
    .forEach(k => {
      mapped[k] = row[k];
    });

  // preserve other useful fields
  if (row.timeTableId !== undefined) mapped.timeTableId = row.timeTableId;
  if (row.assessmentStausCodeId !== undefined) mapped.assessmentStausCodeId = row.assessmentStausCodeId; // note: key name preserved as you provided it
  mapped.courseId = courseId;

  // optional: if column9 is newline-separated URLs, convert to array
  if (mapped.column9 && typeof mapped.column9 === 'string' && mapped.column9.includes('\n')) {
    mapped.column9 = mapped.column9
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  }

  return mapped;
});

        setMedia(trimmed);
        setHeaders(data.headers);
        // console.log("📦 Auto headers:", data.headers);
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
    initialState: { pagination: { pageSize: 5 } },
  });
  console.log("data in week is ",media);
  useDidUpdate(() => table.resetRowSelection(), [media.length]);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      {/* Toolbar */}
      <div className="table-toolbar flex items-center justify-between">
        {/* Left side heading with icon */}
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="text-primary-600 dark:text-dark-100 h-5 w-5" />
          <h2 className="dark:text-dark-100 text-primary-950 truncate text-base font-medium tracking-wide">
            Weekly Timetable
          </h2>
        </div>

        {/* Right side search and menu */}
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
                {table.getHeaderGroups().map((headerGroup, rowIdx) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, colIdx) => {
                      const isDayCol = header.column.id === "days";
                      const subjectKey =
                        header.column.columnDef.meta?.subjectKey;
                      const bgColor = isDayCol
                        ? "#93E6E6" // Days column color
                        : subjectColors[subjectKey] || "#33CDCD";

                      // ✅ Detect top-left (0,0) intersection
                      const isTopLeftCell = rowIdx === 0 && colIdx === 0;

                      return (
                        <Th
                          key={header.id}
                          className="text-center text-xs font-semibold uppercase"
                          style={{
                            // ✅ Keep color for (0,0)
                            backgroundColor: bgColor,
                            borderBottom: "none",
                            borderRight: "1px solid #2BBBAD",
                            transform: isDayCol
                              ? "translateY(-1px)"
                              : undefined,

                            // ✅ Apply shadow only for left sticky col (not top)
                            boxShadow: isDayCol
                              ? "0px 4px 10px rgba(0,0,0,0.35), inset -2px 0 4px rgba(255,255,255,0.2), 1px 0 0 #2BBBAD"
                              : undefined,

                            // ✅ Sticky positioning
                            position:
                              isDayCol || rowIdx === 0 ? "sticky" : "relative",
                            left: isDayCol ? 0 : undefined,
                            top: rowIdx === 0 ? 0 : undefined,

                            // ✅ Proper z-index stacking
                            // (0,0) cell sits highest to avoid double layering
                            zIndex: isTopLeftCell ? 10 : isDayCol ? 5 : 4,

                            // ✅ Prevent overlap background flicker
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
                                  header.getContext(),
                                )}
                              </span>
                              <TableSortIcon
                                sorted={header.column.getIsSorted()}
                              />
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
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
                      "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isDayCol = cell.column.id === "days";
                      const subjectKey = cell.column.columnDef.meta?.subjectKey;
                      const bgColor = isDayCol
                        ? "#93E6E6"
                        : subjectColors[subjectKey] || "white";

                      return (
                        <Td
                          key={cell.id}
                          className="border-r px-2 py-2 text-center text-sm"
                          style={{
                            backgroundColor: bgColor,
                            borderRight: "1px solid #2BBBAD",
                            position: isDayCol ? "sticky" : "relative",
                            left: isDayCol ? 0 : undefined,
                            transform: isDayCol
                              ? "translateY(-1px)"
                              : undefined,
                            zIndex: isDayCol ? 1 : "auto",
                            backgroundClip: "padding-box",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
