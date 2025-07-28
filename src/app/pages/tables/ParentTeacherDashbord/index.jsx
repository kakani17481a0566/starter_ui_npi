import { useEffect, useState } from "react";

// Local Imports
import { Page } from "components/shared/Page";
import { PageViews } from "./PageViews";
import { Visitors } from "./Tops/Visitors";
import { SkillsPerformance } from "./Tops/SkillsPerformance";
import { Comments } from "./Tops/Comments";
import { Searchs } from "./Tops/Searchs";
import { FeaturedAuthors } from "./FeaturedAuthors";
import { fetchPerformanceSummary } from "app/pages/tables/ParentTeacherDashbord/performanceSummaryData";
import StudentAttendanceGraph from "app/pages/charts/studentattendence";

// ----------------------------------------------------------------------

export default function ParentTeacherDashbord() {
  const [data, setData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const res = await fetchPerformanceSummary({
        tenantId: 1,
        courseId: 4,
        branchId: 1,
        weekId: 0,
      });
      setData(res);
      setSelectedStudent(res?.students?.[0] ?? null);
      setSelectedSubjectCode(null); // Reset filter on data refresh
    } catch (error) {
      console.error("Failed to fetch performance summary:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-primary-600 p-4">Loading dashboard...</div>;
  }

  return (
    <Page title="CMS Analytics Dashboard">
      <div className="mt-5 pb-8 lg:mt-6">
        <div className="transition-content px-4 sm:px-6 lg:px-8">
          {/* Subject performance section */}
          {data && selectedStudent && (
            <PageViews
              summaryData={data}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              onSubjectSelect={setSelectedSubjectCode}
              refreshData={refreshData}
            />
          )}

          {/* Clear filter button */}
          {data && selectedStudent && selectedSubjectCode && (
            <div className="mt-3 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSelectedSubjectCode(null)}
                className="text-primary-600 hover:text-primary-800 text-xs underline transition"
              >
                Clear Subject Filter ({selectedSubjectCode})
              </button>
            </div>
          )}

          {/* Other analytics widgets */}
          {data && selectedStudent && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:grid-cols-3 lg:gap-6">
              <SkillsPerformance
                subjectWiseAssessments={data.subjectWiseAssessments}
                selectedStudentId={selectedStudent.studentId}
                selectedStudentName={selectedStudent.studentName}
                selectedSubjectCode={selectedSubjectCode}
              />
              <StudentAttendanceGraph
                studentId={selectedStudent.studentId}
                studentName={selectedStudent.studentName}
              />

              <Visitors />
              <Comments />
              <Searchs />
            </div>
          )}
        </div>

        {/* Footer content */}
        <FeaturedAuthors />
      </div>
    </Page>
  );
}
