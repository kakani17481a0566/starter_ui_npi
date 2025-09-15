import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";

// Local Imports
import { Button, Card, Spinner } from "components/ui";
import { SellerCard } from "./SellerCard";

export function TopSellers({ data }) {
  const [search, setSearch] = useState("");

  const sellers =
    (data?.records ?? [])
      .filter((r) => r.attendanceStatus === "Not Marked")
      .map((r) => ({
        uid: r.studentId,
        avatar: "/images/200x200.png",
        name: r.studentName,
        attendanceStatus: r.attendanceStatus,
        mobileNumber: r.mobileNumber,
        className: r.className,
        chartData: Array(6).fill(0),
      })) || [];

  const filteredSellers = sellers
    .sort((a, b) => a.className.localeCompare(b.className))
    .filter((seller) =>
      seller.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Card
      className={clsx(
        "col-span-12 pb-2 lg:col-span-12 xl:col-span-12 overflow-hidden",
        "transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      {/* Vibrant Header + Search inline */}
      <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 rounded-t-xl bg-gradient-to-r from-primary-50/80 to-primary-100/60 dark:from-dark-800 dark:to-dark-700">
        <div className="truncate font-medium tracking-wide text-primary-700 dark:text-primary-300">
          Student Not Attended Today
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={clsx(
              "w-full h-7 rounded-md border text-xs pl-7 pr-2",
              "bg-white dark:bg-dark-700", // ✅ solid background
              "outline-none shadow-sm",
              "border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400",
              "placeholder:text-gray-400 dark:placeholder:text-dark-300",
              "dark:border-dark-500 dark:text-white"
            )}
          />
        </div>

        <ActionMenu />
      </div>

      {/* Sellers List */}
      <div
        className="custom-scrollbar flex space-x-3 overflow-x-auto px-4 pt-2 pb-3 sm:px-5"
        style={{ "--margin-scroll": "1.25rem" }}
      >
        {data === null ? (
          <div className="w-full flex justify-center items-center py-6">
            <Spinner color="primary" className="size-6 border-2" />
          </div>
        ) : filteredSellers.length > 0 ? (
          filteredSellers.map((seller) => (
            <SellerCard key={seller.uid} {...seller} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No students found</p>
        )}
      </div>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
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
        <MenuItems className="dark:border-dark-500 dark:bg-dark-700 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
          {["Refresh", "Export", "Settings", "Help"].map((label) => (
            <MenuItem key={label}>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide transition-colors",
                    focus &&
                      "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800"
                  )}
                >
                  <span>{label}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
