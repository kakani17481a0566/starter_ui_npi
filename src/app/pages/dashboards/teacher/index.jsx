import { useMemo, useState } from "react";
import { Page } from "components/shared/Page";
import { Welcome } from "./Welcome";
import { UserCard } from "./users-card/UserCard"; // named export
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeekTimeTable } from "./WeekTimeTable";
import { Classes } from "./Classes";
import { VerticalDividerCard } from "./VerticalDividerCard";

// ✅ Import the avatar asset from src so Vite bundles it correctly
import avatar11 from "./users-card/avatar-11.jpg";

// ------------------------------------------------------------
// Dummy data
const DUMMY_ROLE = "Teacher";
const DUMMY_USER = {
  name: "Konnor ssss",
  avatar: avatar11,                    // <-- use imported URL
  // cover intentionally omitted so the card uses its default .webp
  linkedin: "https://www.linkedin.com/in/konnor",
  color: "primary",
  progress: 72, // 0–100
  verified: true,
  presenceStatus: "available", // "available" | "busy" | "offline"
  badges: ["Top Instructor"],
  department: "Mathematics",

  // Extra fields your UserCard supports
  branch: "Downtown Campus",
  joinedAt: "2023-02-01",
  workingHours: { start: "09:00", end: "17:00" },
  timezone: "America/New_York",
};

const DUMMY_COURSES = [
  { id: 1, title: "Algebra I" },
  { id: 2, title: "Geometry" },
];

// Utils
const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n) || 0));
// ------------------------------------------------------------

export default function Teacher() {
  const role = DUMMY_ROLE; // "Teacher" | "Parent" | ...
  const isParent = role?.toUpperCase() === "PARENT";

  // Initialize with first dummy course (no effect needed)
  const [selectedCourse, setSelectedCourse] = useState(DUMMY_COURSES[0] ?? null);

  // Build props for <UserCard />
  const userCardData = useMemo(() => {
    const colorByRole = {
      Teacher: "primary",
      Student: "success",
      Admin: "error",
      Parent: "warning",
    };

    return {
      // identity & visuals
      avatar: DUMMY_USER.avatar,
      // cover omitted -> will use UserCard's default cover
      color: colorByRole[role] || DUMMY_USER.color,

      // socials
      linkedin: DUMMY_USER.linkedin,

      // meta
      name: DUMMY_USER.name,
      role,
      query: "",

      // progress
      progress: clamp(DUMMY_USER.progress, 0, 100),

      // extras supported by UserCard
      verified: !!DUMMY_USER.verified,
      presenceStatus: DUMMY_USER.presenceStatus,
      badges: DUMMY_USER.badges,
      department: DUMMY_USER.department,
      branch: DUMMY_USER.branch,
      joinedAt: DUMMY_USER.joinedAt,
      workingHours: DUMMY_USER.workingHours,
      timezone: DUMMY_USER.timezone,
    };
  }, [role]);

  return (
    <Page title={`${role} Dashboard`}>
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-[var(--margin-x)] pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        {/* Left column */}
        <div className={`col-span-12 ${isParent ? "" : "lg:col-span-8 xl:col-span-9"}`}>
          <Welcome />
          <Classes courseId={selectedCourse?.id} />
          {!isParent && (
            <VerticalDividerCard
              onCourseSelect={(course) => {
                setSelectedCourse(course);
              }}
            />
          )}
          <WeekTimeTable courseId={selectedCourse?.id} />
        </div>

        {/* Right sidebar */}
        {!isParent && (
          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
            <UserCard {...userCardData} />
            <Students />
            <Calendar />
          </div>
        )}
      </div>
    </Page>
  );
}
