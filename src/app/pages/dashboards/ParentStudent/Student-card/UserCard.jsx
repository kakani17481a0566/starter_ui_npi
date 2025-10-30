// Updated UserCard.jsx using CirclebarWithSeparators

import PropTypes from "prop-types";
import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  IdentificationIcon,
  UserCircleIcon,
  LanguageIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import { Highlight } from "components/shared/Highlight";
import { Avatar, Card } from "components/ui";
import CirclebarWithSeparators from "components/shared/CirclebarWithSeparators";

// ✅ Imports for cover and kid fallback avatars
import defaultCover from "./The-Neuroscientific-European-Childcare-PDF_12-x-4-ft_Backside-1.png.bv_resized_desktop.png.bv.webp";
import kidBoyAvatar from "assets/kidav.jpg";
import kidGirlAvatar from "assets/kidav2.jpg";

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

function MetaPill({ icon, label, title }) {
  return (
    <span
      className="dark:border-dark-500 dark:bg-dark-700/60 dark:text-dark-200 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-2 py-0.5 text-[11px] text-gray-700 shadow-sm backdrop-blur-sm"
      title={title || label}
    >
      <span className="text-primary-500">{icon}</span>
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
  role = "",
  query = "",
  progress = 0,
  badges = [],
  department = "",
  branch = "",
  dob = "",
  workingHours,
  timezone = "",
  className = "",
  bloodGroup = "",
  admissionNumber = "",
  studentId = "",
  academicYear = "",
  nationality = "",
  religion = "",
  motherTongue = "",
  addressLine1 = "",
  city = "",
  gender = "", // ✅ add gender prop to decide fallback avatar
}) {
  const progressPct = Math.max(0, Math.min(100, Number(progress) || 0));

  const prettyRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : "";

  const hoursText =
    workingHours?.start && workingHours?.end
      ? `${workingHours.start}–${workingHours.end}${
          timezone ? ` (${timezone})` : ""
        }`
      : "";

  // ✅ pick correct fallback based on gender
  const fallbackAvatar =
    gender === "male"
      ? kidBoyAvatar
      : gender === "female"
      ? kidGirlAvatar
      : kidBoyAvatar; // default to boy if unknown

  return (
    <div
      className={`flex h-full flex-col justify-between transition-all duration-200 focus-within:shadow-lg hover:-translate-y-0.5 hover:shadow-lg ${className}`}
    >
      <Card className="flex h-full flex-col">
        <div className="bg-primary-500 relative h-35 overflow-hidden rounded-t-lg">
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

        <div className="flex flex-col space-y-3 px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* ✅ Avatar uses gender-based kid fallback */}
              <Avatar
                size={20}
                name={name}
                src={avatar || fallbackAvatar}
                initialColor={color}
                classNames={{
                  root: "-mt-10 transition-transform duration-200 hover:scale-[1.02]",
                  display:
                    "dark:border-dark-700 border-2 border-white text-2xl shadow-sm ring-1 ring-black/5",
                }}
              />
              <div>
                <h3 className="dark:text-dark-100 text-base font-semibold text-gray-800">
                  <Highlight query={query}>{name}</Highlight>
                </h3>
              </div>
            </div>

            <CirclebarWithSeparators
              value={progressPct}
              size={40}
              strokeWidth={4}
              separatorCount={12}
              color={
                color === "primary"
                  ? "var(--color-primary-500)"
                  : color === "secondary"
                  ? "var(--color-secondary-500)"
                  : "#6366f1"
              }
              className="mr-1"
            >
              <span className="dark:text-dark-100 font-semibold text-gray-800">
                {Math.round(progressPct)}%
              </span>
            </CirclebarWithSeparators>
          </div>

          <div className="dark:text-dark-200 flex flex-col gap-2 text-sm text-gray-700">
            {(prettyRole || department) && (
              <div className="flex items-center gap-3">
                {prettyRole && (
                  <span className="inline-flex items-center gap-1">
                    <AcademicCapIcon className="text-primary-500 size-4" />
                    {prettyRole}
                  </span>
                )}
                {department && (
                  <span className="inline-flex items-center gap-1">
                    <BuildingOffice2Icon className="text-primary-500 size-4" />
                    {department}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {admissionNumber && (
                <MetaPill
                  icon={<IdentificationIcon className="size-4" />}
                  label={`Adm: ${admissionNumber}`}
                />
              )}
              {studentId && (
                <MetaPill
                  icon={<UserCircleIcon className="size-4" />}
                  label={`ID: ${studentId}`}
                />
              )}
              {branch && (
                <MetaPill
                  icon={<MapPinIcon className="size-4" />}
                  label={branch}
                  title={branch}
                />
              )}
              {academicYear && (
                <MetaPill
                  icon={<CalendarDaysIcon className="size-4" />}
                  label={academicYear}
                />
              )}
              {dob && (
                <MetaPill
                  icon={<CalendarDaysIcon className="size-4" />}
                  label={`DOB: ${formatDate(dob)}`}
                />
              )}
              {bloodGroup && (
                <MetaPill
                  icon={<span className="size-4">🩸</span>}
                  label={`Blood: ${bloodGroup}`}
                />
              )}
              {nationality && (
                <MetaPill
                  icon={<GlobeAltIcon className="size-4" />}
                  label={nationality}
                />
              )}
              {religion && (
                <MetaPill
                  icon={<span className="size-4">🕊️</span>}
                  label={religion}
                />
              )}
              {motherTongue && (
                <MetaPill
                  icon={<LanguageIcon className="size-4" />}
                  label={motherTongue}
                />
              )}
              {addressLine1 && city && (
                <MetaPill
                  icon={<MapPinIcon className="size-4" />}
                  label={`${addressLine1}, ${city}`}
                />
              )}
            </div>

            {hoursText && (
              <div className="dark:text-dark-400 text-xs text-gray-500">
                Hours: {hoursText}
              </div>
            )}
          </div>

          {badges?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {badges.map((b, i) => (
                <span
                  key={`${b}-${i}`}
                  className="dark:bg-dark-600 dark:text-dark-200 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                  title={b}
                >
                  <span aria-hidden className="text-primary-500">🏅</span>
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
  dob: PropTypes.string,
  workingHours: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  timezone: PropTypes.string,
  className: PropTypes.string,
  bloodGroup: PropTypes.string,
  admissionNumber: PropTypes.string,
  studentId: PropTypes.string,
  academicYear: PropTypes.string,
  nationality: PropTypes.string,
  religion: PropTypes.string,
  motherTongue: PropTypes.string,
  addressLine1: PropTypes.string,
  city: PropTypes.string,
  gender: PropTypes.string, // ✅ new prop
};
