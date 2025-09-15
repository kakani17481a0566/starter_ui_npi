import {
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Box, Button } from "components/ui";

// Status → colors
const statusColorMap = {
  "Checked-In": "text-emerald-600 bg-emerald-50",
  "Checked-Out": "text-indigo-600 bg-indigo-50",
  "Not Marked": "text-amber-600 bg-amber-50",
  Unknown: "text-gray-500 bg-gray-100",
};

export function SellerCard({
  avatar,
  name,
  attendanceStatus,
  mobileNumber,
  className,
}) {
  const statusColor =
    statusColorMap[attendanceStatus] || statusColorMap.Unknown;
  const isValidNumber = mobileNumber && /^[0-9+\-() ]{6,}$/.test(mobileNumber);

  return (
    <Box
      className={clsx(
        "group relative w-64 shrink-0 overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-primary-50 to-white shadow-md",
        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out",
        "dark:from-dark-800 dark:to-dark-900",
        className
      )}
    >
      {/* Top bar gradient */}
      <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-sky-400 to-primary-500" />

      {/* Avatar + Info */}
      <div className="flex flex-col items-center px-5 pt-6 pb-4 text-center">
        <Avatar
          size={18}
          classNames={{
            root: "rounded-full bg-gradient-to-r from-sky-400 to-primary-500 p-0.5 ring-2 ring-white dark:ring-dark-700",
            display: "border border-gray-200 dark:border-dark-600",
          }}
          name={name}
          src={avatar}
          initialColor="auto"
        />
        <h3 className="mt-3 text-base font-semibold text-gray-800 dark:text-dark-100">
          {name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-dark-300">Student</p>
        {className && (
          <p className="mt-0.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            Class {className}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="px-5 pb-4 text-center">
        <span
          className={clsx(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            statusColor
          )}
        >
          {attendanceStatus || "Unknown"}
        </span>
      </div>

      {/* Action Links */}
      <div className="flex justify-around border-t border-gray-200 px-5 py-3 dark:border-dark-600">
        <Button
          as="a"
          href="#"
          color="primary"
          variant="ghost"
          isIcon
          className="rounded-full hover:bg-primary-100 dark:hover:bg-dark-700"
          title="Chat"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
        </Button>
        <Button
          as="a"
          href={`mailto:${name}@school.com`}
          color="primary"
          variant="ghost"
          isIcon
          className="rounded-full hover:bg-primary-100 dark:hover:bg-dark-700"
          title="Email"
        >
          <EnvelopeIcon className="w-5 h-5" />
        </Button>
        {isValidNumber ? (
          <a
            href={`tel:${mobileNumber}`}
            className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-dark-700 dark:hover:bg-dark-600"
            title={`Call ${mobileNumber}`}
          >
            <PhoneIcon className="w-5 h-5" />
          </a>
        ) : (
          <span
            className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
            title="No valid number"
          >
            <PhoneIcon className="w-5 h-5" />
          </span>
        )}
      </div>
    </Box>
  );
}

SellerCard.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string.isRequired,
  attendanceStatus: PropTypes.string,
  mobileNumber: PropTypes.string,
  className: PropTypes.string,
};
