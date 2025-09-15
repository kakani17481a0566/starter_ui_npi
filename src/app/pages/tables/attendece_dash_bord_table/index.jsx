// Local Imports
import { useEffect, useRef, useState } from "react";
import { Page } from "components/shared/Page";
import { Overview } from "./Overview";
import { TopSellers } from "./TopSellers";
import { Calendar } from "./Calendar";
import AttendanceStatusDisplayTable from "./attendecedisplaytable";
import { fetchAttendanceSummary } from "./attendecedisplaytable/data";
import { Spinner } from "components/ui";

// ✅ Get today's date in yyyy-mm-dd format
const getToday = () => new Date().toISOString().split("T")[0];

export default function Orders() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const didFetch = useRef(false); // ✅ Prevent double-fetch

  // -------------------------
  // Data Fetching
  // -------------------------
  useEffect(() => {
    if (didFetch.current) return;

    async function loadData() {
      console.log("📅 Fetching attendance summary for date:", selectedDate);
      setLoading(true);
      try {
        const data = await fetchAttendanceSummary({ date: selectedDate });
        console.log("✅ Attendance summary fetched:", data);
        setSummaryData(data);
      } catch {
        setSummaryData(null);
      } finally {
        setLoading(false);
        console.log("🕓 Loading state set to false");
      }
    }

    loadData();
    didFetch.current = true;
  }, [selectedDate]);

  const handleDateChange = (newDate) => {
    console.log("📆 Date selected from calendar:", newDate);
    setSelectedDate(newDate);
    didFetch.current = false; // ✅ Allow new fetch
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <Page title="Orders Dashboard">
      <div className="transition-content mt-5 px-[--margin-x] pb-8 lg:mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner color="primary" className="size-10 border-4" />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
            {/* Overview Summary */}
            <Overview data={summaryData} />

            {/* Calendar */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <Calendar onChange={handleDateChange} />
            </div>

            {/* Not Marked Students */}
            <TopSellers data={summaryData} />

            {/* Attendance Table */}
            <div className="col-span-12">
              <AttendanceStatusDisplayTable data={summaryData} />
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
