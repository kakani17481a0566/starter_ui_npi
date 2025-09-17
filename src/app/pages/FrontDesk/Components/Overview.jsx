// Import Dependencies
import {
  // ArrowUpIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PresentationChartBarIcon,
  UsersIcon,
  // UserIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Card } from "components/ui";

// import { CurrentStrength } from "./CurrentStrength";

import { Rating } from "./Rating";
import { UserGroupIcon } from "@heroicons/react/24/outline"; // ✅ import

// ----------------------------------------------------------------------

export function Overview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">

      <Card className="flex justify-between p-5">
        <div>
          {/* ✅ Icon + Staff in one row */}
          <div className="flex items-center gap-1">




            <UserGroupIcon className="text-primary-500 dark:text-dark-200 size-5" />
            <p className="font-bold ">Students3</p>
          </div>

          {/* ✅ Number below */}
          <p className="this:info text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            12k
          </p>
        </div>
        {/* Right side content */}
        <div className="max-w-xs">
          <Rating />
          {/* <CurrentStrength /> */}
        </div>
      </Card>

      <Card className="flex justify-between p-5">
        <div>
          <Avatar
            size={12}
            classNames={{
              display: "mask is-squircle rounded-none",
            }}
            initialVariant="soft"
            initialColor="info"
          >
            <PresentationChartBarIcon className="size-6" />
          </Avatar>

          <p> Student</p>
        </div>
        {/* <p className="this:info text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
          <CurrentStrength />
        </p> */}

        <div className="max-w-xs">
          <Rating />
          {/* <CurrentStrength /> */}
        </div>
      </Card>



      <Card className="flex justify-between p-5">
        <div>
          {/* ✅ Icon + Staff in one row */}
          <div className="flex items-center gap-1">
            <UserGroupIcon className="text-primary-500 dark:text-dark-200 size-4" />
            <p className="font-medium">Staff</p>
          </div>

          {/* ✅ Number below */}
          <p className="this:warning text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            12k
          </p>
        </div>

        <Avatar
          size={12}
          classNames={{
            display: "mask is-squircle rounded-none",
          }}
          initialVariant="soft"
          initialColor="warning"
        >
          <UsersIcon className="size-6" />
        </Avatar>
      </Card>
      <Card className="flex justify-between p-5">
        <div>
          <p>Appoinments</p>
          <p className="this:success text-this dark:text-this-lighter mt-0.5 text-2xl font-medium">
            47k
          </p>
        </div>
        <Avatar
          size={12}
          classNames={{
            display: "mask is-squircle rounded-none",
          }}
          initialVariant="soft"
          initialColor="success"
        >
          <CubeIcon className="size-6" />
        </Avatar>
      </Card>

      <Card className="flex justify-between p-5">
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
      </Card>
    </div>
  );
}
