import { useState } from "react";
import { Page } from "components/shared/Page";
import { PsLink } from "./Perfomance/PsLink";
import { UserCard } from "./Student-card/UserCard";
import { psLinkData } from "./Perfomance/PsLinkData";
import StudentAttendanceGraph from "./studentattendence";
import { Statistics } from "./PageViews/Statistics";
import { students, assessmentGrades } from "./PageViews/satdata"; // stats temp data
import { ViewChart } from "./PageViews/ViewChart"; // chart component
import { subjectWiseAssessments } from "./PageViews/chartdata"; // chart data

export default function Home() {
  const defaultKidId = psLinkData[0].kids[0]?.id;
  const [selectedKidId, setSelectedKidId] = useState(defaultKidId);

  const selectedKid = psLinkData
    .flatMap((entry) => entry.kids)
    .find((kid) => kid.id === selectedKidId);

  const [selectedStudent, setSelectedStudent] = useState(
    students.find((s) => s.studentId === defaultKidId) || students[0],
  );

  return (
    <Page title="Parent Student Performance">
      <div className="transition-content w-full px-6 pt-5 lg:pt-6">
        <div className="dark:text-dark-50 min-w-0 text-gray-800">
          <h2 className="mb-4 truncate text-xl font-medium tracking-wide">
            Linked Kids
          </h2>

          {/* Kid selector */}
          <PsLink
            selectedKidId={selectedKidId}
            onKidSelect={(id) => {
              setSelectedKidId(id);
              const match = students.find((s) => s.studentId === id);
              if (match) setSelectedStudent(match);
            }}
          />

          {selectedKid && (
            <div className="mt-6 space-y-6">
              {/* Row 1: Three equal cards */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Card 1: Student Info */}
                <div className="dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <UserCard {...selectedKid} />
                </div>

                {/* Card 2: Statistics */}
                <div className="dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <Statistics
                    students={students}
                    assessmentGrades={assessmentGrades}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                  />
                </div>

                {/* Card 3: Chart */}
                <div className="dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <StudentAttendanceGraph studentId={selectedKid.id} />
                </div>
              </div>

              {/* Row 2: Attendance Graph 60% + Extra 40% */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:col-span-3">
                  <ViewChart
                    subjectWiseAssessments={subjectWiseAssessments}
                    selectedStudentId={selectedKid.id}
                    onSubjectSelect={(subj) => console.log("Selected:", subj)}
                  />
                </div>

                <div className="dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
                  <h3 className="dark:text-dark-100 mb-2 text-lg font-semibold text-gray-800">
                    Extra Insights
                  </h3>
                  <p className="dark:text-dark-300 text-sm text-gray-500">
                    This area can display attendance summary, upcoming exams, or
                    custom stats.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
