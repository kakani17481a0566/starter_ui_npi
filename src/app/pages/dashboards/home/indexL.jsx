import { useState } from "react";
import { Page } from "components/shared/Page";
import InsertWeek from "app/pages/tables/InsertWeek";
import InsertPeriods from "app/pages/tables/InsertPeriods";
import InsertTimeTable from "app/pages/tables/InsertTimeTable";
import InsertTopics from "app/pages/tables/InsertTopics";
import InsertTimeTableDetails from "app/pages/tables/InsertTimeTableDetails";
import InsertTimeTableTopics from "app/pages/tables/InsertTimeTableTopics";
import { Button } from "components/ui";
import {
  CalendarPlus,
  Clock,
  Table2,
  BookText,
  ClipboardList,
  ListChecks,
} from "lucide-react";

const FORM_TYPES = {
  WEEK: "week",
  PERIODS: "periods",
  TIMETABLE: "timetable",
  TOPICS: "topics",
  DETAILS: "details",
  TIMETABLE_TOPICS: "timetable_topics",
};

export default function HomePage() {
  const [openForm, setOpenForm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Open or close only one form/table at a time
  const handleFormToggle = (type) => {
    setOpenForm((prev) => (prev === type ? null : type));
  };

  // Called after any insert/update: triggers table refresh + closes card
  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setOpenForm(null), 300);
  };

  return (
    <Page title="Homepage">
      <div className="transition-content w-full space-y-6 px-[var(--margin-x)] pt-5 lg:pt-6">
        {/* Button Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">

          {/* Insert Week */}
          <div className="flex flex-col gap-2">
            <div className="text-primary-950 flex items-center gap-2 text-sm font-semibold dark:text-white">
              <CalendarPlus className="text-primary-600 dark:text-primary-300 h-4 w-4" />
              <span>Insert Week</span>
            </div>
            <Button
              onClick={() => handleFormToggle(FORM_TYPES.WEEK)}
              color="primary"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
            >
              <CalendarPlus className="h-4 w-4" />
              {openForm === FORM_TYPES.WEEK ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Periods */}
          <div className="flex flex-col gap-2">
            <div className="text-primary-950 flex items-center gap-2 text-sm font-semibold dark:text-white">
              <Clock className="text-primary-600 dark:text-primary-300 h-4 w-4" />
              <span>Insert Periods</span>
            </div>
            <Button
              onClick={() => handleFormToggle(FORM_TYPES.PERIODS)}
              color="primary"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
            >
              <Clock className="h-4 w-4" />
              {openForm === FORM_TYPES.PERIODS ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Time Table */}
          <div className="flex flex-col gap-2">
            <div className="text-primary-950 flex items-center gap-2 text-sm font-semibold dark:text-white">
              <Table2 className="text-primary-600 dark:text-primary-300 h-4 w-4" />
              <span>Insert Time Table</span>
            </div>
            <Button
              onClick={() => handleFormToggle(FORM_TYPES.TIMETABLE)}
              color="primary"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
            >
              <Table2 className="h-4 w-4" />
              {openForm === FORM_TYPES.TIMETABLE ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Topics */}
          <div className="flex flex-col gap-2">
            <div className="text-primary-950 flex items-center gap-2 text-sm font-semibold dark:text-white">
              <BookText className="text-primary-600 dark:text-primary-300 h-4 w-4" />
              <span>Insert Topics</span>
            </div>
            <Button
              onClick={() => handleFormToggle(FORM_TYPES.TOPICS)}
              color="primary"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
            >
              <BookText className="h-4 w-4" />
              {openForm === FORM_TYPES.TOPICS ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Time Table Details */}
          <div className="flex flex-col gap-2">
            <div className="text-primary-950 flex items-center gap-2 text-sm font-semibold dark:text-white">
              <ClipboardList className="text-primary-600 dark:text-primary-300 h-4 w-4" />
              <span>Insert Time Table Details</span>
            </div>
            <Button
              onClick={() => handleFormToggle(FORM_TYPES.DETAILS)}
              color="primary"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
            >
              <ClipboardList className="h-4 w-4" />
              {openForm === FORM_TYPES.DETAILS ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Time Table Topics */}
          <div className="flex flex-col gap-2">
            <div className="text-primary-950 flex items-center gap-2 text-sm font-semibold dark:text-white">
              <ListChecks className="text-primary-600 dark:text-primary-300 h-4 w-4" />
              <span>Insert Time Table Topics</span>
            </div>
            <Button
              onClick={() => handleFormToggle(FORM_TYPES.TIMETABLE_TOPICS)}
              color="primary"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
            >
              <ListChecks className="h-4 w-4" />
              {openForm === FORM_TYPES.TIMETABLE_TOPICS ? "Hide" : "Add"}
            </Button>
          </div>
        </div>

        {/* Form/Table Card: Only one open at a time */}
        <div className="space-y-6">
          {openForm === FORM_TYPES.WEEK && (
            <div className="dark:border-dark-500 dark:bg-dark-700 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <InsertWeek onSuccess={handleSuccess} />
            </div>
          )}
          {openForm === FORM_TYPES.PERIODS && (
            <div className="dark:border-dark-500 dark:bg-dark-700 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <InsertPeriods onSuccess={handleSuccess} />
            </div>
          )}
          {openForm === FORM_TYPES.TIMETABLE && (
            <div className="dark:border-dark-500 dark:bg-dark-700 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <InsertTimeTable onSuccess={handleSuccess} />
            </div>
          )}
          {openForm === FORM_TYPES.TOPICS && (
            <div className="dark:border-dark-500 dark:bg-dark-700 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <InsertTopics onSuccess={handleSuccess} />
            </div>
          )}
          {openForm === FORM_TYPES.DETAILS && (
            <div className="dark:border-dark-500 dark:bg-dark-700 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <InsertTimeTableDetails onSuccess={handleSuccess} />
            </div>
          )}
          {openForm === FORM_TYPES.TIMETABLE_TOPICS && (
            <div className="dark:border-dark-500 dark:bg-dark-700 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
              <InsertTimeTableTopics key={refreshKey} />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
