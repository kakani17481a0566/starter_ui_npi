import { useState } from "react";
import { Page } from "components/shared/Page";
import { PsLink } from "./Perfomance/PsLink";
import { UserCard } from "./Student-card/UserCard";
import { psLinkData } from "./Perfomance/PsLinkData";
import StudentAttendanceGraph from "./studentattendence";
import { Statistics } from "./PageViews/Statistics";
import { students, assessmentGrades } from "./PageViews/satdata";
import { ViewChart } from "./PageViews/ViewChart";
import { MonthlyPerformanceChart } from "./PageViews/MonthlyPerformanceChart"; // 🔹 new chart
import { subjectWiseAssessments } from "./PageViews/chartdata";
import { SkillsPerformance } from "./PageViews/SkillsPerformance";

// 🔹 Reusable card wrapper
const Card = ({ children, className = "" }) => (
  <div
    className={`dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export default function Home() {
  const defaultKidId = psLinkData[0].kids[0]?.id;
  const [selectedKidId, setSelectedKidId] = useState(defaultKidId);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(null);

  const selectedKid = psLinkData.flatMap((e) => e.kids).find((k) => k.id === selectedKidId);
  const [selectedStudent, setSelectedStudent] = useState(
    students.find((s) => s.studentId === defaultKidId) || students[0],
  );

  return (
    <Page title="Parent Student Performance">
      <div className="transition-content w-full px-6 pt-5 lg:pt-6">
        <div className="dark:text-dark-50 min-w-0 text-gray-800">
          <h2 className="mb-4 truncate text-xl font-medium tracking-wide">Linked Kids</h2>

          {/* Kid selector */}
          <PsLink
            selectedKidId={selectedKidId}
            onKidSelect={(id) => {
              setSelectedKidId(id);
              setSelectedSubjectCode(null); // reset filter when switching kid
              const match = students.find((s) => s.studentId === id);
              if (match) setSelectedStudent(match);
            }}
          />

          {selectedKid && (
            <div className="mt-6 space-y-6">
              {/* Row 1: Three equal cards */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card>
                  <UserCard {...selectedKid} />
                </Card>
                <Card>
                  <Statistics
                    students={students}
                    assessmentGrades={assessmentGrades}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                  />
                </Card>
                <Card>
                  <StudentAttendanceGraph studentId={selectedKid.id} />
                </Card>
              </div>

              {/* Row 2: Chart + Skills */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 items-stretch">
                {/* Chart stays full height */}
                <Card className="lg:col-span-3">
                  <ViewChart
                    subjectWiseAssessments={subjectWiseAssessments}
                    selectedStudentId={selectedKid.id}
                    onSubjectSelect={(subj) =>
                      setSelectedSubjectCode((prev) => (prev === subj ? null : subj)) // 🔹 toggle filter
                    }
                  />
                </Card>

                {/* SkillsPerformance scrollable */}
                <Card className="lg:col-span-2 overflow-hidden">
                  <div className="flex justify-between items-center mb-2">

                    {selectedSubjectCode && (
                      <button
                        onClick={() => setSelectedSubjectCode(null)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-500 scrollbar-track-transparent max-h-[400px]">
                    <SkillsPerformance
                      subjectWiseAssessments={subjectWiseAssessments}
                      selectedStudentId={selectedKid.id}
                      selectedStudentName={selectedKid.name}
                      selectedSubjectCode={selectedSubjectCode}
                    />
                  </div>
                </Card>
              </div>

              {/* Row 3: Weekly Performance Chart */}
              <div className="grid grid-cols-1">
                <Card>
                  <MonthlyPerformanceChart
                    subjectWiseAssessments={subjectWiseAssessments}
                    selectedStudentId={selectedKid.id}
                  />
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
