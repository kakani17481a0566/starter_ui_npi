import { useState } from "react";
import { Welcome } from "./Welcome";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeekTimeTable } from "./WeekTimeTable";
import { Classes } from "./Classes";
import { WeekDividerCard } from "./WeekDividerCard";

export default function Teacher() {
  const [selectedCourseId, setSelectedCourseId] = useState(null); // ✅ Lifted state

  return (
    <div
      className="transition-content mt-4 grid w-full grid-cols-12 gap-4 pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6"
      style={{
        paddingLeft: "var(--margin-x)",
        paddingRight: "var(--margin-x)",
      }}
    >
      <div className="col-span-12 lg:col-span-8 xl:col-span-9">
        <Welcome />
<Classes selectedCourseId={selectedCourseId} />

        <WeekDividerCard onCourseChange={setSelectedCourseId} />
        <WeekTimeTable selectedCourseId={selectedCourseId} />
      </div>

      <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
        <WorkingHours />
        <Students />
        <Calendar />
      </div>
    </div>
  );
}
