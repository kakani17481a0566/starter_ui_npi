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
  onSubjectSelect, // ✅ NEW PROP
}) {
  if (!summaryData || !selectedStudent)
    return <div className="p-4 text-red-600">No performance data available</div>;

  const handleUpdate = async () => {
    await refreshData();
    toast.success("Data refreshed!");
  };

  return (
    <Fragment>
      <Card className="overflow-hidden pb-4">
        <div className="flex min-w-0 items-center justify-between px-4 pt-3 sm:px-5">
          <h2 className="text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
            Subject Performance
          </h2>

          <div className="flex items-center gap-4">
            <div className="hidden cursor-pointer items-center gap-2 sm:flex">
              <div className="size-3 rounded-full bg-[#4C4EE7]" />
              <p>Current Period</p>
            </div>
            <div className="hidden cursor-pointer items-center gap-2 sm:flex">
              <div className="size-3 rounded-full bg-[#FF9800]" />
              <p>Previous Period</p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleUpdate}
              className="rounded-full bg-primary-600 px-3 py-1 text-xs text-white hover:bg-primary-700"
            >
              Refresh
            </button>

            <Select className="h-8 rounded-full text-xs">
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_year">Last Year</option>
            </Select>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-12">
          <Statistics
            students={summaryData.students}
            assessmentGrades={summaryData.assessmentGrades}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />

          <ViewChart
            subjectWiseAssessments={summaryData.subjectWiseAssessments}
            selectedStudentId={selectedStudent.studentId}
            onSubjectSelect={onSubjectSelect} // ✅ Pass it here
          />
        </div>
      </Card>

      <CombinationChart
        subjectWiseAssessments={summaryData.subjectWiseAssessments}
        selectedStudentId={selectedStudent.studentId}
      />
    </Fragment>
  );
}
