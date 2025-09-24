// src/app/pages/dashboards/teacher/index.jsx
import { useMemo, useState, useEffect } from "react";
import { Page } from "components/shared/Page";
import { Welcome } from "./Welcome";
import { UserCard } from "./users-card/UserCard";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeekTimeTable } from "./WeekTimeTable";
import { Classes } from "./Classes";
import { VerticalDividerCard } from "./VerticalDividerCard";

import avatar11 from "./users-card/avatar-11.jpg";
import { getSessionData } from "utils/sessionStorage";

const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n) || 0));

const API_BASE = "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/";

const mapProfileToCamelCase = (apiData) => {
  if (!apiData) return null;
  return {
    userId: apiData.userId,
    username: apiData.username,
    fullName: apiData.fullName,
    email: apiData.email,
    mobileNumber: apiData.mobileNumber,
    roleName: apiData.roleName,
    totalCourses: apiData.totalCourses,
    coursesTaught: apiData.coursesTaught,
    totalBranches: apiData.totalBranches,
    branches: apiData.branches,
    joiningDate: apiData.joiningDate,
    workingStartTime: apiData.workingStartTime,
    workingEndTime: apiData.workingEndTime,
    userStatus: apiData.userStatus,
    userCreatedOn: apiData.userCreatedOn,
    userLastUpdated: apiData.userLastUpdated,
    roleAssignedOn: apiData.roleAssignedOn,
  };
};

export default function Teacher() {
  const session = getSessionData();
  const userId = session?.userId;
  const tenantId = session?.tenantId;

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!userId || !tenantId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/User/${userId}/profile-summary?tenantId=${tenantId}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        const summary = mapProfileToCamelCase(data.data);
        setProfile(summary);

        if (summary?.coursesTaught) {
          const courseArray = summary.coursesTaught
            .split(",")
            .map((name, index) => ({
              id: index + 1, // ✅ ensures unique id
              title: name.trim(),
            }));
          setCourses(courseArray);
          setSelectedCourse(courseArray[0] ?? null);
        }
      } catch (err) {
        console.error("Error fetching user profile summary:", err);
      }
    };

    fetchProfile();
  }, [userId, tenantId]);

  const USER = useMemo(() => {
    if (profile) {
      return {
        name: profile.fullName,
        avatar: session.imageUrl || avatar11,
        linkedin: session.userProfile?.linkedin || "",
        color: "primary",
        progress: 0,
        verified: false,
        presenceStatus: "available",
        badges: [],
        department: profile.roleName,
        branch: profile.branches,
        joinedAt: profile.joiningDate,
        workingHours:
          profile.workingStartTime !== "N/A" &&
          profile.workingEndTime !== "N/A"
            ? {
                start: profile.workingStartTime,
                end: profile.workingEndTime,
              }
            : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    return {
      name: session.user ?? "Guest",
      avatar: session.imageUrl || avatar11,
      linkedin: session.userProfile?.linkedin || "",
      color: "primary",
      progress: session.userProfile?.progress ?? 0,
      verified: session.userProfile?.verified ?? false,
      presenceStatus: session.userProfile?.presenceStatus ?? "offline",
      badges: session.userProfile?.badges ?? [],
      department: session.department || "N/A",
      branch: session.branch || "N/A",
      joinedAt: session.userProfile?.joinedAt ?? null,
      workingHours: session.userProfile?.workingHours ?? null,
      timezone: session.userProfile?.timezone ?? null,
    };
  }, [profile, session]);

  const role = profile?.roleName || session.role || "Teacher";
  const isParent = role?.toUpperCase() === "PARENT";

  const userCardData = useMemo(() => {
    const colorByRole = {
      Teacher: "primary",
      Student: "success",
      Admin: "error",
      Parent: "warning",
    };

    return {
      avatar: USER.avatar,
      color: colorByRole[role] || USER.color,
      linkedin: USER.linkedin,
      name: USER.name,
      role,
      query: "",
      progress: clamp(USER.progress, 0, 100),
      verified: USER.verified,
      presenceStatus: USER.presenceStatus,
      badges: USER.badges,
      department: USER.department,
      branch: USER.branch,
      joinedAt: USER.joinedAt,
      workingHours: USER.workingHours,
      timezone: USER.timezone,
      profileSummary: profile,
    };
  }, [USER, role, profile]);

  return (
    <Page title={`${role} Dashboard`}>
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-[var(--margin-x)] pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        {/* Left column */}
        <div
          className={`col-span-12 ${
            isParent ? "" : "lg:col-span-8 xl:col-span-9"
          }`}
        >
          <Welcome />

          {!isParent && (
            <div className="block lg:hidden mt-4 sm:mt-5">
              <UserCard {...userCardData} />
            </div>
          )}

          <Classes courseId={selectedCourse?.id} />

          {!isParent && (
            <VerticalDividerCard
              courses={courses}
              onCourseSelect={(course) => setSelectedCourse(course)}
            />
          )}

          <WeekTimeTable courseId={selectedCourse?.id} />
        </div>

        {/* Right sidebar */}
        {!isParent && (
          <div className="col-span-12 hidden grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3 lg:grid">
            <UserCard {...userCardData} />
            <Students
              courseId={selectedCourse?.id}
              courseName={selectedCourse?.title}
            />
            <Calendar />
          </div>
        )}
      </div>
    </Page>
  );
}
