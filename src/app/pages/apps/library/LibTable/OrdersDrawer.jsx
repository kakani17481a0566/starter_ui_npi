// LibraryDrawer.jsx

// Import Dependencies
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
import { Badge, Button } from "components/ui";
import { orderStatusOptions } from "./data";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

export function LibraryDrawer({ isOpen, close, row }) {
  const statusOption = orderStatusOptions.find(
    (item) => item.value === row.original.status
  );

  const { locale } = useLocaleContext();
  const timestapms = +row.original.created_at;
  const date = dayjs(timestapms).locale(locale).format("DD MMM YYYY");
  const time = dayjs(timestapms).locale(locale).format("hh:mm A");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={close}>
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
              <div className="font-semibold">Book ID:</div>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400">
                {row.original.book_id} &nbsp;
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

          {/* Book Info */}
          <div className="mt-3 flex w-full justify-between px-4 sm:px-5">
            <div className="flex flex-col">
              <div className="mb-1.5 font-semibold">Title:</div>
              <div className="text-lg font-medium text-gray-800 dark:text-dark-50">
                {row.original.book.title}
              </div>
              <div className="mt-1.5 text-sm text-gray-600 dark:text-dark-200">
                Author: {row.original.author}
              </div>
              <div className="mt-1.5 text-sm text-gray-600 dark:text-dark-200">
                Category: {row.original.category}
              </div>
              <div className="mt-1.5 text-sm text-gray-600 dark:text-dark-200">
                Price: ${row.original.price.toFixed(2)}
              </div>
              <div className="mt-1.5 text-sm text-gray-600 dark:text-dark-200">
                Stock: {row.original.stock}
              </div>
            </div>

            <div className="text-end">
              <div className="font-semibold">Added On:</div>
              <div className="mt-1.5">
                <p className="font-medium">{date}</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                  {time}
                </p>
              </div>
            </div>
          </div>

          {/* Publisher Address */}
          <div className="mt-3 px-4 sm:px-5">
            <div className="font-semibold">Publisher Address:</div>
            <p className="mt-1 text-gray-700 dark:text-dark-200">
              {`${row.original.publisher_address?.street}, ${row.original.publisher_address?.line}`}
            </p>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

LibraryDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};
