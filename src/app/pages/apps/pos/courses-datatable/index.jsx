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
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";
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

const Default = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="text-primary-900 w-12 h-12" />
    </div>
  );
};

// helper: normalize id
const getCourseId = (course) =>
  course.course_id ?? course.id ?? course._id;

export default function CoursesDatatable({ categoryId, onRowClick }) {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const result = await fetchItemsData();
        setAllItems(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const [items, setItems] = useState([]);
  useEffect(() => {
    if (categoryId) {
      setItems(allItems.filter((c) => c.categoryId == categoryId));
    } else {
      setItems(allItems);
    }
  }, [categoryId, allItems]);

  const seedCourses = useMemo(() => [], []);
  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: false,
  });

  const [toolbarFilters, setToolbarFilters] = useState(["status", "size"]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-courses",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-courses",
    {},
  );

  const [courses, setCourses] = useState(seedCourses);

  useEffect(() => {
    if (categoryId) {
      setCourses(seedCourses.filter((c) => c.categoryId === categoryId));
    } else {
      setCourses(seedCourses);
    }
  }, [categoryId, seedCourses]);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

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
        setItems((old) =>
          old.filter((oldRow) => oldRow.course_id !== row.original.course_id),
        );
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const rowIds = rows.map((row) => row.original.course_id);
        setItems((old) => old.filter((row) => !rowIds.includes(row.course_id)));
        const ids = new Set(rows.map((r) => r.original.course_id));
        setCourses((old) => old.filter((r) => !ids.has(r.course_id)));
      },
      setTableSettings,
      setToolbarFilters,
    },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    enableSorting: tableSettings?.enableSorting ?? true,
    enableColumnFilters: tableSettings?.enableColumnFilters ?? true,
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

  useDidUpdate(() => table.resetRowSelection(), [items]);
  useLockScrollbar(tableSettings.enableFullScreen);
  useDidUpdate(() => table.resetRowSelection(), [courses]);
  useLockScrollbar(tableSettings?.enableFullScreen ?? false);

  const hasRows = table.getCoreRowModel().rows.length > 0;

  if (loading) {
    return <Default />;
  }

  return (
    <Page title="React Table">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings?.enableFullScreen &&
              "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar table={table} />

          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings?.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)",
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings?.enableFullScreen && "overflow-hidden",
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings?.enableRowDense}
                  sticky={tableSettings?.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers
                          .filter(
                            (header) => !header.column.columnDef.isHiddenColumn,
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
                                  ],
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
                            );
                          })}
                      </Tr>
                    ))}
                  </THead>

                  <TBody>
                    {table.getRowModel().rows.map((row) => (
                      <Tr
                        key={row.id}
                        onClick={() => {
                          const original = row.original;
                          const courseId = getCourseId(original);
                          onRowClick?.({ ...original, course_id: courseId });
                        }}
                        className={clsx(
                          "cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-600",
                          "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                          row.getIsSelected() &&
                            "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10",
                        )}
                      >
                        {row
                          .getVisibleCells()
                          .filter((cell) => !cell.column.columnDef.isHiddenColumn)
                          .map((cell) => (
                            <Td key={cell.id}>
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

              {hasRows && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings?.enableFullScreen &&
                      "bg-gray-50 dark:bg-dark-800",
                    !(table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()) && "pt-4",
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

// ----------------------------------------------------------------------
// PropTypes
CoursesDatatable.propTypes = {
  categoryId: PropTypes.number,
  onRowClick: PropTypes.func,
};
