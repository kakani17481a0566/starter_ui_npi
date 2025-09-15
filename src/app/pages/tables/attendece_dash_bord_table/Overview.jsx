import {
  CheckBadgeIcon,
  ArrowPathIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline";
import { Card, Button } from "components/ui";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";

// -------------------------
// Main Overview Component
// -------------------------
export function Overview({ data }) {
  const [focusRange, setFocusRange] = useState("monthly");

  const {
    totalStudents = 0,
    checkedInCount = 0,
    checkedOutCount = 0,
    notMarkedCount = 0,
    unknownCount = 0,
    cutterDayCount = 0,
  } = data || {};

  return (
    <Card className="col-span-12 lg:col-span-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-t-xl bg-gradient-to-r from-primary-50/80 to-primary-100/60 px-4 pt-4 pb-3 dark:from-dark-800 dark:to-dark-700 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        {/* Title + Menu */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold tracking-wide text-primary-700 dark:text-primary-300">
            Attendance Summary
          </h2>
          <ActionMenu />
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2">
          {["monthly", "yearly"].map((range) => (
            <Button
              key={range}
              className="h-8 rounded-full text-xs shadow-sm"
              variant={focusRange === range ? "solid" : "flat"}
              color={focusRange === range ? "primary" : "neutral"}
              onClick={() => setFocusRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4 px-4 sm:mt-5 sm:grid-cols-4 sm:px-5 lg:mt-6">
        <StatCard
          label="Total Students"
          value={totalStudents}
          Icon={CurrencyDollarIcon}
          color="primary"
        />
        <StatCard
          label="Checked-In"
          value={checkedInCount}
          Icon={CheckBadgeIcon}
          color="success"
        />
        <StatCard
          label="Checked-Out"
          value={checkedOutCount}
          Icon={ArrowPathIcon}
          color="info"
        />
        <StatCard
          label="Not Marked"
          value={notMarkedCount}
          Icon={ClockIcon}
          color="warning"
        />
        {unknownCount > 0 && (
          <StatCard
            label="Unknown"
            value={unknownCount}
            Icon={QuestionMarkCircleIcon}
            color="neutral"
          />
        )}
        {cutterDayCount > 0 && (
          <StatCard
            label="Cutter Day"
            value={cutterDayCount}
            Icon={ScissorsIcon}
            color="warning"
          />
        )}
      </div>
    </Card>
  );
}

// -------------------------
// Vibrant Stat Card
// -------------------------
function StatCard({ label, value, Icon, color = "primary" }) {
  const colorMap = {
    primary:
      "from-primary-100 to-primary-50 text-primary-700 dark:from-primary-900/30 dark:to-dark-800",
    success:
      "from-emerald-100 to-emerald-50 text-emerald-700 dark:from-emerald-900/30 dark:to-dark-800",
    warning:
      "from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/30 dark:to-dark-800",
    info: "from-sky-100 to-sky-50 text-sky-700 dark:from-sky-900/30 dark:to-dark-800",
    neutral:
      "from-gray-100 to-gray-50 text-gray-700 dark:from-dark-700/40 dark:to-dark-800",
  };

  return (
    <div
      className={clsx(
        "rounded-xl p-4 2xl:p-5 bg-gradient-to-br",
        "transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl",
        colorMap[color]
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <div
          className={clsx(
            "flex items-center justify-center rounded-full p-2",
            "bg-white/70 dark:bg-dark-600 shadow-sm"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
    </div>
  );
}

// -------------------------
// Action Menu
// -------------------------
function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton as={Button} variant="flat" isIcon className="size-8 rounded-full">
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-700 ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                <span>Export Summary</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
