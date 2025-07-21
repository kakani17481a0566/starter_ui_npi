// src/app/pages/tables/HomePage.jsx

import { Page } from "components/shared/Page";
import InsertWeek from "app/pages/tables/InsertWeek";
import InsertPeriods from "app/pages/tables/InsertPeriods";
import InsertTimeTable from "app/pages/tables/InsertTimeTable";

// UI Components
import { Button } from "components/ui";
import { useDisclosure } from "hooks";

// Lucide Icons
import { CalendarPlus, Clock, Table2 } from "lucide-react";

export default function HomePage() {
  const [isInsertWeekVisible, { toggle: toggleInsertWeek }] = useDisclosure();
  const [isInsertPeriodsVisible, { toggle: toggleInsertPeriods }] = useDisclosure();
  const [isInsertTimeTableVisible, { toggle: toggleInsertTimeTable }] = useDisclosure();

  return (
    <Page title="Homepage">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6 space-y-6">
        {/* Button Row (inline on lg) */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
          {/* Insert Week */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary-950 dark:text-white">
              <CalendarPlus className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              <span>Insert Week</span>
            </div>
            <Button
              onClick={toggleInsertWeek}
              color="primary"
              className="h-8 px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5"
            >
              <CalendarPlus className="h-4 w-4" />
              {isInsertWeekVisible ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Periods */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary-950 dark:text-white">
              <Clock className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              <span>Insert Periods</span>
            </div>
            <Button
              onClick={toggleInsertPeriods}
              color="primary"
              className="h-8 px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5"
            >
              <Clock className="h-4 w-4" />
              {isInsertPeriodsVisible ? "Hide" : "Add"}
            </Button>
          </div>

          {/* Insert Time Table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary-950 dark:text-white">
              <Table2 className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              <span>Insert Time Table</span>
            </div>
            <Button
              onClick={toggleInsertTimeTable}
              color="primary"
              className="h-8 px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5"
            >
              <Table2 className="h-4 w-4" />
              {isInsertTimeTableVisible ? "Hide" : "Add"}
            </Button>
          </div>
        </div>

        {/* Form Cards (stacked vertically) */}
        <div className="space-y-6">
          {isInsertWeekVisible && (
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-dark-500 dark:bg-dark-700">
              <InsertWeek reloadOnSave={() => setTimeout(toggleInsertWeek, 300)} />
            </div>
          )}

          {isInsertPeriodsVisible && (
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-dark-500 dark:bg-dark-700">
              <InsertPeriods reloadOnSave={() => setTimeout(toggleInsertPeriods, 300)} />
            </div>
          )}

          {isInsertTimeTableVisible && (
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-dark-500 dark:bg-dark-700">
              <InsertTimeTable reloadOnSave={() => setTimeout(toggleInsertTimeTable, 300)} />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
