// src/app/pages/FrontDesk/Components/PostalTable/PostalDrawer.js

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Local Imports
import {
  Badge,
  Button,
  Table,
  Tag,
  THead,
  TBody,
  Th,
  Tr,
  Td,
} from "components/ui";
import { postalStatusOptions } from "./data";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

const cols = ["Item", "Amount"];

export function PostalDrawer({ isOpen, close, row }) {
  const statusOption = postalStatusOptions.find(
    (item) => item.value === row.original.status,
  );

  const { locale } = useLocaleContext();
  const timestamp = +new Date(row.original.created_on);
  const date = dayjs(timestamp).locale(locale).format("DD MMM YYYY");
  const time = dayjs(timestamp).locale(locale).format("hh:mm A");

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
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40"
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
          className="fixed right-0 top-0 flex h-full w-full max-w-xl transform-gpu flex-col bg-white py-4 transition-transform duration-200 dark:bg-dark-700"
        >
          {/* Header */}
          <div className="flex justify-between px-4 sm:px-5">
            <div>
              <div className="font-semibold">Parcel ID:</div>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400">
                {row.original.parcel_id} &nbsp;
                <Badge className="align-text-bottom" color={statusOption?.color}>
                  {statusOption?.label}
                </Badge>
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

          {/* Sender / Receiver */}
          <div className="mt-3 flex w-full justify-between px-4 sm:px-5">
            <div className="flex flex-col">
              <div className="mb-1.5 font-semibold">Sender:</div>
              <div className="text-lg font-medium text-gray-800 dark:text-dark-50">
                {row.original.sender_name}
              </div>
            </div>
            <div className="text-end">
              <div className="mb-1.5 font-semibold">Receiver:</div>
              <div className="text-lg font-medium text-gray-800 dark:text-dark-50">
                {row.original.receiver_name}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="mt-3 px-4 sm:px-5">
            <div className="font-semibold">Date:</div>
            <p className="font-medium">{date}</p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
              {time}
            </p>
          </div>

          <hr
            className="mx-4 my-4 h-px border-gray-150 dark:border-dark-500 sm:mx-5"
            role="none"
          />

          {/* Parcel Details */}
          <p className="px-4 font-medium text-gray-800 dark:text-dark-100 sm:px-5">
            Parcel Details:
          </p>

          <div className="mt-1 grow overflow-x-auto overscroll-x-contain px-4 sm:px-5">
            <Table
              hoverable
              className="w-full text-left text-xs-plus rtl:text-right [&_.table-td]:py-2"
            >
              <THead>
                <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                  {cols.map((title, index) => (
                    <Th
                      key={index}
                      className="py-2 font-semibold uppercase text-gray-800 first:px-0 last:px-0 dark:text-dark-100"
                    >
                      {title}
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                  <Td className="px-0 font-medium ltr:rounded-l-lg rtl:rounded-r-lg">
                    {row.original.postal_item}
                  </Td>
                  <Td className="px-0 font-medium text-gray-800 dark:text-dark-100 ltr:rounded-r-lg rtl:rounded-l-lg">
                    ₹{row.original.amount}
                  </Td>
                </Tr>
              </TBody>
            </Table>
          </div>

          {/* Summary (optional, like Orders) */}
          <div className="flex justify-end px-4 sm:px-5">
            <div className="mt-4 w-full max-w-xs text-end">
              <Table className="w-full [&_.table-td]:px-0 [&_.table-td]:py-1">
                <TBody>
                  <Tr className="text-lg text-primary-600 dark:text-primary-400">
                    <Td>Total :</Td>
                    <Td>
                      <span className="font-medium">
                        ₹{row.original.amount}
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
                  Print
                </Tag>
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

PostalDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};
