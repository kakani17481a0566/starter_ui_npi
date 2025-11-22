import { useEffect, useState } from "react";
import WeeklyCard from "./WeeklyCard";
import { fetchWeeklyPlan } from "./data";
import CalanderIcon from "./CalanderIcon.jsx";

export default function WeeklyCalanders({ onCreateClick, selectedDate }) {
  const [days, setDays] = useState([]);
  const [unlockNote, setUnlockNote] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Convert unlockNote → structured form
  const parseUnlockNote = (textBottom) => {
    if (!textBottom) return null;

    const parts = textBottom.split(" "); // "24 Monday, November"
    const date = parts[0];
    const weekday = parts[1].replace(",", "");
    const month = parts[2];

    const yyyy = today.getFullYear();
    const monthIndex = new Date(`${month} 1, ${yyyy}`).getMonth() + 1;

    const mm = String(monthIndex).padStart(2, "0");
    const dd = String(date).padStart(2, "0");

    return {
      date,
      weekday,
      month: month.toUpperCase(),
      fullDate: `${yyyy}-${mm}-${dd}`,
    };
  };

  // Highlight selected card when returning from Daily Plan
  useEffect(() => {
    if (!selectedDate) return;

    const d = new Date(selectedDate);
    const month = d.toLocaleString("en-US", { month: "long" }).toUpperCase();
    const dayNumber = d.getDate();

    setSelectedKey(`${month}-${dayNumber}`);
  }, [selectedDate]);

  // Load Weekly Data
  useEffect(() => {
    async function load() {
      const { days, unlockNote } = await fetchWeeklyPlan(1, 1);

      // 👉 DO NOT FILTER — BACKEND ALREADY RETURNS EXACT 7 DAYS
      setDays(days);

      if (unlockNote?.enabled) {
        const parsed = parseUnlockNote(unlockNote.textBottom);
        setUnlockNote({ ...unlockNote, ...parsed });
      } else {
        setUnlockNote(null);
      }
    }
    load();
  }, []);

  const getActionType = (card) => {
    if (card.fullDate < todayStr) return "past";
    if (card.fullDate === todayStr) return "today";
    return "future";
  };

  const leftCol = days.filter((_, i) => i % 2 === 0);
  const rightCol = days.filter((_, i) => i % 2 === 1);

  const handleSelect = (month, date) => {
    const key = `${month}-${date}`;
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="w-full bg-white text-slate-800">
      <div className="px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {leftCol.map((card) => {
              const key = `${card.month}-${card.date}`;
              return (
                <WeeklyCard
                  key={key}
                  {...card}
                  actionType={getActionType(card)}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                  onCreate={() => onCreateClick(card.fullDate)}
                  onEdit={() => onCreateClick(card.fullDate)}
                />
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {rightCol.map((card) => {
              const key = `${card.month}-${card.date}`;
              return (
                <WeeklyCard
                  key={key}
                  {...card}
                  actionType={getActionType(card)}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                  onCreate={() => onCreateClick(card.fullDate)}
                  onEdit={() => onCreateClick(card.fullDate)}
                />
              );
            })}

            {/* UNLOCK NOTE */}
            {unlockNote && (
              <div className="rounded-xl border p-4 flex gap-6 shadow-sm bg-white">
                <div className="w-[165px] flex-shrink-0">
                  <CalanderIcon
                    month={unlockNote.month}
                    date={unlockNote.date}
                    weekday={unlockNote.weekday}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-[15px] font-semibold text-slate-700">
                    {unlockNote.textTop}
                  </p>

                  <p className="mt-1 text-[20px] font-bold text-emerald-700 leading-tight">
                    {unlockNote.textBottom}
                  </p>

                  <p className="text-[13px] text-slate-500 mt-1">
                    Next week unlocks automatically.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
