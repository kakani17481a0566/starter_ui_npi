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
};

// -------------------------------------------------------------
// ⭐ Reusable Action Button
// -------------------------------------------------------------
const ActionButton = ({ label, bg, onClick, disabled }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled && onClick) onClick();
    }}
    disabled={disabled}
    className={`w-[135px] py-[6px] rounded-md text-[15px] font-bold transition
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
    `}
    style={{
      backgroundColor: bg,
      color: customColors.darkText,
      height: 34,
      boxShadow: disabled ? "none" : "3px 3px 6px rgba(0,0,0,0.25)",
      fontFamily: "Segoe UI Bold",
    }}
  >
    {label}
  </button>
);

// -------------------------------------------------------------
// ⭐ WEEKLY CARD COMPONENT
// -------------------------------------------------------------
export default function WeeklyCard({
  month,
  date,
  weekday,
  calories,
  statusText,
  selected,
  onSelect,
  onCreate,
  onEdit,
  actionType,        // "past" | "today" | "futureThisWeek" | "futureOutside"
}) {

  // FINAL RULES
  const disableCreate =
    actionType === "past" || actionType === "futureOutside";

  const disableEdit =
    actionType === "past" || actionType === "futureOutside";

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl cursor-pointer border transition-all shadow-sm ${
        selected
          ? "bg-[#EFFCEC] border-[#8eb197] shadow-md"
          : "bg-white border-slate-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-stretch gap-6 p-4">

        {/* Calendar */}
        <div className="w-[165px] flex-shrink-0">
          <CalanderIcon month={month} date={date} weekday={weekday} />
        </div>

        {/* Calories & Review */}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[15px]" style={{ color: customColors.darkText }}>
            Total calories achieved
          </p>

          <p className="text-[24px] font-extrabold"
            style={{ color: customColors.kcalBlue }}>
            {calories} Kcal
          </p>

          <p className="mt-2 text-[15px]" style={{ color: customColors.darkText }}>
            Review
          </p>

          <p className="text-[17px] font-semibold"
            style={{ color: customColors.reviewGold }}>
            {statusText}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-3">

          <ActionButton
            label="Create"
            bg={customColors.createBtn}
            onClick={onCreate}
            disabled={disableCreate}
          />

          <ActionButton
            label="Edit"
            bg={customColors.editBtn}
            onClick={onEdit}
            disabled={disableEdit}
          />

        </div>

      </div>
    </div>
  );
}
