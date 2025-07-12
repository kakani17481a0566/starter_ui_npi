import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";

// Local Imports
import { Button, Card } from "components/ui";
import { SellerCard } from "./SellerCard";
import { fetchAttendanceSummary } from "../attendecedisplaytable/data";

export function TopSellers() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    fetchAttendanceSummary({ date: "2025-07-12" }).then((data) => {
      const mapped = (data?.records ?? [])
        .filter((r) => r.attendanceStatus === "Not Marked")
       .map((r) => ({
  uid: r.studentId,
  avatar: "/images/200x200.png",
  name: r.studentName,
  attendanceStatus: r.attendanceStatus,
  mobileNumber: r.mobileNumber,
  className: r.className, // ✅ Add this line
  chartData: Array(6).fill(0),
}));

      setSellers(mapped);
    });
  }, []);

  return (
    <Card className="col-span-12 pb-2 lg:col-span-5 xl:col-span-6">
      <div className="flex min-w-0 items-center justify-between px-4 py-3 sm:px-5">
        <div className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Student Not Attended Today
        </div>
        <ActionMenu />
      </div>

      <div
        className="custom-scrollbar flex space-x-3 overflow-x-auto px-4 pb-3 sm:px-5"
        style={{ "--margin-scroll": "1.25rem" }}
      >
        {sellers.length > 0 ? (
          sellers.map((seller) => (
            <SellerCard key={seller.uid} {...seller} />
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No data available</p>
        )}
      </div>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5">
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          {["Refresh", "Export", "Settings", "Help"].map((label) => (
            <MenuItem key={label}>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide transition-colors",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
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
