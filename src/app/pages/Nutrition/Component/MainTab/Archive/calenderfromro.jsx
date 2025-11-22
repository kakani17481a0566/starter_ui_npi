import { useMemo, useState } from "react";

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
  const [fromISO, setFromISO] = useState("");
  const [toISO, setToISO] = useState("");

  const fromDate = useMemo(
    () => (fromISO ? clampToMidnight(new Date(fromISO)) : null),
    [fromISO],
  );
  const toDate = useMemo(
    () => (toISO ? clampToMidnight(new Date(toISO)) : null),
    [toISO],
  );

  const [rangeStart, rangeEnd] = useMemo(() => {
    if (!fromDate || !toDate) return [null, null];
    if (fromDate <= toDate) return [fromDate, toDate];
    return [toDate, fromDate];
  }, [fromDate, toDate]);

  const dates = useMemo(() => {
    if (!rangeStart || !rangeEnd) return [];
    return iterateInclusiveDates(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  return (
    <div className="">
      {/* ----------------- FILTER ROW ----------------- */}
      <div
        className="flex flex-wrap items-center gap-4 rounded-lg p-4"
        style={{
          background: "#8eb197",
          boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[18px] font-bold text-[#143b48]">From</span>
          <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
            <input
              type="date"
              value={fromISO}
              onChange={(e) => setFromISO(e.target.value)}
              className="text-sm text-[#143b48] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[18px] font-bold text-[#143b48]">To</span>
          <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
            <input
              type="date"
              value={toISO}
              onChange={(e) => setToISO(e.target.value)}
              className="text-sm text-[#143b48] outline-none"
            />
          </div>
        </div>


      </div>

      {/* ----------------- DATE CARDS ----------------- */}
      <div
        className="mt-6 grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
      >
        {dates.length > 0 &&
          dates.map((d) => {
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
                    className="flex flex-col items-stretch overflow-hidden rounded-lg bg-[#effcec]"
                    style={{ minHeight: 170 }}
                  >
                    <div className="flex flex-1 flex-col items-center justify-center pt-4 pb-2">
                      <div className="text-[72px] leading-none font-medium text-[#123d46] select-none">
                        {dd}
                      </div>
                      <div className="text-[14px] font-bold tracking-widest text-[#123d46]">
                        {month}
                      </div>
                    </div>
                    <div className="flex items-center justify-center bg-[#8eb197] py-2">
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-sm font-bold text-white"
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

        {/* ----------------- EMPTY STATE ----------------- */}
        {dates.length === 0 && (
          <div>
            <div
              style={{
                background: "#EFFCEC",
                borderRadius: "9px",
                padding: "14px 18px",
                display: "inline-block",
                whiteSpace: "nowrap", // 🔥 FORCE ONE STRAIGHT LINE
                boxShadow: "0px 3px 6px rgba(0,0,0,0.18)",
              }}
              className="text-left text-sm font-medium text-[#143b48]"
            >
              Select <strong>From</strong> and <strong>To</strong> dates to view
              results
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
