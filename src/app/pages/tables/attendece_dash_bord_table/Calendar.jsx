import { DatePicker } from "components/shared/form/Datepicker";
import { Card } from "components/ui";

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function Calendar({ onChange }) {
  return (
    <Card className="flex items-center justify-center overflow-hidden p-2 [&_.flatpickr-calendar]:min-w-full">
      <DatePicker
        isCalendar
        onChange={([date]) => {
          if (date instanceof Date && !isNaN(date)) {
            onChange?.(formatLocalDate(date));
          }
        }}
      />
    </Card>
  );
}
