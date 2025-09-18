// Import Dependencies
import {
  CubeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

// Local Imports
// import { Avatar, Card } from "components/ui";
import { Card } from "components/ui";

import { Rating } from "./Rating";
import { UserGroupIcon } from "@heroicons/react/24/outline"; // ✅ import

// ----------------------------------------------------------------------

export function Overview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {/* 🔹 Students3 card */}
      <Card className="flex justify-between p-5">
        <div>
          <div className="flex items-center gap-1">
            <UserGroupIcon className="text-primary-500 dark:text-dark-200 size-5" />
            <p className="font-bold">Students3</p>
          </div>
          <p className="this:info text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            12k
          </p>
        </div>

        <Rating />
      </Card>

      <Card className="flex justify-between p-5">
        <div>
          <div className="flex items-center gap-1">
            {/* ✅ Warning color for Staff */}
            <UsersIcon className="this:warning text-this dark:text-dark-200 size-5" />
            <p className="font-bold">Staff</p>
          </div>
          <p className="this:warning text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            12k
          </p>
        </div>

        <Rating />
      </Card>

      {/* 🔹 Staff card (with Avatar + warning color) */}
      {/* <Card className="flex justify-between p-5">
        <div>
          <div className="flex items-center gap-1">
            <Avatar
              size={8}
              classNames={{
                display: "mask is-squircle rounded-none",
              }}
              initialVariant="soft"
              initialColor="warning" // ✅ same color as number
            >
              <UsersIcon className="size-5" />
            </Avatar>
            <p className="font-bold">Staff</p>
          </div>
          <p className="this:warning text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            12k
          </p>
        </div>
        <div className="max-w-xs">
          <Rating />
        </div>
      </Card> */}

      {/* 🔹 Appointments card */}
      <Card className="flex justify-between p-5">
        <div>
          <div className="flex items-center gap-1">
            {/* ✅ Success color for Appointments */}
            <CubeIcon className="this:success text-this dark:text-dark-200 size-5" />
            <p className="font-bold">Appointments</p>
          </div>
          <p className="this:success text-this dark:text-dark-200 mt-0.5 text-2xl font-medium">
            47k
          </p>
        </div>
      </Card>

      {/* 🔹 Postal card */}

      <Card className="flex justify-between p-5">
        <div>
          {/* Header with icon + title */}
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="this:secondary text-this dark:text-dark-200 size-5" />
            <p className="font-bold">Postal</p>
          </div>

          {/* In/Out values with icons */}
          <div className="mt-2 flex items-center gap-6">
            <div className="flex items-center gap-1">
              <ArrowDownTrayIcon className="text-green-600 size-5" />
              <p className="text-success-500 text-lg font-medium">$128k</p>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpTrayIcon className="text-red-600 size-5" />
              <p className="text-danger-500 text-lg font-medium">$64k</p>
            </div>
          </div>
        </div>
      </Card>

      {/* <Card className="flex justify-between p-5">
        <div>
          <p>Postal</p>
          <p className="this:secondary text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            $128k
          </p>
        </div>
        <Avatar
          size={12}
          classNames={{
            display: "mask is-squircle rounded-none",
          }}
          initialVariant="soft"
          initialColor="secondary"
        >
          <CurrencyDollarIcon className="size-6" />
        </Avatar>
      </Card> */}
    </div>
  );
}
