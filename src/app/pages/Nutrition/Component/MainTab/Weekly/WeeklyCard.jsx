// WeeklyCard.jsx
import CalanderIcon from "./CalanderIcon.jsx";


export const customColors = {
  cardBackground: "#fff",
  headerGreen: "#8eb197",
  kcalBlue: "#7985f2",
  reviewGold: "#bb921e",
  createBtn: "#bfc",
  editBtn: "#8eb297",
  darkText: "#1a4255",
  calendarPaper: "#f4f4f4",
  binderGrey: "#6d6d6d",
  holeRed: "#ed4f4f",
};


const ActionButton = ({ label, bg }) => (
  <button
    className="w-[135px] py-[6px] rounded-md text-[15px] font-bold"
    style={{
      backgroundColor: bg,
      color: customColors.darkText,
      height: 34,
      boxShadow: "3px 3px 6px rgba(0,0,0,0.25)",
      fontFamily: "Segoe UI Bold",
    }}
  >
    {label}
  </button>
);

export default function WeeklyCard({
  month,
  date,
  weekday,
  calories,
  statusText,
  onSelect,
  selected,
}) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-xl cursor-pointer border transition-all shadow-sm ${
        selected
          ? "bg-[#EFFCEC] border-[#8eb197] shadow-md"
          : "bg-white border-slate-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-stretch p-4 gap-6">

        {/* LEFT — Calendar with Text */}
        <div className="w-[165px] flex-shrink-0">
          <CalanderIcon
            className="w-full h-auto"
            month={month}
            date={date}
            weekday={weekday}
          />
        </div>

        {/* MIDDLE */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[15px]" style={{ color: customColors.darkText }}>
            Total calories achieved
          </p>

          <p
            className="text-[24px] font-extrabold"
            style={{ color: customColors.kcalBlue, fontFamily: "Segoe UI Bold" }}
          >
            {calories} Kcal
          </p>

          <p className="text-[15px] mt-2" style={{ color: customColors.darkText }}>
            Review
          </p>

          <p
            className="text-[17px] font-semibold"
            style={{ color: customColors.reviewGold }}
          >
            {statusText}
          </p>
        </div>

        {/* RIGHT — Buttons */}
        <div className="flex flex-col justify-center gap-3">
          <ActionButton label="Create" bg={customColors.createBtn} />
          <ActionButton label="Edit" bg={customColors.editBtn} />
        </div>

      </div>
    </div>
  );
}
