// Import Dependencies
import { useReactToPrint } from "react-to-print";
import { Cog8ToothIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import { ItemsTable } from "./ItemsTable";

// ----------------------------------------------------------------------

export default function Invoice1() {
  const invoiceRef = useRef();
  const handlePrint = useReactToPrint({ contentRef: invoiceRef });

  // ✅ Replace with your backend / props data
  const invoice = {
    tenantId: 1,
    invoiceNumber: "INV-2025-00123",
    date: "2025-10-15T10:00:00Z",
    status: "Paid",
    student: {
      studentId: 1042,
      studentName: "Aarav Sharma",
      className: "Grade 4 - A",
      rollNo: "21",
      branch: "Main Campus",
    },
    payment: {
      method: "Cash",
      transactionId: "TXN7823491",
      remarks: "Paid in full at POS",
    },
    items: [
      {
        itemId: 101,
        itemName: "Mathematics Textbook (Grade 4)",
        quantity: 1,
        unitPrice: 350,
        gstPercentage: 5,
        gstValue: 17.5,
      },
      {
        itemId: 102,
        itemName: "School Uniform Set",
        quantity: 2,
        unitPrice: 750,
        gstPercentage: 5,
        gstValue: 75,
      },
      {
        itemId: 103,
        itemName: "Art & Craft Kit",
        quantity: 1,
        unitPrice: 400,
        gstPercentage: 5,
        gstValue: 20,
      },
      {
        itemId: 104,
        itemName: "School Bag",
        quantity: 1,
        unitPrice: 800,
        gstPercentage: 5,
        gstValue: 40,
      },
    ],
    subtotal: 3050,
    gst: 152.5,
    total: 3202.5,
    footer: {
      thankYouNote:
        "Thank you for shopping with NeuroPi International School!",
      supportEmail: "support@neuropi.edu.in",
      supportPhone: "+91-9876543210",
    },
  };

  return (
    <Page title="Invoice V1">
      <div
        className="transition-content grid w-full px-(--margin-x) pb-8"
        style={{ gridTemplateRows: "auto 1fr" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-5 lg:py-6">
          <h2 className="truncate text-xl font-medium text-gray-700 dark:text-dark-50 lg:text-2xl">
            Invoice
          </h2>
          <div className="flex">
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

        {/* Body */}
        <div className="grid grid-cols-1">
          <Card
            className="flex h-full flex-col px-5 py-12 sm:px-12"
            ref={invoiceRef}
          >
            {/* Header Info */}
            <div className="flex flex-col justify-between sm:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                  NeuroPi International School
                </h2>
                <div className="space-y-1 pt-2">
                  <p>{invoice.student.branch}</p>
                  <p>Roll No: {invoice.student.rollNo}</p>
                  <p>Class: {invoice.student.className}</p>
                </div>
              </div>
              <div className="mt-4 text-center sm:m-0 sm:text-right">
                <h2 className="text-2xl font-semibold uppercase text-primary-600 dark:text-primary-400">
                  invoice
                </h2>
                <div className="space-y-1 pt-2">
                  <p>
                    Invoice #:{" "}
                    <span className="font-semibold">
                      {invoice.invoiceNumber}
                    </span>
                  </p>
                  <p>
                    Date:{" "}
                    <span className="font-semibold">
                      {new Date(invoice.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-semibold">{invoice.status}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

            {/* Student + Payment Info */}
            <div className="flex flex-col justify-between sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-lg font-medium text-gray-600 dark:text-dark-100">
                  Invoiced To:
                </p>
                <div className="space-y-1 pt-2">
                  <p className="font-semibold">
                    {invoice.student.studentName}
                  </p>
                  <p>{invoice.student.className}</p>
                  <p>{invoice.student.branch}</p>
                </div>
              </div>
              <div className="mt-4 text-center sm:m-0 sm:text-right">
                <p className="text-lg font-medium text-gray-600 dark:text-dark-100">
                  Payment Method:
                </p>
                <div className="space-y-1 pt-2">
                  <p className="font-medium">{invoice.payment.method}</p>
                  <p>ID: {invoice.payment.transactionId}</p>
                </div>
              </div>
            </div>

            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

            {/* Items */}
            <ItemsTable items={invoice.items} />

            <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

            {/* Totals */}
            <div className="flex flex-col justify-end sm:flex-row">
              <div className="mt-4 text-center sm:m-0 sm:text-right">
                <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
                  Total:
                </p>
                <div className="space-y-1 pt-2">
                  <p>
                    Subtotal :{" "}
                    <span className="font-medium">
                      ₹{invoice.subtotal.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    Tax (GST {invoice.items[0].gstPercentage}%):{" "}
                    <span className="font-medium">
                      ₹{invoice.gst.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-lg text-primary-600 dark:text-primary-400">
                    Total:{" "}
                    <span className="font-medium">
                      ₹{invoice.total.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600 dark:text-dark-100">
              <p>{invoice.footer.thankYouNote}</p>
              <p>
                {invoice.footer.supportEmail} | {invoice.footer.supportPhone}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
