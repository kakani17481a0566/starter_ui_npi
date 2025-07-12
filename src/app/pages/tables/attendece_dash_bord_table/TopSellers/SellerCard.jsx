import {
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
// import Chart from "react-apexcharts";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Box, Button } from "components/ui";

// Chart Config
// const chartConfig = {
//   colors: ["#4467EF"],
//   chart: {
//     parentHeightOffset: 0,
//     toolbar: { show: false },
//   },
//   dataLabels: { enabled: false },
//   stroke: { curve: "smooth", width: 3 },
//   grid: {
//     padding: { left: 0, right: 0, top: -10, bottom: 0 },
//   },
//   xaxis: { show: false },
//   yaxis: { show: false },
// };

const statusColorMap = {
  "Checked-In": "text-green-600",
  "Checked-Out": "text-blue-600",
  "Not Marked": "text-yellow-600",
  "Unknown": "text-gray-500",
};
// export function SellerCard({ avatar, name, attendanceStatus, chartData, mobileNumber, className }) {

export function SellerCard({ avatar, name, attendanceStatus, mobileNumber, className }) {

  const statusColor = statusColorMap[attendanceStatus] || "text-gray-500";

  const isValidNumber = mobileNumber && /^[0-9+\-() ]{6,}$/.test(mobileNumber);

  return (
    <Box className="w-56 shrink-0 rounded-xl bg-gray-50 p-4 dark:bg-surface-3">
      <div className="flex flex-col items-center space-y-3 text-center">
        <Avatar
          size={16}
          classNames={{
            root: "rounded-full bg-gradient-to-r from-sky-400 to-blue-600 p-0.5",
            display: "border-2 border-white text-lg dark:border-dark-700",
          }}
          name={name}
          src={avatar}
          initialColor="auto"
        />
        <div>
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">{name}</p>
          <p className="text-xs-plus text-gray-400 dark:text-dark-300">Student</p>
            <p className="text-xs text-gray-400 dark:text-dark-300">{className}</p> {/* ✅ className */}

        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500">Status</p>
        <p className={clsx("mt-1 text-lg font-semibold", statusColor)}>
          {attendanceStatus || "Unknown"}
        </p>

        {/* <div className="mt-2 ax-transparent-gridline">
          <Chart
            type="line"
            height={100}
            options={chartConfig}
            series={[
              {
                name: "Attendance Trend",
                data: chartData || [],
              },
            ]}
          />
        </div> */}
      </div>

      <div className="mt-5 flex justify-center gap-2">
        <Button color="primary" variant="soft" isIcon className="size-8 rounded-full">
          <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
        </Button>
        <Button color="primary" variant="soft" isIcon className="size-8 rounded-full">
          <EnvelopeIcon className="w-4 h-4" />
        </Button>

        {isValidNumber ? (
          <a
            href={`tel:${mobileNumber}`}
            className="size-8 rounded-full flex items-center justify-center bg-primary-100 hover:bg-primary-200 text-primary-700 dark:bg-dark-700 dark:hover:bg-dark-600"
            title={`Call ${mobileNumber}`}
          >
            <PhoneIcon className="w-4 h-4" />
          </a>
        ) : (
          <Button
            color="primary"
            variant="soft"
            isIcon
            className="size-8 rounded-full opacity-50 cursor-not-allowed"
            disabled
            title="No valid number"
          >
            <PhoneIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Box>
  );
}

SellerCard.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string.isRequired,
  attendanceStatus: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.number).isRequired,
  mobileNumber: PropTypes.string,
};
