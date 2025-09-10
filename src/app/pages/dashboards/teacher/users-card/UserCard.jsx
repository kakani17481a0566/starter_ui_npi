// src/app/pages/dashboards/teacher/users-card-2/UserCard.jsx

// Import Dependencies
import PropTypes from "prop-types";
import { FaLinkedin } from "react-icons/fa";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Replaced CircularProgressbar with Circlebar
import { Highlight } from "components/shared/Highlight";
import { Avatar, Button, Card, Circlebar } from "components/ui";

// Default assets
import defaultCover from "./The-Neuroscientific-European-Childcare-PDF_12-x-4-ft_Backside-1.png.bv_resized_desktop.png.bv.webp";
import defaultAvatar from "./avatar-11.jpg";

// ----------------------------------------------------------------------

const isUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

// const colorHex = {
//   primary: "#6366f1",
//   secondary: "#F000B9",
//   success: "#10B981",
//   warning: "#FF9800",
//   error: "#FF5724",
// };

const presenceBg = {
  available: "bg-emerald-500",
  busy: "bg-rose-500",
  offline: "bg-gray-400",
};

const badgeIcon = (label) => {
  const key = String(label || "").toLowerCase();
  if (key.includes("top")) return "🏅";
  if (key.includes("mentor")) return "🧭";
  if (key.includes("winner")) return "🏆";
  return "🔹";
};

const formatDate = (value, timezone) => {
  if (!value) return "";
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeZone: timezone || undefined,
    }).format(d);
  } catch {
    return String(value);
  }
};

// Reusable tiny pill
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
  // accentHex,
  linkedin = "",
  name = "",
  role = "",
  query = "",
  progress = 0,
  verified = false,
  presenceStatus = "offline",
  badges = [],
  department = "",
  branch = "",
  joinedAt = "",
  workingHours,
  timezone = "",
  className = "",
}) {
  // const pathColor = accentHex || colorHex[color] || colorHex.primary;
  const progressPct = Math.max(0, Math.min(100, Number(progress) || 0));
  const dotColor = presenceBg[presenceStatus] || presenceBg.offline;

  const prettyRole =
    role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";

  const joinedText = joinedAt ? formatDate(joinedAt, timezone) : "";
  const hoursText =
    workingHours?.start && workingHours?.end
      ? `${workingHours.start}–${workingHours.end}${timezone ? ` (${timezone})` : ""}`
      : "";

  return (
    <div
      className={`transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus-within:shadow-lg ${className}`}
    >
      <Card>
        {/* Cover */}
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

        <div className="px-4 py-2 sm:px-5">
          {/* Avatar + LinkedIn */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative">
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
              <span
                className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-dark-700 ${dotColor} ${
                  presenceStatus === "available" ? "animate-pulse" : ""
                }`}
                aria-label={`Status: ${presenceStatus}`}
              />
            </div>

            {isUrl(linkedin) && (
              <Button
                color="primary"
                variant="soft"
                className="size-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300"
                isIcon
                component="a"
                href={linkedin}
                title="Open LinkedIn"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="size-4 text-primary-600" />
              </Button>
            )}
          </div>

          {/* Name */}
          <h3 className="mt-1 flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-dark-100">
            <span className="truncate max-w-[65%] sm:max-w-[75%]">
              <Highlight query={query}>{name}</Highlight>
            </span>
            {verified && (
              <CheckBadgeIcon
                className="size-4 text-primary-500"
                title="Verified"
                aria-label="Verified account"
              />
            )}
          </h3>

          {/* Role / Department + Progress */}
          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {(prettyRole || department) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-700 dark:text-dark-200">
                  {prettyRole && (
                    <span className="inline-flex items-center gap-1">
                      <AcademicCapIcon className="size-4 text-primary-500" />
                      <span className="truncate">{prettyRole}</span>
                    </span>
                  )}
                  {department && (
                    <span className="inline-flex items-center gap-1">
                      <BuildingOffice2Icon className="size-4 text-primary-500" />
                      <span className="truncate">{department}</span>
                    </span>
                  )}
                </div>
              )}

              {(branch || joinedText || hoursText) && (
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {branch && (
                    <MetaPill
                      icon={<MapPinIcon className="size-4 text-primary-500" />}
                      label={branch}
                      title={branch}
                    />
                  )}
                  {joinedText && (
                    <MetaPill
                      icon={<CalendarDaysIcon className="size-4 text-primary-500" />}
                      label={`Joined ${joinedText}`}
                      title={`Joined ${joinedText}`}
                    />
                  )}
                  {hoursText && (
                    <MetaPill
                      icon={<ClockIcon className="size-4 text-primary-500" />}
                      label={hoursText}
                      title={hoursText}
                    />
                  )}
                </div>
              )}
            </div>

            {/* ✅ Circlebar Progress */}
            <Circlebar value={progressPct} size={32} color="primary" title={`${progressPct}% complete`}>
              <span className="text-[10px] font-semibold text-gray-800 dark:text-dark-100">
                {Math.round(progressPct)}%
              </span>
            </Circlebar>
          </div>

          {/* Badges */}
          {badges?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {badges.map((b, i) => (
                <span
                  key={`${b}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:bg-dark-600 dark:text-dark-200"
                  title={b}
                >
                  <span aria-hidden className="text-primary-500">{badgeIcon(b)}</span>
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
  accentHex: PropTypes.string,
  linkedin: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  query: PropTypes.string,
  progress: PropTypes.number,
  verified: PropTypes.bool,
  presenceStatus: PropTypes.oneOf(["available", "busy", "offline"]),
  badges: PropTypes.arrayOf(PropTypes.string),
  department: PropTypes.string,
  branch: PropTypes.string,
  joinedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  workingHours: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  timezone: PropTypes.string,
  className: PropTypes.string,
};
