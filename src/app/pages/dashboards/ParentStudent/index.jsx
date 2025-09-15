import { useState, useEffect } from "react";
import { Page } from "components/shared/Page";
import { PsLink } from "./Perfomance/PsLink";
import { UserCard } from "./Student-card/UserCard";
import { fetchPsLinkData } from "./Perfomance/PsLinkData";

import StudentAttendanceGraph from "./studentattendence";
import { Statistics } from "./PageViews/Statistics";
import { ViewChart } from "./PageViews/ViewChart";
import { MonthlyPerformanceChart } from "./PageViews/MonthlyPerformanceChart";
import { SkillsPerformance } from "./PageViews/SkillsPerformance";
import { useStudentPerformance } from "./PageViews/PerfomaceApidata";
import WeekSelector from "./WeekSelector";

// ✅ import session helper
import { getSessionData } from "utils/sessionStorage";

// 🔹 Reusable Card wrapper for consistent design
const Card = ({ children, className = "" }) => (
  <div
    className={`dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export default function Home() {
  // -----------------------------
  // 🔹 Local State
  // -----------------------------
  const [psLinkData, setPsLinkData] = useState([]);
  const [selectedKidId, setSelectedKidId] = useState(null);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(null);
  const [selectedWeekId, setSelectedWeekId] = useState(-1);

  // -----------------------------
  // 🔹 Fetch linked kids (once on mount)
  // -----------------------------
  useEffect(() => {
    const loadData = async () => {
      const { userId, tenantId } = getSessionData();

      if (!userId || !tenantId) {
        console.error("⚠️ No session data found");
        return;
      }

      const data = await fetchPsLinkData(userId, tenantId);
      setPsLinkData(data);

      // Auto-select the first kid if available
      if (data.length && data[0].kids.length) {
        setSelectedKidId(data[0].kids[0].id);
      }
    };

    loadData();
  }, []);

  // -----------------------------
  // 🔹 Find selected kid object
  // -----------------------------
  const selectedKid = psLinkData
    .flatMap((e) => e.kids)
    .find((k) => k.id === selectedKidId);

  // -----------------------------
  // 🔹 Fetch performance data for selected kid
  // -----------------------------
  const { performanceData, loading } = useStudentPerformance({
    tenantId: psLinkData[0]?.tenantId ?? getSessionData().tenantId,
    courseId: selectedKid?.courseId ?? 1,
    branchId: selectedKid?.branchId ?? 1,
    weekId: selectedWeekId,
    studentId: selectedKidId,
  });

  // -----------------------------
  // 🔹 If kids data not loaded yet → show loading
  // -----------------------------
  if (!psLinkData.length) {
    return (
      <Page title="Parent Student Performance">
        <div className="px-6 pt-5">Loading linked kids...</div>
      </Page>
    );
  }

  // -----------------------------
  // 🔹 Render Page
  // -----------------------------
  return (
    <Page title="Parent Student Performance">
      <div className="transition-content w-full px-6 pt-5 lg:pt-6">
        <div className="dark:text-dark-50 min-w-0 text-gray-800">
          {/* Section Header */}
          <h2 className="mb-4 truncate text-xl font-medium tracking-wide">
            Linked Kids
          </h2>

          {/* 🔹 Kid Selector */}
          <PsLink
            selectedKidId={selectedKidId}
            onKidSelect={(id) => {
              setSelectedKidId(id);
              setSelectedSubjectCode(null); // reset subject filter
            }}
          />

          {/* 🔹 Main content (only render when a kid is selected) */}
          {selectedKid && (
            <div className="mt-6 space-y-6">
              {/* -----------------------------
                  Week Selector
              ------------------------------ */}
              {performanceData?.weekDictionary && (
                <div className="mb-4 flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-dark-200">
                    Select Week:
                  </label>
                  <WeekSelector
                    selectedWeekId={selectedWeekId}
                    setSelectedWeekId={setSelectedWeekId}
                    weekDictionary={performanceData.weekDictionary}
                  />
                </div>
              )}

              {/* -----------------------------
                  Row 1: Student Snapshot
              ------------------------------ */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Kid Info */}
                <Card>
                  <UserCard {...selectedKid} />
                </Card>

                {/* Quick Statistics */}
                <Card>
                  {loading || !performanceData ? (
                    <p>Loading performance...</p>
                  ) : (
                    <Statistics
                      assessmentGrades={performanceData.assessmentGrades}
                      selectedStudent={performanceData.students[0]}
                    />
                  )}
                </Card>

                {/* Attendance */}
                <Card>
                  <StudentAttendanceGraph studentId={selectedKid.id} />
                </Card>
              </div>

              {/* -----------------------------
                  Row 2: Charts + Skills
              ------------------------------ */}
              {performanceData && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 items-stretch">
                  {/* Subject-wise Performance Chart */}
                  <Card className="lg:col-span-3 flex flex-col h-full">
                    <ViewChart
                      subjectWiseAssessments={
                        performanceData.subjectWiseAssessments
                      }
                      selectedStudentId={selectedKid.id}
                      onSubjectSelect={(subj) =>
                        setSelectedSubjectCode((prev) =>
                          prev === subj ? null : subj
                        )
                      }
                    />
                  </Card>

                  {/* Skills Performance */}
                  <Card className="lg:col-span-2 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        Skills Performance
                      </h3>
                      {selectedSubjectCode && (
                        <button
                          onClick={() => setSelectedSubjectCode(null)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-500 scrollbar-track-transparent">
                      <SkillsPerformance
                        subjectWiseAssessments={
                          performanceData.subjectWiseAssessments
                        }
                        selectedStudentId={selectedKid.id}
                        selectedStudentName={selectedKid.name}
                        selectedSubjectCode={selectedSubjectCode}
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* -----------------------------
                  Row 3: Monthly Performance
              ------------------------------ */}
              {performanceData && (
                <div className="grid grid-cols-1">
                  <Card>
                    <MonthlyPerformanceChart
                      subjectWiseAssessments={
                        performanceData.subjectWiseAssessments
                      }
                      selectedStudentId={selectedKid.id}
                    />
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
