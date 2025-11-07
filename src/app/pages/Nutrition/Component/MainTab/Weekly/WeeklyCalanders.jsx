
import { useState } from "react";
import { days, unlockNote } from "./data";

export default function WeeklyCalanders() {
  // Split days into two columns automatically
  const leftCol = days.filter((_, i) => i % 2 === 0);
  const rightCol = days.filter((_, i) => i % 2 === 1);

  // Track selected card (unique key: month-date)
  const [selectedKey, setSelectedKey] = useState(null);

  const handleSelect = (month, date) => {
    const key = `${month}-${date}`;
    setSelectedKey((prev) => (prev === key ? null : key)); // toggle selection
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800">
      <div className="px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {leftCol.map((card, i) => {
              const key = `${card.month}-${card.date}`;
              return (
                <DayCard
                  key={`L-${i}`}
                  {...card}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                />
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {rightCol.slice(0, rightCol.length - 1).map((card, i) => {
              const key = `${card.month}-${card.date}`;
              return (
                <DayCard
                  key={`R-${i}`}
                  {...card}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                />
              );
            })}

            {/* Unlock Card */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex">
                <CalendarBlock date={25} month="OCTOBER" weekday="Saturday" />
                <div className="flex-1 p-6 flex items-center justify-center">
                  {unlockNote?.enabled && (
                    <div className="rounded-lg bg-emerald-50 px-6 py-5 text-center text-sm leading-6 text-slate-700 shadow-inner">
                      <p className="font-medium">{unlockNote.textTop}</p>
                      <p className="font-semibold text-emerald-700">
                        {unlockNote.textBottom}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function DayCard({
  date,
  month,
  weekday,
  calories,
  statusText,
  statusType,
  selected,
  onSelect,
}) {
  const statusColor = {
    success: "text-emerald-600",
    danger: "text-rose-600",
    muted: "text-slate-400",
    info: "text-sky-600",
  }[statusType || "muted"];

  const cardClasses = selected
    ? "bg-emerald-500 text-white border-emerald-600"
    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:shadow-lg";

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border shadow-md overflow-hidden transition-all duration-300 ${cardClasses}`}
    >
      <div className="flex">
        <CalendarBlock
          date={date}
          month={month}
          weekday={weekday}
          selected={selected}
        />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`text-xs tracking-wide ${
                  selected ? "text-emerald-100" : "text-slate-500"
                }`}
              >
                Total calories achieved
              </p>
              <p
                className={`mt-1 text-base font-semibold ${
                  selected ? "text-white" : "text-sky-700"
                }`}
              >
                {calories} Kcal
              </p>
              <p
                className={`mt-1 text-xs ${
                  selected ? "text-emerald-100" : "text-slate-600"
                }`}
              >
                Review
              </p>
              {statusText && (
                <p
                  className={`mt-1 text-xs ${
                    selected ? "text-emerald-100" : statusColor
                  }`}
                >
                  {statusText}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                className={`h-8 rounded-md px-4 text-sm font-semibold transition-all ${
                  selected
                    ? "bg-white text-emerald-600 hover:bg-emerald-100"
                    : "bg-emerald-500 text-white hover:brightness-110"
                }`}
              >
                Create
              </button>
              <button
                className={`h-8 rounded-md px-6 text-sm font-semibold transition-all ${
                  selected
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-slate-700/90 text-white hover:brightness-110"
                }`}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarBlock({ date, month, weekday, selected }) {
  const bgOuter = selected ? "bg-emerald-600" : "bg-slate-100";
  const bgInner = selected ? "bg-emerald-500 text-white" : "bg-white text-slate-800";
  const spiralColor = selected ? "bg-emerald-300" : "bg-slate-400/70";
  const monthColor = selected ? "text-emerald-100" : "text-slate-500";
  const dayColor = selected ? "text-white" : "text-slate-800";
  const weekColor = selected ? "text-emerald-100" : "text-slate-600";

  return (
    <div className="w-[140px] md:w-[150px] border-r border-slate-200">
      <div className={`m-4 rounded-xl ${bgOuter} p-3 transition-all`}>
        <div className="flex gap-2 pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`h-2 w-4 rounded ${spiralColor}`} />
          ))}
        </div>
        <div className={`rounded-lg ${bgInner} p-3 text-center shadow-inner`}>
          <p
            className={`text-[10px] font-semibold tracking-[0.08em] uppercase ${monthColor}`}
          >
            {month}
          </p>
          <p className={`mt-1 text-[38px] leading-none font-extrabold ${dayColor}`}>
            {String(date).padStart(2, "0")}
          </p>
          <p className={`mt-1 text-xs ${weekColor}`}>{weekday}</p>
        </div>
      </div>
    </div>
  );
}
