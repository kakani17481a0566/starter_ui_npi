import { useState } from "react";
import { days, unlockNote } from "./data";
import WeeklyCard from "./WeeklyCard";

export default function WeeklyCalanders() {
  const leftCol = days.filter((_, i) => i % 2 === 0);
  const rightCol = days.filter((_, i) => i % 2 === 1);

  const [selectedKey, setSelectedKey] = useState(null);

  const handleSelect = (month, date) => {
    const key = `${month}-${date}`;
    setSelectedKey((prev) => (prev === key ? null : key)); // toggle
  };

  return (
    <div className="w-full bg-white text-slate-800">
      <div className="px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {leftCol.map((card, ) => {
              const key = `${card.month}-${card.date}`;
              return (
                <WeeklyCard
                  key={key}
                  {...card}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                />
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {rightCol.slice(0, rightCol.length - 1).map((card, ) => {
              const key = `${card.month}-${card.date}`;
              return (
                <WeeklyCard
                  key={key}
                  {...card}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                />
              );
            })}

            {/* UNLOCK CARD */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex">
                <div className="w-[150px] border-r border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    OCTOBER
                  </p>
                  <p className="mt-2 text-4xl leading-none font-bold text-slate-800">
                    25
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Saturday</p>
                </div>

                <div className="flex flex-1 items-center justify-center p-6">
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
