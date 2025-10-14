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
import { toast } from "sonner";


// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { fetchBooks } from "./data";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

// 🔹 Centered loading spinner
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner className="text-primary-500 w-12 h-12" />
  </div>
);

export default function LibTable({ selectedCategory, onAddToBasket,previousBooks = [] }) {
  const { cardSkin } = useThemeContext();

  const [books, setBooks] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const result = await fetchBooks();
        setAllItems(result);
        setBooks(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);
    const handleAddBook = (book) => {
    const activeBooks = previousBooks.filter(
      (b) => b.status.toLowerCase() === "checkedin"
    ).length;

    if (activeBooks >= 5) {
      toast.error("❌ You already have 5 books. Please return a book before borrowing new ones.");
      return;
    }

    const alreadyTaken = previousBooks.some(
      (b) => b.bookId === book.bookId && b.status.toLowerCase() === "checkedin"
    );

    if (alreadyTaken) {
      toast.error("❌ This book is already issued to you.");
      return;
    }

    onAddToBasket?.(book);
  };


  // 🔹 Filter books based on selected category
  useEffect(() => {
    if (!selectedCategory || selectedCategory === "All") {
      setBooks(allItems);
    } else {
      setBooks(allItems.filter((book) => book.category === selectedCategory));
    }
  }, [selectedCategory, allItems]);

  // ✅ FIX: Add setter
  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: true,
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

  const [autoResetPageIndex, ] = useSkipper();

  const table = useReactTable({
    data: books,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      setTableSettings, // ✅ allow Toolbar/TableSettings to toggle
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

  if (loading) return <LoadingSpinner />;

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
                    const book = row.original;
                    return (
                      <Tr
                        key={row.id}
                        onClick={() => handleAddBook(book)}
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
            {table.getCoreRowModel().rows.length > 0 && (
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
