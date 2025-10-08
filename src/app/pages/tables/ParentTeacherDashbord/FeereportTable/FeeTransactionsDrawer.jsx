// src/app/pages/tables/ParentTeacherDashboard/FeereportTable/FeeTransactionsDrawer.jsx

// Import Dependencies
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Local Imports
import {
  Badge,
  Button,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
  Tag,
} from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

const cols = [
  "Txn ID",
  "Fee Structure",
  "Date",
  "Type",
  "Name",
  "Debit",
  "Credit",
  "Status",
  "Payment Type",
];

export function FeeTransactionsDrawer({ isOpen, close, summary }) {
  const { locale } = useLocaleContext();

  // Guard against null summary
  if (!summary) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={close}>
        {/* Overlay */}
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40"
        />

        {/* Drawer Panel */}
        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-5xl flex-col bg-white py-4 dark:bg-dark-700"
        >
          {/* Header */}
          <div className="flex justify-between px-4 sm:px-5">
            <div>
              <div className="font-semibold">Student:</div>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400">
                {summary.studentName} ({summary.courseName})
              </div>
            </div>
            <Button
              onClick={close}
              variant="flat"
              isIcon
              className="size-6 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
            >
              <XMarkIcon className="size-4.5" />
            </Button>
          </div>

          {/* Totals */}
          <div className="mt-3 flex gap-6 px-4 sm:px-5">
            <div>
              <p className="font-semibold">Total Fee:</p>
              <p className="text-lg font-medium text-gray-800 dark:text-dark-100">
                ₹{summary.totalFee?.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="font-semibold">Paid:</p>
              <p className="text-lg font-medium text-green-600">
                ₹{summary.totalPaid?.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="font-semibold">Pending:</p>
              <p className="text-lg font-medium text-red-500">
                ₹{summary.pendingFee?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <hr className="mx-4 my-4 border-gray-200 dark:border-dark-500" />

          {/* Transactions Table */}
          <p className="px-4 font-medium text-gray-800 dark:text-dark-100 sm:px-5">
            Fee Transactions:
          </p>

          <div className="mt-1 grow overflow-x-auto px-4 sm:px-5">
            <Table
              hoverable
              className="w-full text-left text-xs-plus rtl:text-right [&_.table-td]:py-2"
            >
              <THead>
                <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                  {cols.map((title) => (
                    <Th
                      key={title}
                      className="py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-dark-100"
                    >
                      {title}
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                {(summary.transactions || []).map((tr) => {
                  const date = tr.trxDate
                    ? dayjs(tr.trxDate).locale(locale).format("DD MMM YYYY")
                    : "-";
                  return (
                    <Tr
                      key={tr.id}
                      className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                    >
                      <Td>{tr.id}</Td>
                      <Td>{tr.feeStructureName}</Td>
                      <Td>{date}</Td>
                      <Td>{tr.trxType}</Td>
                      <Td>{tr.trxName}</Td>
                      <Td className="text-red-600">₹{tr.debit}</Td>
                      <Td className="text-green-600">₹{tr.credit}</Td>
                      <Td>
                        <Badge
                          color={
                            tr.trxStatus === "Completed"
                              ? "success"
                              : tr.trxStatus === "Pending"
                              ? "warning"
                              : "secondary"
                          }
                          variant="soft"
                          className="rounded-full"
                        >
                          {tr.trxStatus}
                        </Badge>
                      </Td>
                      <Td>{tr.paymentType}</Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
          </div>

          {/* Footer Totals */}
          <div className="flex justify-end px-4 sm:px-5">
            <div className="mt-4 w-full max-w-xs text-end">
              <Table className="w-full [&_.table-td]:px-0 [&_.table-td]:py-1">
                <TBody>
                  <Tr>
                    <Td>Total Fee :</Td>
                    <Td>
                      <span className="font-medium text-gray-800 dark:text-dark-100">
                        ₹{summary.totalFee?.toLocaleString("en-IN")}
                      </span>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Paid :</Td>
                    <Td>
                      <span className="font-medium text-green-600">
                        ₹{summary.totalPaid?.toLocaleString("en-IN")}
                      </span>
                    </Td>
                  </Tr>
                  <Tr className="text-red-500">
                    <Td>Pending :</Td>
                    <Td>
                      <span className="font-medium">
                        ₹{summary.pendingFee?.toLocaleString("en-IN")}
                      </span>
                    </Td>
                  </Tr>
                </TBody>
              </Table>
              <div className="mt-2 flex justify-end space-x-1.5">
                <Tag component="button" className="min-w-[4rem]">
                  Receipt
                </Tag>
                <Tag component="button" color="primary" className="min-w-[4rem]">
                  Pay Now
                </Tag>
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

FeeTransactionsDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  summary: PropTypes.shape({
    studentName: PropTypes.string,
    courseName: PropTypes.string,
    totalFee: PropTypes.number,
    totalPaid: PropTypes.number,
    pendingFee: PropTypes.number,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        feeStructureName: PropTypes.string,
        trxDate: PropTypes.string,
        trxType: PropTypes.string,
        trxName: PropTypes.string,
        debit: PropTypes.number,
        credit: PropTypes.number,
        trxStatus: PropTypes.string,
        paymentType: PropTypes.string,
      })
    ),
  }),
};
