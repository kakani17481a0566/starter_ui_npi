import WeeklyCalanders from "./Weekly/WeeklyCalanders";

export default function WeeklyPlan({
  onCreateClick,
  selectedDate,
  onDateChange,
}) {
  return (
    <div className="min-h-screen bg-white">
      <WeeklyCalanders
        onCreateClick={onCreateClick}
        selectedDate={selectedDate}   // highlight correct card
        onDateChange={onDateChange}   // optional two-way sync
      />
    </div>
  );
}
