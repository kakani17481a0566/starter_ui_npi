// ----------------------------------------------------------------------
// 📦 Import Dependencies
// ----------------------------------------------------------------------
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Cog8ToothIcon, PrinterIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import { ItemsTable } from "./ItemsTable";

// ----------------------------------------------------------------------
// 🧾 Invoice Component
// ----------------------------------------------------------------------
export default function Invoice1({ data }) {
  const invoiceRef = useRef();

  // 🖨️ Setup printing
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: data?.invoiceNumber || "Invoice",
  });

  // 🔹 Defensive checks
  if (!data) {
    return (
      <div className="flex h-80 items-center justify-center text-gray-500 dark:text-dark-300">
        <p>No invoice data available.</p>
      </div>
    );
  }

  const {
    invoiceNumber,
    date,
    status,
    student = {},
    payment = {},
    items = [],
    subtotal = 0,
    gst = 0,
    total = 0,
    footer = {},
  } = data;

  const gstPercent = items[0]?.gstPercentage ?? 5;

  return (
    <Page title={`Invoice ${invoiceNumber || ""}`}>
      <div
        className="transition-content grid w-full px-(--margin-x) pb-8"
        style={{ gridTemplateRows: "auto 1fr" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-5 lg:py-6">
          <h2 className="truncate text-xl font-medium text-gray-700 dark:text-dark-50 lg:text-2xl">
            Invoice
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              className="size-8 rounded-full"
              variant="flat"
              isIcon
            >
              <PrinterIcon className="size-5" />
            </Button>
            <Button className="size-8 rounded-full" variant="flat" isIcon>
              <Cog8ToothIcon className="size-5" />
            </Button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="grid grid-cols-1">
          <Card
            className="flex h-full flex-col px-5 py-12 sm:px-12"
            ref={invoiceRef}
          >
            {/* Header Info */}
            <div className="flex flex-col justify-between sm:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                  {student.schoolName || "NeuroPi International School"}
                </h2>
                <div className="space-y-1 pt-2">
                  {student.branch && <p>{student.branch}</p>}
                  {student.rollNo && <p>Roll No: {student.rollNo}</p>}
                  {student.className && <p>Class: {student.className}</p>}
                </div>
              </div>

              <div className="mt-4 text-center sm:m-0 sm:text-right">
                <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                  Invoice
                </h2>
                <div className="space-y-1 pt-2">
                  {invoiceNumber && (
                    <p>
                      Invoice #: <span className="font-semibold">{invoiceNumber}</span>
                    </p>
                  )}
                  {date && (
                    <p>
                      Date:{" "}
                      <span className="font-semibold">
                        {new Date(date).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {status && (
                    <p>
                      Status: <span className="font-semibold">{status}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500" />

            {/* Student + Payment Info */}
            <div className="flex flex-col justify-between sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-lg font-medium text-gray-600 dark:text-dark-100">
                  Invoiced To:
                </p>
                <div className="space-y-1 pt-2">
                  {student.studentName && (
                    <p className="font-semibold">{student.studentName}</p>
                  )}
                  {student.className && <p>{student.className}</p>}
                  {student.branch && <p>{student.branch}</p>}
                </div>
              </div>

              <div className="mt-4 text-center sm:m-0 sm:text-right">
                <p className="text-lg font-medium text-gray-600 dark:text-dark-100">
                  Payment Method:
                </p>
                <div className="space-y-1 pt-2">
                  {payment.method && (
                    <p className="font-medium">{payment.method}</p>
                  )}
                  {payment.transactionId && <p>ID: {payment.transactionId}</p>}
                  {payment.remarks && <p>{payment.remarks}</p>}
                </div>
              </div>
            </div>

            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500" />

            {/* Items Table */}
            <ItemsTable items={items} />

            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500" />

            {/* Totals */}
            <div className="flex flex-col justify-end sm:flex-row">
              <div className="mt-4 text-center sm:m-0 sm:text-right">
                <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
                  Total:
                </p>
                <div className="space-y-1 pt-2">
                  <p>
                    Subtotal:{" "}
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </p>
                  <p>
                    Tax (GST {gstPercent}%):{" "}
                    <span className="font-medium">₹{gst.toFixed(2)}</span>
                  </p>
                  <p className="text-lg text-primary-600 dark:text-primary-400">
                    Total:{" "}
                    <span className="font-medium">₹{total.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            {(footer.thankYouNote || footer.supportEmail) && (
              <div className="mt-8 text-center text-sm text-gray-600 dark:text-dark-100">
                {footer.thankYouNote && <p>{footer.thankYouNote}</p>}
                {(footer.supportEmail || footer.supportPhone) && (
                  <p>
                    {footer.supportEmail}{" "}
                    {footer.supportPhone && `| ${footer.supportPhone}`}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Page>
  );
}
