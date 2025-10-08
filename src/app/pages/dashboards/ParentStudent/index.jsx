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

import {
  CalendarDaysIcon,
  BarChart2Icon,
  PieChartIcon,
  TrendingUpIcon,
  ActivityIcon,
  LayersIcon,
} from "lucide-react";

// 🔹 Reusable Card wrapper
const Card = ({ children, className = "" }) => (
  <div
    className={`dark:border-dark-400 dark:bg-dark-700 flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

// 🔹 Section Heading with Icon
const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-3 border-b border-gray-200 dark:border-dark-500 pb-2">
    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
      <Icon className="h-4 w-4 text-primary-500" />
      {title}
    </h3>
    {subtitle && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
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

  const sessionData = getSessionData();

  useEffect(() => {
    const loadData = async () => {
      const userId = sessionData?.userId;
      const tenantId = sessionData?.tenantId;
      if (!userId || !tenantId) {
        console.error("⚠️ No session data found");
        return;
      }
      const data = await fetchPsLinkData(userId, tenantId);
      setPsLinkData(data || []);
      if (data?.length && data[0]?.kids?.length) {
        setSelectedKidId(data[0].kids[0].id);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedKid = psLinkData
    .flatMap((e) => e?.kids || [])
    .find((k) => k?.id === selectedKidId);

  const tenantIdForPerf =
    psLinkData?.[0]?.tenantId ?? sessionData?.tenantId ?? undefined;

  const { performanceData, loading } = useStudentPerformance({
    tenantId: tenantIdForPerf,
    courseId: selectedKid?.courseId ?? 1,
    branchId: selectedKid?.branchId ?? 1,
    weekId: selectedWeekId,
    studentId: selectedKidId,
  });

  if (!psLinkData.length) {
    return (
      <Page title="Parent Student Performance">
        <div className="dark:text-dark-300 px-4 pt-5 text-gray-500 sm:px-6">
          Loading linked kids...
        </div>
      </Page>
    );
  }

  if (loading && !performanceData) {
    return (
      <Page title="Parent Student Performance">
        <div className="space-y-5 p-6">
          <Skeleton height="h-28" />
          <Skeleton height="h-40" />
          <Skeleton height="h-56" />
        </div>
      </Page>
    );
  }

  return (
    <Page title="Parent Student Performance">
      <div className="transition-content w-full px-3 pt-4 sm:px-4 lg:px-6 lg:pt-6">
        <div className="dark:text-dark-50 min-w-0 text-gray-800">
          <h2 className="mb-5 text-xl font-semibold tracking-wide">
            Linked Kids
          </h2>

          <PsLink
            selectedKidId={selectedKidId}
            onKidSelect={(id) => {
              setSelectedKidId(id);
              setSelectedSubjectCode(null);
              setSelectedWeekId(-1);
            }}
          />

          {selectedKid && (
            <div className="mt-7 space-y-7">
              {/* Week Selector */}
              {performanceData?.weekDictionary && (
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    Select Week:
                  </label>
                  <div className="min-w-[160px]">
                    <WeekSelector
                      selectedWeekId={selectedWeekId}
                      setSelectedWeekId={setSelectedWeekId}
                      weekDictionary={performanceData.weekDictionary}
                    />
                  </div>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                  <UserCard {...selectedKid} />
                </Card>

                <Card>
                  <SectionHeading
                    icon={BarChart2Icon}
                    title="Student Statistics"
                    subtitle="Scores & grade breakdown"
                  />
                  {loading || !performanceData ? (
                    <Skeleton height="h-24" />
                  ) : (
                    <Statistics
                      assessmentGrades={performanceData?.assessmentGrades ?? {}}
                      selectedStudent={performanceData?.students?.[0]}
                    />
                  )}
                </Card>

                <Card>
                  <SectionHeading
                    icon={CalendarDaysIcon}
                    title="Attendance Overview"
                    subtitle="Last 7 days in/out times"
                  />
                  {loading ? (
                    <Skeleton height="h-32" />
                  ) : (
                    <StudentAttendanceGraph studentId={selectedKid.id} />
                  )}
                </Card>
              </div>

              {/* Row 2 */}
              {performanceData && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
                  <Card className="lg:col-span-3">
                    <SectionHeading
                      icon={PieChartIcon}
                      title="Subject Performance"
                      subtitle="Average scores & deviations across subjects"
                    />
                    <ViewChart
                      subjectWiseAssessments={
                        performanceData?.subjectWiseAssessments ?? []
                      }
                      selectedStudentId={selectedKid.id}
                      onSubjectSelect={(subj) =>
                        setSelectedSubjectCode((prev) =>
                          prev === subj ? null : subj
                        )
                      }
                    />
                  </Card>

                  {/* Skills Card */}
                  <Card className="flex h-full max-h-80 flex-col sm:max-h-96 lg:col-span-2 lg:max-h-[28rem]">
                    <div className="dark:bg-dark-700 sticky top-0 z-10 mb-3 bg-white pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                          <ActivityIcon className="h-4 w-4 text-primary-500" />
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
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Individual skill-level breakdown
                      </p>
                    </div>

                    <div className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-500 scrollbar-track-transparent flex-1 overflow-y-auto pr-1 sm:pr-2">
                      <SkillsPerformance
                        subjectWiseAssessments={
                          performanceData?.subjectWiseAssessments ?? []
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
              {performanceData?.weeklyAnalysis && (
                <Card>
                  <SectionHeading
                    icon={TrendingUpIcon}
                    title="Weekly Performance"
                    subtitle="Subject scores across selected weeks"
                  />
                  <MonthlyPerformanceChart
                    weeklyAnalysis={performanceData.weeklyAnalysis}
                    selectedStudentId={selectedKid.id}
                  />
                </Card>
              )}

              {/* Row 4 */}
              {performanceData?.termAnalysis && (
                <Card>
                  <SectionHeading
                    icon={LayersIcon}
                    title="Term Performance"
                    subtitle="Average subject scores across academic terms"
                  />
                  <TermPerformanceChart
                    termAnalysis={performanceData.termAnalysis}
                  />
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
