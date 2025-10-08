// src/app/pages/forms/StudentEnquiryTable/EnquiryTable/EnquiryDrawer.jsx

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  XMarkIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  UsersIcon,
  EnvelopeIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/solid";
import { Fragment } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Local Imports
import {
  Avatar,
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
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

const cols = ["Detail", "Information"];

export function EnquiryDrawer({ isOpen, close, row }) {
  const { locale } = useLocaleContext();
  const data = row.original;

  const timestamps = data.createdOn;
  const date = timestamps
    ? dayjs(timestamps).locale(locale).format("DD MMM YYYY")
    : "";
  const time = timestamps
    ? dayjs(timestamps).locale(locale).format("hh:mm A")
    : "";

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

        {/* Panel */}
        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white py-4 dark:bg-dark-700"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 sm:px-5">
            <div>
              <p className="font-semibold">Enquiry ID:</p>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400 flex items-center gap-2">
                {data.studentEnquiryId}
                {data.statusName && (
                  <Badge color="primary">{data.statusName}</Badge>
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
          <div className="mt-4 flex justify-between px-4 sm:px-5">
            <div className="flex flex-col">
              <p className="mb-1.5 font-semibold">Student:</p>
              <Avatar
                size={16}
                name={data.fullName}
                src={null}
                initialColor="auto"
                classNames={{
                  display: "mask is-squircle rounded-none text-xl",
                }}
              />
              <p className="mt-1.5 text-lg font-medium text-gray-800 dark:text-dark-50">
                {data.fullName}
              </p>
              {data.gender && (
                <p className="mt-1 text-sm text-gray-500">Gender: {data.gender}</p>
              )}
              {data.dob && (
                <p className="mt-1 text-sm text-gray-500">
                  DOB: {dayjs(data.dob).format("DD MMM YYYY")}
                </p>
              )}
            </div>

            <div className="text-end">
              <p className="font-semibold">Created On:</p>
              <div className="mt-1.5">
                <p className="font-medium">{date}</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                  {time}
                </p>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="mt-5 grow overflow-x-auto px-4 sm:px-5">
            <Table
              hoverable
              className="w-full text-left text-xs-plus rtl:text-right [&_.table-td]:py-2"
            >
              <THead>
                <Tr className="border-b border-gray-200 dark:border-b-dark-500">
                  {cols.map((title, index) => (
                    <Th
                      key={index}
                      className="py-2 font-semibold uppercase text-gray-800 dark:text-dark-100"
                    >
                      {title}
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <AcademicCapIcon className="size-4 text-primary-600" />
                    Admission Course
                  </Td>
                  <Td>{data.admissionCourseName ?? "N/A"}</Td>
                </Tr>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <BuildingOfficeIcon className="size-4 text-primary-600" />
                    Branch
                  </Td>
                  <Td>{data.branchName ?? "N/A"}</Td>
                </Tr>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <UserIcon className="size-4 text-primary-600" />
                    Parent Contact
                  </Td>
                  <Td>
                    {data.parentName ?? "N/A"}{" "}
                    {data.parentPhone && (
                      <>
                        -{" "}
                        <a
                          href={`tel:${data.parentPhone}`}
                          className="text-primary-600 hover:underline"
                        >
                          {data.parentPhone}
                        </a>
                      </>
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <UsersIcon className="size-4 text-primary-600" />
                    Mother Contact
                  </Td>
                  <Td>
                    {data.motherName ?? "N/A"}{" "}
                    {data.motherPhone && (
                      <>
                        -{" "}
                        <a
                          href={`tel:${data.motherPhone}`}
                          className="text-primary-600 hover:underline"
                        >
                          {data.motherPhone}
                        </a>
                      </>
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <EnvelopeIcon className="size-4 text-primary-600" />
                    Parent Email
                  </Td>
                  <Td>
                    {data.parentEmail ? (
                      <a
                        href={`mailto:${data.parentEmail}`}
                        className="text-primary-600 hover:underline"
                      >
                        {data.parentEmail}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <EnvelopeIcon className="size-4 text-primary-600" />
                    Mother Email
                  </Td>
                  <Td>
                    {data.motherEmail ? (
                      <a
                        href={`mailto:${data.motherEmail}`}
                        className="text-primary-600 hover:underline"
                      >
                        {data.motherEmail}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td className="font-bold flex items-center gap-2">
                    <MegaphoneIcon className="size-4 text-primary-600" />
                    Heard About Us
                  </Td>
                  <Td>{data.hearAboutUsName ?? "N/A"}</Td>
                </Tr>
              </TBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end px-4 sm:px-5 gap-2">
            <Tag component="button" className="min-w-[5rem]">
              Edit
            </Tag>
            <Tag component="button" color="error" className="min-w-[5rem]">
              Delete
            </Tag>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

EnquiryDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};
