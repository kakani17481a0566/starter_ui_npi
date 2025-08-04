import { Fragment } from "react";
import { toast } from "sonner";
import { Card, Select } from "components/ui";
import { Statistics } from "./Statistics";
import { ViewChart } from "./ViewChart";
import { CombinationChart } from "./CombinationChart";

// ----------------------------------------------------------------------

export function PageViews({
  summaryData,
  selectedStudent,
  setSelectedStudent,
  refreshData,
  onSubjectSelect,
}) {
  if (!summaryData || !selectedStudent)
    return (
      <div className="p-4 text-sm font-medium text-red-600">
        No performance data available.
      </div>
    );

  const handleUpdate = async () => {
    await refreshData();
    toast.success("Data refreshed!");
  };

  return (
    <Fragment>
      {/* Main Card */}
      <Card className="overflow-hidden rounded-2xl p-4 shadow-sm dark:bg-dark-700">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3 sm:gap-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Subject Performance Overview
          </h2>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 dark:text-dark-300">
              <div className="size-3 rounded-full bg-[#4C4EE7]" />
              <span>Current</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 dark:text-dark-300">
              <div className="size-3 rounded-full bg-[#FF9800]" />
              <span>Previous</span>
            </div>

            {/* Time Selector */}
            <Select className="h-8 rounded-full text-xs bg-white dark:bg-dark-600">
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_year">Last Year</option>
            </Select>

            {/* Refresh Button */}
            <button
              onClick={handleUpdate}
              className="rounded-full bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Grid Content */}
        <div className="mt-6 grid grid-cols-12 gap-y-8 lg:gap-x-6">
          {/* Statistics */}
          <Statistics
            students={summaryData.students}
            assessmentGrades={summaryData.assessmentGrades}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />

          {/* Subject Chart */}
          <ViewChart
            subjectWiseAssessments={summaryData.subjectWiseAssessments}
            selectedStudentId={selectedStudent.studentId}
            onSubjectSelect={onSubjectSelect}
          />
        </div>
      </Card>

      {/* Bottom Combination Chart */}
      <CombinationChart
        subjectWiseAssessments={summaryData.subjectWiseAssessments}
        selectedStudentId={selectedStudent.studentId}
      />
    </Fragment>
  );
}
