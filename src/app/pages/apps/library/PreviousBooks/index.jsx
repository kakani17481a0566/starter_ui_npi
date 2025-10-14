import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button, Table, THead, TBody, Tr, Th, Td } from "components/ui";
import clsx from "clsx";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { columns as baseColumns } from "./columns";
import { checkoutBook } from "./data";

// ✅ BookTable
export default function BookTable({ data = [], studentId, studentName }) {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [confirm, setConfirm] = useState(false);

  // 🔹 Extend baseColumns with renderers
  const extendedColumns = baseColumns.map((col) => {
    if (col.accessorKey === "status") {
      return {
        ...col,
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={clsx("font-bold", {
                "text-green-600": status?.toLowerCase() === "checkedin",
                "text-red-600": status?.toLowerCase() === "checkedout",
                "text-orange-600": status?.toLowerCase() === "pending",
              })}
            >
              {status}
            </span>
          );
        },
      };
    }

    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => {
          const book = row.original;
          return (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBook(book);
                setOpen(true);
              }}
            >
              <TrashIcon className="size-5 transition-colors group-hover:text-error" />
            </Button>
          );
        },
      };
    }
    return col;
  });

  // 🔹 Init TanStack Table
  const table = useReactTable({
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 🔹 Checkout handler
  const handleCheckout = async () => {
    if (!confirm) {
      alert("Please confirm before checking out");
      return;
    }

    try {
      await checkoutBook({
        studentId,
        bookIds: [selectedBook.bookId],
      });

      alert("✅ Book checked out successfully!");
      setOpen(false);
      setConfirm(false);
    } catch (err) {
      console.error(err);
      alert("❌ Checkout failed");
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-2">Previous Books</h1>
      <Table className="w-full text-left rtl:text-right">
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  className={clsx(
                    "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
                "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500 hover:bg-primary-50 dark:hover:bg-dark-600"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={cell.id}
                  className={clsx("relative bg-white dark:bg-dark-900")}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </TBody>
      </Table>

      {/* ---- Dialog ---- */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-xl w-[400px]">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Confirm Checkout
            </Dialog.Title>

            {selectedBook && (
              <div className="space-y-2 text-sm">
                <p><strong>Book:</strong> {selectedBook.bookName}</p>
                <p><strong>Author:</strong> {selectedBook.authorName}</p>
                <p><strong>Status:</strong> {selectedBook.status}</p>
                <p><strong>Student:</strong> {studentName}</p>
              </div>
            )}

            {/* Confirmation */}
            <div className="mt-3 flex items-center gap-2">
              <input
                id="confirm"
                type="checkbox"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
              />
              <label htmlFor="confirm" className="text-sm">
                I confirm to checkout this book
              </label>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setOpen(false)} className="bg-gray-400">
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                className="bg-primary-600 text-white"
              >
                Checkout
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
