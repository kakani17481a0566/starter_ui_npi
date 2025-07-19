import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { SelectedRowsActions } from "components/shared/table/SelectedRowsActions";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useBoxSize, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { PaginationSection } from "./PaginationSection";
import { MenuAction } from "./MenuActions";
import { columns } from "./columns";
import { fetchWeekTimeTableData } from "./weektimetabledata";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

const isSafari = getUserAgentBrowser() === "Safari";

export function WeekTimeTable({ courseId }) {
  const [autoResetPageIndex] = useSkipper();
  const theadRef = useRef();
  const { height: theadHeight } = useBoxSize({ ref: theadRef });

  const [media, setMedia] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch timetable based on courseId
  useEffect(() => {
  console.log("Received courseId:", courseId); // ✅ Add this
  if (!courseId) return;

  setLoading(true);
  fetchWeekTimeTableData(courseId)
    .then((data) => {
      const trimmed = data.timeTableData.map((row) => ({
        column1: row.column1,
        column2: row.column2,
        column3: row.column3,
        column4: row.column4,
        column5: row.column5,
        column6: row.column6,
        column7: row.column7,
      }));
      setMedia(trimmed);
    })
    .finally(() => setLoading(false));
}, [courseId]);


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
  });

  useDidUpdate(() => table.resetRowSelection(), [media.length]);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
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
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        className={clsx(
                          "text-center text-xs font-semibold uppercase",
                          header.column.id === "week"
                            ? "text-primary-950"
                            : "text-white"
                        )}
                        style={{
                          backgroundColor:
                            header.column.id === "week" ? "#93E6E6" : "#33CDCD",
                          borderBottom: "none",
                          borderRight: "1px solid #2BBBAD",
                          transform:
                            header.column.id === "week" ? "translateY(-1px)" : undefined,
                          boxShadow:
                            header.column.id === "week"
                              ? "0px 4px 10px rgba(0,0,0,0.35), inset -2px 0 4px rgba(255,255,255,0.2), 1px 0 0 #2BBBAD"
                              : undefined,
                          zIndex: 2,
                          position: header.column.id === "week" ? "sticky" : "relative",
                          left: header.column.id === "week" ? 0 : undefined,
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
                        "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        className={clsx(
                          "border-r px-2 py-2 text-center text-sm",
                          cell.column.id === "week"
                            ? "bg-[#93E6E6] text-gray-900"
                            : "bg-white text-gray-900"
                        )}
                        style={{
                          borderRight: "1px solid #2BBBAD",
                          position: cell.column.id === "week" ? "sticky" : "relative",
                          left: cell.column.id === "week" ? 0 : undefined,
                          transform: cell.column.id === "week" ? "translateY(-1px)" : undefined,
                          zIndex: cell.column.id === "week" ? 1 : "auto",
                          backgroundClip: "padding-box",
                        }}
                      >
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
