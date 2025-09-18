// src/app/pages/FrontDesk/AppointmentsRequestsCard.jsx

import PropTypes from "prop-types";
import {
  ArrowUpRightIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function AppointmentsRequestsCard({
  name,
  avatar,
  request,
  date,
  time,
  status, // optional status badge
}) {
  return (
    <Card className="space-y-2 p-3 border border-gray-200 dark:border-dark-600 hover:shadow-sm transition w-56">
      {/* Header: Visitor */}
      <div className="flex min-w-0 items-center gap-2">
        <Avatar size={8} name={name} src={avatar} initialColor="auto" />

        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-gray-800 dark:text-dark-100">
            {name}
          </h3>
          <p className="truncate text-xs text-gray-400 dark:text-dark-300">
            {request}
          </p>
        </div>
      </div>

      {/* Date, Time & Status */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-dark-300">{date}</span>
        <div className="flex items-center gap-1">
          {status && (
            <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary-600 dark:bg-dark-700 dark:text-primary-400">
              {status}
            </span>
          )}
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {time}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-1">
        <div className="flex gap-1.5">
          <Button
            className="size-6 rounded-full"
            isIcon
            color="success"
            variant="soft"
          >
            <CheckIcon className="size-3.5" />
          </Button>
          <Button
            className="size-6 rounded-full"
            isIcon
            color="error"
            variant="soft"
          >
            <XMarkIcon className="size-3.5" />
          </Button>
        </div>
        <Button
          className="size-6 rounded-full"
          isIcon
          color="primary"
          variant="soft"
        >
          <ArrowUpRightIcon className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}

AppointmentsRequestsCard.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  request: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  status: PropTypes.string,
};
