// src/app/pages/forms/StudentEnquiryTable/EnquiryTable/RowActions.jsx

// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArrowUpRightIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { EnquiryDrawer } from "./EnquiryDrawer";   // ✅ swapped OrdersDrawer → EnquiryDrawer
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this enquiry? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Enquiry Deleted",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const [isDrawerOpen, { close: closeDrawer, open: openDrawer }] =
    useDisclosure(false);

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(() => {
    setConfirmDeleteLoading(true);
    setTimeout(() => {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      setConfirmDeleteLoading(false);
    }, 1000);
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center space-x-1.5 ">
        {/* Quick open drawer button */}
        <Button
          isIcon
          className="size-8 rounded-full"
          onClick={() => openDrawer()}
        >
          <ArrowUpRightIcon className="size-4" />
        </Button>

        {/* Menu Actions */}
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <MenuItems
              anchor={{ to: "bottom end", gap: 12 }}
              className="absolute z-100 w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0"
            >
              {/* View (same as drawer open) */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openDrawer}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>View</span>
                  </button>
                )}
              </MenuItem>

              {/* Edit (wire this to enquiry form modal if needed) */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>Edit</span>
                  </button>
                )}
              </MenuItem>

              {/* Delete */}
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openModal}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-red-600 outline-hidden transition-colors dark:text-red-400",
                      focus && "bg-red-50 dark:bg-red-900/20",
                    )}
                  >
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>Delete</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />

      {/* Drawer for enquiry details */}
      <EnquiryDrawer row={row} close={closeDrawer} isOpen={isDrawerOpen} />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
