// src/app/pages/dashboards/ParentStudent/Student-card/UserCard.jsx

import PropTypes from "prop-types";
import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  // ClockIcon,
} from "@heroicons/react/24/outline";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Highlight } from "components/shared/Highlight";
import { Avatar, Card } from "components/ui";

import defaultCover from "./The-Neuroscientific-European-Childcare-PDF_12-x-4-ft_Backside-1.png.bv_resized_desktop.png.bv.webp";
import defaultAvatar from "./avatar-11.jpg";

// ----------------------------------------------------------------------

const colorHex = {
  primary: "#6366f1",
  secondary: "#F000B9",
  success: "#10B981",
  warning: "#FF9800",
  error: "#FF5724",
};

// 🔹 Format date (DOB)
const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

function RadialSeparatorsSVG({
  count = 12,
  color = "#fff",
  strokeWidth = 2,
  innerRadiusPct = 46,
  outerRadiusPct = 50,
}) {
  const lines = Array.from({ length: count }, (_, i) => {
    const angle = (i * 2 * Math.PI) / count;
    const x1 = 50 + innerRadiusPct * Math.sin(angle);
    const y1 = 50 - innerRadiusPct * Math.cos(angle);
    const x2 = 50 + outerRadiusPct * Math.sin(angle);
    const y2 = 50 - outerRadiusPct * Math.cos(angle);
    return (
      <line
        key={i}
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0"
      preserveAspectRatio="xMidYMid meet"
    >
      {lines}
    </svg>
  );
}

const badgeIcon = (label) => {
  const key = String(label || "").toLowerCase();
  if (key.includes("top")) return "🏅";
  if (key.includes("winner")) return "🏆";
  return "🔹";
};

function MetaPill({ icon, label, title }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-gray-200
                 bg-white/80 px-2 py-0.5 text-[11px] text-gray-700 shadow-sm
                 backdrop-blur-sm dark:border-dark-500 dark:bg-dark-700/60 dark:text-dark-200"
      title={title || label}
    >
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}

MetaPill.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export function UserCard({
  avatar,
  cover,
  color = "primary",
  name = "",
  role = "", // Grade
  query = "",
  progress = 0,
  badges = [],
  department = "", // Section
  branch = "",
  dob = "",        // 🔹 NEW
  workingHours,
  timezone = "",
  className = "",
  bloodGroup = "",
}) {
  const pathColor = colorHex[color] || colorHex.primary;
  const progressPct = Math.max(0, Math.min(100, Number(progress) || 0));

  const prettyRole =
    role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";

  const hoursText =
    workingHours?.start && workingHours?.end
      ? `${workingHours.start}–${workingHours.end}${timezone ? ` (${timezone})` : ""}`
      : "";
      console.log(hoursText)

  return (
    <div
      className={`transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus-within:shadow-lg ${className}`}
    >
      <Card>
        {/* Cover image */}
        <div className="relative h-24 overflow-hidden rounded-t-lg bg-primary-500">
          <img
            src={cover || defaultCover}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            loading="lazy"
            decoding="async"
            alt={`${name || "User"} cover`}
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 rounded-t-lg bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="px-4 py-3 sm:px-5">
          {/* Header row: Avatar + Name + Progress ring */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                size={20}
                name={name}
                src={avatar || defaultAvatar}
                initialColor={color}
                classNames={{
                  root: "-mt-12 transition-transform duration-200 hover:scale-[1.02]",
                  display:
                    "border-2 border-white shadow-sm ring-1 ring-black/5 text-2xl dark:border-dark-700",
                }}
              />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100">
                  <Highlight query={query}>{name}</Highlight>
                </h3>
              </div>
            </div>

            {/* Progress ring */}
            <div
              className="relative h-14 w-14 sm:h-16 sm:w-16"
              title={`${progressPct}% complete`}
            >
              <CircularProgressbar
                value={progressPct}
                text={`${Math.round(progressPct)}%`}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor,
                  trailColor: "rgba(148,163,184,0.25)",
                  textColor: pathColor,
                  textSize: "26px",
                  strokeLinecap: "butt",
                })}
                aria-label={`${name || "User"} progress ${progressPct}%`}
              />
              <RadialSeparatorsSVG count={12} color="#fff" strokeWidth={2} />
            </div>
          </div>

          {/* Role / Section / Branch / Blood Group / DOB */}
          <div className="mt-3 flex flex-col gap-2 text-sm text-gray-700 dark:text-dark-200">
            {(prettyRole || department) && (
              <div className="flex items-center gap-3">
                {prettyRole && (
                  <span className="inline-flex items-center gap-1">
                    <AcademicCapIcon className="size-4 text-primary-500" />
                    {prettyRole}
                  </span>
                )}
                {department && (
                  <span className="inline-flex items-center gap-1">
                    <BuildingOffice2Icon className="size-4 text-primary-500" />
                    {department}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {branch && (
                <MetaPill
                  icon={<MapPinIcon className="size-4 text-primary-500" />}
                  label={branch}
                  title={branch}
                />
              )}
              {dob && (
                <MetaPill
                  icon={<span className="text-blue-500">🎂</span>}
                  label={`DOB: ${formatDate(dob)}`}
                  title={`Date of Birth: ${dob}`}
                />
              )}
              {bloodGroup && (
                <MetaPill
                  icon={<span className="text-red-500">🩸</span>}
                  label={`Blood: ${bloodGroup}`}
                  title={`Blood Group: ${bloodGroup}`}
                />
              )}
            </div>
          </div>

          {/* Awards */}
          {badges?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <span
                  key={`${b}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-dark-600 dark:text-dark-200"
                  title={b}
                >
                  <span aria-hidden className="text-primary-500">
                    {badgeIcon(b)}
                  </span>
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

UserCard.propTypes = {
  avatar: PropTypes.string,
  cover: PropTypes.string,
  color: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  query: PropTypes.string,
  progress: PropTypes.number,
  badges: PropTypes.arrayOf(PropTypes.string),
  department: PropTypes.string,
  branch: PropTypes.string,
  dob: PropTypes.string,   // 🔹 NEW
  workingHours: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  timezone: PropTypes.string,
  className: PropTypes.string,
  bloodGroup: PropTypes.string,
};
