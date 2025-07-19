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
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useBoxSize, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { PaginationSection } from "./PaginationSection";
import { MenuAction } from "./MenuActions";
import { columns } from "./columns";
import { fetchTermTimeTableData } from "./termtimetabledata";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

const isSafari = getUserAgentBrowser() === "Safari";

export function TermTimeTable() {
  const [autoResetPageIndex] = useSkipper();
  const theadRef = useRef();
  useBoxSize({ ref: theadRef });

  const [media, setMedia] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTermTimeTableData()
      .then((res) => {
        const { timeTableData } = res || {};
        const trimmed = timeTableData.map((row) => ({
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
  }, []);

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
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Term Timetable
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

      <Card className="relative mt-3 min-h-[200px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
            <div className="w-6 h-6 border-4 border-dashed border-primary-500 rounded-full animate-spin" />
            Loading timetable...
          </div>
        ) : (
          <div className="table-wrapper min-w-full overflow-x-auto w-full">
            <Table hoverable className="w-full text-left rtl:text-right text-sm">
              <THead ref={theadRef}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <Th
                        key={header.id}
                        className={clsx(
                          "text-center font-semibold uppercase text-sm",
                          "first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                          i === 0 ? "text-primary-950" : "text-white"
                        )}
                        style={{
                          backgroundColor: i === 0 ? "#D2A5C2" : "#D27D9E",
                          borderBottom: "none",
                          borderRight: "none",
                          transform: i === 0 ? "translateY(-1px)" : undefined,
                          boxShadow:
                            i === 0
                              ? "0px 4px 10px rgba(0,0,0,0.35), inset -2px 0 4px rgba(255,255,255,0.2), 1px 0 0 #D2486E"
                              : undefined,
                          zIndex: 2,
                          position: "relative",
                        }}
                      >
                        {header.column.getCanSort() ? (
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
                            <TableSortIcon sorted={header.column.getIsSorted()} />
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
                    className={clsx(
                      "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                      row.getIsSelected() &&
                        !isSafari &&
                        "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <Td
                        key={cell.id}
                        className={clsx(
                          "border-r px-2 py-2 text-center text-sm",
                          index === 0
                            ? "text-primary-950 text-wrap break-words whitespace-pre-line"
                            : "whitespace-nowrap"
                        )}
                        style={{
                          backgroundColor: index === 0 ? "#D2A5C2" : "#FFFFFF",
                          borderRight: "1px solid #D2486E",
                          transform: index === 0 ? "translateY(-1px)" : "none",
                          zIndex: index === 0 ? 1 : "auto",
                          position: index === 0 ? "relative" : "static",
                        }}
                      >
                        <div className="break-words whitespace-pre-line">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
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
          </div>
        )}
      </Card>
    </div>
  );
}
