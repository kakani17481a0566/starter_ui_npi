import { useEffect, useState } from "react";

// Local Imports
import { Page } from "components/shared/Page";
import { Welcome } from "./Welcome";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeekTimeTable } from "./WeekTimeTable";
import { Classes } from "./Classes";
import { VerticalDividerCard } from "./VerticalDividerCard";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

export default function Teacher() {
  const { course: allCourses } = getSessionData();
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Load stored course or fallback to lowest ID course
  useEffect(() => {
    if (allCourses?.length > 0) {
      const storedId = Number(localStorage.getItem("selectedCourseId"));
      const initial =
        allCourses.find((c) => c.id === storedId) ||
        allCourses.reduce((min, c) => (c.id < min.id ? c : min), allCourses[0]);

      setSelectedCourse(initial);
    }
  }, [allCourses]);

  return (
    <Page title="Teacher Dashboard">
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-[var(--margin-x)] pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        {/* Left Side - Main Dashboard Content */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <Welcome />

          {/* ✅ Passing courseId to Cl+asses */}
          <Classes courseId={selectedCourse?.id} />

          <VerticalDividerCard
            onCourseSelect={(course) => {
              setSelectedCourse(course);
              localStorage.setItem("selectedCourseId", course.id);
            }}
          />

          {/* ✅ Passing courseId to WeekTimeTable */}
          <WeekTimeTable courseId={selectedCourse?.id} />
        </div>

        {/* Right Side - Sidebar Widgets */}
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
