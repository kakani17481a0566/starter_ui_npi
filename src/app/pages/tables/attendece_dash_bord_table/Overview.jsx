import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";

import { Button, Card } from "components/ui";
import { fetchAttendanceSummary } from "./attendecedisplaytable/data";

export function Overview({ date }) {
  const [focusRange, setFocusRange] = useState("monthly");
  const [data,setData]=useState([]);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    checkedInCount: 0,
    checkedOutCount: 0,
    notMarkedCount: 0,
    unknownCount: 0,
    cutterDayCount: 0,
  });

  useEffect(() => {
    async function loadSummary() {
      try {
      const res = await fetchAttendanceSummary({ date });
      setData(res);
        

        if (res?.data) {
          const {
            totalStudents ,
            checkedInCount ,
            checkedOutCount ,
            notMarkedCount,
            unknownCount ,
            // records = [],
          } = res.data;
          

          // const cutterDayCount = Math.max(
          //   records.filter((r) => r.attendanceStatus === "Checked-In").length -
          //     records.filter((r) => r.attendanceStatus === "Checked-Out").length,
          //   0
          // );

          setSummary({
            totalStudents,
            checkedInCount,
            checkedOutCount,
            notMarkedCount,
            unknownCount,
            // cutterDayCount,
          });
        }
      } catch (err) {
        console.error("Failed to fetch attendance summary", err);
      }
    }

    loadSummary();
  }, []);

  return (
    <Card className="col-span-12 lg:col-span-8">
      <div className="flex flex-col justify-between px-4 pt-3 sm:flex-row sm:items-center sm:px-5">
        <div className="flex flex-1 items-center justify-between space-x-2 sm:flex-initial">
          <h2 className="text-sm-plus font-medium tracking-wide text-primary-950 dark:text-dark-100  dark:text-dark-100">
            Attendance Summary
          </h2>
          <ActionMenu />
        </div>

        <RadioGroup
          name="options"
          value={focusRange}
          onChange={setFocusRange}
          className="hidden gap-2 sm:flex"
        >
          {["monthly", "yearly"].map((range) => (
            <Radio key={range} as={Fragment} value={range}>
              {({ checked }) => (
                <Button
                  className="h-8 rounded-full text-xs"
                  variant={checked ? "soft" : "flat"}
                  color={checked ? "primary" : "neutral"}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4 sm:mt-5 sm:grid-cols-4 sm:px-5 lg:mt-6">
        <StatCard label="Total Students" value={data.totalStudents} Icon={CurrencyDollarIcon} />
        <StatCard label="Checked-In" value={data.checkedInCount} Icon={CheckBadgeIcon} />
        <StatCard label="Checked-Out" value={data.checkedOutCount} Icon={ArrowPathIcon} />
        <StatCard label="Not Marked" value={data.notMarkedCount} Icon={ClockIcon} />
        {summary.unknownCount > 0 && (
          <StatCard label="Unknown" value={data.unknownCount} Icon={QuestionMarkCircleIcon} />
        )}
        {summary.cutterDayCount > 0 && (
          <StatCard label="Cutter Day" value={summary.cutterDayCount} Icon={ScissorsIcon} />
        )}
      </div>
    </Card>
  );
}

function StatCard({ label, value, Icon }) {
  return (
    <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
      <div className="flex justify-between space-x-1">
        <p className="text-xl font-semibold text-primary-950 dark:text-dark-100  dark:text-dark-100">{value}</p>
        <Icon className="size-5 text-primary-500 dark:text-primary-400" />
      </div>
      <p className="mt-1 text-xs-plus">{label}</p>
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5">
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
                  focus && "bg-gray-100 text-primary-950 dark:text-dark-100  dark:bg-dark-600 dark:text-dark-100"
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
