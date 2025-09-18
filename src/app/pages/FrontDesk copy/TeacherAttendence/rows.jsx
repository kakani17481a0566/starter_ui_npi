// src/app/pages/FrontDesk/TeacherAttendance/rows.jsx
import PropTypes from "prop-types";
import { Badge } from "components/ui";
import {
  UserCircleIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Teacher Name Cell
export function TeacherNameCell({ getValue }) {
  return (
    <div className="flex items-center gap-2">
      <UserCircleIcon className="h-5 w-5 text-primary-500" />
      <span className="font-medium text-gray-800 dark:text-dark-100">
        {getValue()}
      </span>
    </div>
  );
}

// Subject Cell
export function SubjectCell({ getValue }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
      <BookOpenIcon className="h-4 w-4 text-indigo-500" />
      {getValue()}
    </div>
  );
}

// Attendance Status Cell
export function AttendanceStatusCell({ getValue }) {
  const status = getValue();

  const statusMap = {
    Present: { color: "success", icon: CheckCircleIcon },
    Absent: { color: "error", icon: XCircleIcon },
    Late: { color: "warning", icon: ExclamationTriangleIcon },
    Excused: { color: "info", icon: InformationCircleIcon },
  };

  const { color, icon: Icon } = statusMap[status] || {
    color: "gray",
    icon: InformationCircleIcon,
  };

  return (
    <Badge
      color={color}
      variant="soft"
      className="flex items-center gap-1.5 px-2 py-0.5"
    >
      <Icon className="h-4 w-4" />
      {status}
    </Badge>
  );
}

// PropTypes
TeacherNameCell.propTypes = { getValue: PropTypes.func };
SubjectCell.propTypes = { getValue: PropTypes.func };
AttendanceStatusCell.propTypes = { getValue: PropTypes.func };
