// Local Imports
import { useState } from "react";
import { Page } from "components/shared/Page";
import { Overview } from "./Overview";
// import { Budget } from "./Budget";
// import { Income } from "./Income";
// import { Expense } from "./Expense";
import { TopSellers } from "./TopSellers";
import { Calendar } from "./Calendar";
// import { SocialTraffic } from "./SocialTraffic";
// import { TopCountries } from "./TopCountries";
import AttendanceStatusDisplayTable from "./attendecedisplaytable";

// Get today's date in yyyy-mm-dd format
const getToday = () => new Date().toISOString().split("T")[0];

export default function Orders() {
  const [selectedDate, setSelectedDate] = useState(getToday());

  return (
    <Page title="Orders Dashboard">
      <div className="transition-content mt-5 px-[--margin-x] pb-8 lg:mt-6">
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          {/* Attendance Summary */}
          <Overview />

          {/* Full-width Calendar */}
          <div className="col-span-12">
            <Calendar onChange={setSelectedDate} />
          </div>

          {/* <Budget />
              <Income />
              <Expense /> */}

          {/* Not Marked Students */}
          <TopSellers date={selectedDate} />

          {/* Social Traffic & Top Countries */}
          {/* <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-7 lg:gap-6 xl:col-span-6">
              <SocialTraffic />
              <TopCountries />
            </div> */}

          {/* Attendance Table */}
          <AttendanceStatusDisplayTable date={selectedDate} />
        </div>
      </div>
    </Page>
  );
}
