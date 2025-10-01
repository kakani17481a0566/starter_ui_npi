import { useState, useEffect } from "react";
import { Page } from "components/shared/Page";
import { PsLink } from "./Perfomance/PsLink";
import { UserCard } from "./Student-card/UserCard";
import { fetchPsLinkData } from "./Perfomance/PsLinkData";

import StudentAttendanceGraph from "./studentattendence";
import { Statistics } from "./PageViews/Statistics";
import { ViewChart } from "./PageViews/ViewChart";
import { MonthlyPerformanceChart } from "./PageViews/MonthlyPerformanceChart";
import { TermPerformanceChart } from "./PageViews/TermPerformanceChart";

import { SkillsPerformance } from "./PageViews/SkillsPerformance";
import { useStudentPerformance } from "./PageViews/PerfomaceApidata";
import WeekSelector from "./WeekSelector";
import { getSessionData } from "utils/sessionStorage";

// 🔹 Reusable Card wrapper
const Card = ({ children, className = "" }) => (
  <div
    className={`dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

// 🔹 Skeleton Loader
const Skeleton = ({ height = "h-20" }) => (
  <div
    className={`dark:bg-dark-500 animate-pulse rounded-md bg-gray-200 ${height}`}
  />
);

export default function Home() {
  const [psLinkData, setPsLinkData] = useState([]);
  const [selectedKidId, setSelectedKidId] = useState(null);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(null);
  const [selectedWeekId, setSelectedWeekId] = useState(-1);

  useEffect(() => {
    const loadData = async () => {
      const { userId, tenantId } = getSessionData();
      if (!userId || !tenantId) {
        console.error("⚠️ No session data found");
        return;
      }
      const data = await fetchPsLinkData(userId, tenantId);
      setPsLinkData(data);
      if (data.length && data[0].kids.length) {
        setSelectedKidId(data[0].kids[0].id);
      }
    };
    loadData();
  }, []);

  const selectedKid = psLinkData
    .flatMap((e) => e.kids)
    .find((k) => k.id === selectedKidId);

  const { performanceData, loading } = useStudentPerformance({
    tenantId: psLinkData[0]?.tenantId ?? getSessionData().tenantId,
    courseId: selectedKid?.courseId ?? 1,
    branchId: selectedKid?.branchId ?? 1,
    weekId: selectedWeekId,
    studentId: selectedKidId,
  });

  if (!psLinkData.length) {
    return (
      <Page title="Parent Student Performance">
        <div className="px-4 pt-5 sm:px-6">Loading linked kids...</div>
      </Page>
    );
  }

  return (
    <Page title="Parent Student Performance">
      <div className="transition-content w-full px-3 pt-4 sm:px-4 lg:px-6 lg:pt-6">
        <div className="dark:text-dark-50 min-w-0 text-gray-800">
          <h2 className="mb-4 truncate text-xl font-medium tracking-wide">
            Linked Kids
          </h2>

          <PsLink
            selectedKidId={selectedKidId}
            onKidSelect={(id) => {
              setSelectedKidId(id);
              setSelectedSubjectCode(null);
            }}
          />

          {selectedKid && (
            <div className="mt-6 space-y-6">
              {/* Week Selector */}
              {performanceData?.weekDictionary && (
                <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    Select Week:
                  </label>
                  <div className="min-w-[140px] sm:min-w-[160px]">
                    <WeekSelector
                      selectedWeekId={selectedWeekId}
                      setSelectedWeekId={setSelectedWeekId}
                      weekDictionary={performanceData.weekDictionary}
                    />
                  </div>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
                <Card>
                  <UserCard {...selectedKid} />
                </Card>
                <Card>
                  {loading || !performanceData ? (
                    <Skeleton height="h-24" />
                  ) : (
                    <Statistics
                      assessmentGrades={performanceData.assessmentGrades}
                      selectedStudent={performanceData.students[0]}
                    />
                  )}
                </Card>
                <Card>
                  {loading ? (
                    <Skeleton height="h-32" />
                  ) : (
                    <StudentAttendanceGraph studentId={selectedKid.id} />
                  )}
                </Card>
              </div>

              {/* Row 2 */}
              {performanceData && (
                <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-5">
                  {/* Chart */}
                  <Card className="lg:col-span-3">
                    <ViewChart
                      subjectWiseAssessments={
                        performanceData.subjectWiseAssessments
                      }
                      selectedStudentId={selectedKid.id}
                      onSubjectSelect={(subj) =>
                        setSelectedSubjectCode((prev) =>
                          prev === subj ? null : subj,
                        )
                      }
                    />
                  </Card>

                  {/* Skills (scrollable card with capped height) */}
                  <Card className="flex h-full max-h-80 flex-col overflow-hidden sm:max-h-96 lg:col-span-2 lg:max-h-[28rem]">
                    {/* Sticky Header */}
                    <div className="dark:bg-dark-700 sticky top-0 z-10 mb-2 bg-white pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="dark:text-dark-200 text-sm font-medium text-gray-700">
                          Skills Performance
                        </h3>
                        {selectedSubjectCode && (
                          <button
                            onClick={() => setSelectedSubjectCode(null)}
                            className="dark:bg-dark-600 dark:hover:bg-dark-500 rounded-md bg-gray-100 px-2 py-1 text-xs text-blue-600 hover:bg-gray-200 dark:text-blue-400"
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-500 scrollbar-track-transparent min-h-0 flex-1 overflow-y-auto pr-1 sm:pr-2">
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

              {/* Row 3 */}
              {performanceData && (
                <div className="grid grid-cols-1">
                  <Card>
                    <MonthlyPerformanceChart
                      weeklyAnalysis={performanceData.weeklyAnalysis}
                      selectedStudentId={selectedKid.id}
                    />
                  </Card>
                </div>
              )}


              {/* Row 4: Term Performance */}
{performanceData && (
  <div className="grid grid-cols-1">
    <Card>
      <TermPerformanceChart termAnalysis={performanceData.termAnalysis} />
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
