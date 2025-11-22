import  { useMemo, useState } from "react";

function formatDayNumber(d) {
  const dd = d.getDate();
  return dd < 10 ? `0${dd}` : `${dd}`;
}
function formatMonthUpper(d) {
  return d.toLocaleString("en-US", { month: "long" }).toUpperCase();
}
function toISODateInputString(d) {
  const yyyy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  return `${yyyy}-${mm < 10 ? "0" + mm : mm}-${dd < 10 ? "0" + dd : dd}`;
}
function clampToMidnight(date) {
  const t = new Date(date);
  t.setHours(0, 0, 0, 0);
  return t;
}
function iterateInclusiveDates(start, end) {
  const out = [];
  const cur = new Date(start.getTime());
  while (cur <= end) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export default function DateRangeCards() {
  const [fromISO, setFromISO] = useState("2025-10-01");
  const [toISO, setToISO] = useState("2025-10-30");

  const fromDate = useMemo(() => clampToMidnight(new Date(fromISO)), [fromISO]);
  const toDate = useMemo(() => clampToMidnight(new Date(toISO)), [toISO]);

  const [rangeStart, rangeEnd] = useMemo(() => {
    if (fromDate <= toDate) return [fromDate, toDate];
    return [toDate, fromDate];
  }, [fromDate, toDate]);

  const dates = useMemo(() => iterateInclusiveDates(rangeStart, rangeEnd), [rangeStart, rangeEnd]);

  return (
    <div className="p-6  mx-auto">
      <div
        className="rounded-lg p-4 flex flex-wrap items-center gap-4"
        style={{ background: "#8eb197", boxShadow: "0 3px 6px rgba(0,0,0,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[18px] font-bold text-[#143b48]">From</span>
          <div className="bg-white rounded-full px-4 py-2 flex items-center shadow-sm">
            <input
              type="date"
              value={fromISO}
              onChange={(e) => setFromISO(e.target.value)}
              className="outline-none text-[#143b48] text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[18px] font-bold text-[#143b48]">To</span>
          <div className="bg-white rounded-full px-4 py-2 flex items-center shadow-sm">
            <input
              type="date"
              value={toISO}
              onChange={(e) => setToISO(e.target.value)}
              className="outline-none text-[#143b48] text-sm"
            />
          </div>
        </div>

        <div className="ml-auto text-sm text-[#143b48]">
          {dates.length > 0 && (
            <span>
              Showing <strong>{dates.length}</strong> day{dates.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div
        className="mt-6 grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
      >
        {dates.map((d) => {
          const dd = formatDayNumber(d);
          const month = formatMonthUpper(d);
          const key = toISODateInputString(d);
          return (
            <div key={key} className="relative">
              <div
                className="rounded-lg"
                style={{
                  background: "#8eb197",
                  borderRadius: 12,
                  padding: 6,
                  boxShadow: "0 3px 6px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  className="bg-[#effcec] rounded-lg overflow-hidden flex flex-col items-stretch"
                  style={{ minHeight: 170 }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-2">
                    <div className="text-[72px] font-medium text-[#123d46] leading-none select-none">
                      {dd}
                    </div>
                    <div className="text-[14px] font-bold text-[#123d46] tracking-widest">
                      {month}
                    </div>
                  </div>
                  <div className="bg-[#8eb197] flex items-center justify-center py-2">
                    <button
                      type="button"
                      className="text-white text-sm font-bold px-2 py-1 rounded"
                      onClick={() => alert(`View report for ${key}`)}
                    >
                      View report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {dates.length === 0 && (
          <div className="col-span-full text-center text-gray-600 py-12">
            No dates in range
          </div>
        )}
      </div>
    </div>
  );
}
