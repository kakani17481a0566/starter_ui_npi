// CalendarBlockCompact.jsx
import { customColors } from "./PremiumWeeklyCard";

const CalendarBinding = () => {
  const BINDER_COUNT = 7;
  return (
    <div className="absolute top-[-8px] left-0 right-0 flex justify-between px-3 z-10">
      {[...Array(BINDER_COUNT)].map((_, i) => (
        <div key={i} className="relative" style={{ width: 6, height: 13 }}>
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              backgroundColor: customColors.binderGrey,
              boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                backgroundColor: customColors.holeRed,
                width: 6,
                height: 4,
                bottom: "-2px",
                left: 0,
                zIndex: -1,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CalendarBlockCompact({ month, date, weekday }) {
  return (
    <div className="w-[145px] flex-shrink-0">
      <div
        className="relative text-center pt-[40px]"
        style={{
          backgroundColor: customColors.calendarPaper,
          borderRadius: "11px",
          minHeight: "150px",
        }}
      >
        {/* Header */}
        <div
          className="absolute top-0 left-0 w-full py-[8px] rounded-t-xl flex justify-center items-center"
          style={{ backgroundColor: customColors.headerGreen, height: 40 }}
        >
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: customColors.darkText }}
          >
            {month}
          </span>
        </div>

        {/* Binding Rings */}
        <CalendarBinding />

        {/* Date + weekday */}
        <div className="pt-3 pb-4 flex flex-col items-center">
          <p
            className="font-extrabold leading-none"
            style={{
              fontSize: "42px",
              color: customColors.darkText,
              fontFamily: "Segoe UI Bold",
            }}
          >
            {date}
          </p>
          <p className="text-sm mt-1" style={{ color: customColors.darkText }}>
            {weekday}
          </p>
        </div>
      </div>
    </div>
  );
}
