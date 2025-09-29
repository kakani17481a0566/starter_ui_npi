// src/app/pages/tables/attendece_dash_bord_table/attendecedisplaytable/AttendanceDrawer.jsx

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
import { Avatar, Badge, Button, Table, TBody, Th, Tr, Td } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { fetchAttendanceSummary } from "./data"; // ✅ pulls dynamic status options

// ----------------------------------------------------------------------

export function AttendanceDrawer({ isOpen, close, row }) {
  const { locale } = useLocaleContext();

  // ✅ Format date/time from `markedOn`
  const date =
    row.original.markedOn != null
      ? dayjs(row.original.markedOn).locale(locale).format("DD MMM YYYY")
      : "Not marked";
  const time =
    row.original.markedOn != null
      ? dayjs(row.original.markedOn).locale(locale).format("hh:mm A")
      : "";

  // ✅ Status badge color/label
  const statusOption =
    row.original.attendanceStatus &&
    fetchAttendanceSummary.attendanceStatusOptions?.find(
      (item) => item.value === row.original.attendanceStatus
    );

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

        {/* Drawer panel */}
        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white py-4 dark:bg-dark-700"
        >
          {/* Header */}
          <div className="flex justify-between px-4 sm:px-5">
            <div>
              <div className="font-semibold">Student ID:</div>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400">
                {row.original.studentId} &nbsp;
                {statusOption && (
                  <Badge className="align-text-bottom" color={statusOption.color}>
                    {statusOption.label}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={close}
              variant="flat"
              isIcon
              className="size-6 rounded-full"
            >
              <XMarkIcon className="size-4.5" />
            </Button>
          </div>

          {/* Student Info */}
          <div className="mt-3 flex w-full justify-between px-4 sm:px-5">
            <div className="flex flex-col">
              <div className="mb-1.5 font-semibold">Student:</div>
              <Avatar
                size={16}
                name={row.original.studentName}
                src={row.original.imageUrl}
                initialColor="auto"
                classNames={{ display: "mask is-squircle rounded-none text-xl" }}
              />
              <div className="mt-1.5 text-lg font-medium text-gray-800 dark:text-dark-50">
                {row.original.studentName}
              </div>
              <p className="text-sm text-gray-500 dark:text-dark-300">
                Class: {row.original.className}
              </p>
            </div>
            <div className="text-end">
              <div className="font-semibold">Marked On:</div>
              <div className="mt-1.5">
                <p className="font-medium">{date}</p>
                {time && (
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                    {time}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div className="mt-3 px-4 sm:px-5">
            <div className="font-semibold">Parent / Guardian:</div>
            <p className="mt-1">
              {row.original.parentName} &nbsp; | &nbsp; {row.original.mobileNumber}
            </p>
          </div>

          {/* Attendance Details */}
          <div className="mt-4 px-4 sm:px-5">
            <Table className="w-full text-sm [&_.table-td]:py-2">
              <TBody>
                <Tr>
                  <Th>Status</Th>
                  <Td>{row.original.attendanceStatus}</Td>
                </Tr>
                <Tr>
                  <Th>From Time</Th>
                  <Td>{row.original.fromTime}</Td>
                </Tr>
                <Tr>
                  <Th>To Time</Th>
                  <Td>{row.original.toTime}</Td>
                </Tr>
                <Tr>
                  <Th>Marked By</Th>
                  <Td>{row.original.markedBy}</Td>
                </Tr>
              </TBody>
            </Table>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

AttendanceDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};
