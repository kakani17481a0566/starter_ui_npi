import { useEffect, useState } from "react";
import WeeklyCard from "./WeeklyCard";
import { fetchWeeklyPlan } from "./data"; // axios version
import CalanderIcon from "./CalanderIcon.jsx";

export default function WeeklyCalanders() {
  const [days, setDays] = useState([]);
  const [unlockNote, setUnlockNote] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

  useEffect(() => {
    async function load() {
      const { days, unlockNote } = await fetchWeeklyPlan(1, 1);
      setDays(days);
      setUnlockNote(unlockNote);
    }
    load();
  }, []);

  const leftCol = days.filter((_, i) => i % 2 === 0);
  const rightCol = days.filter((_, i) => i % 2 === 1);

  const handleSelect = (month, date) => {
    const key = `${month}-${date}`;
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  const getActionType = (card) => {
    if (!card.fullDate) return "none";

    if (card.fullDate === todayStr) return "today";
    if (card.fullDate > todayStr) return "future";
    return "past";
  };

  return (
    <div className="w-full bg-white text-slate-800">
      <div className="px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {leftCol.map((card) => {
              const key = `${card.month}-${card.date}`;
              const actionType = getActionType(card);

              return (
                <WeeklyCard
                  key={key}
                  {...card}
                  actionType={actionType}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                />
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {rightCol.slice(0, rightCol.length - 1).map((card) => {
              const key = `${card.month}-${card.date}`;
              const actionType = getActionType(card);

              return (
                <WeeklyCard
                  key={key}
                  {...card}
                  actionType={actionType}
                  selected={selectedKey === key}
                  onSelect={() => handleSelect(card.month, card.date)}
                />
              );
            })}

            {/* UNLOCK CARD */}
           {/* UNLOCK CARD — Styled like WeeklyCard but WITHOUT buttons */}
{unlockNote && days.length > 0 && (
  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex gap-6">

    {/* LEFT — Calendar */}
    <div className="w-[165px] flex-shrink-0">
      <CalanderIcon
        month={days[6].month}
        date={days[6].date}
        weekday={days[6].weekday}
      />
    </div>

    {/* MIDDLE — Unlock Note */}
    <div className="flex flex-col justify-center flex-1">
      <p className="text-[15px] font-semibold text-slate-700">
        {unlockNote.textTop}
      </p>

      <p className="text-[20px] font-bold text-emerald-700 mt-1">
        {unlockNote.textBottom}
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
