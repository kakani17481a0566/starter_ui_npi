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

  // ✅ Load and refresh performance summary
  const refreshData = async () => {
    try {
      const response = await fetchPerformanceSummary({
        tenantId: 1,
        courseId: 4,
        branchId: 1,
        weekId: 0,
      });
      setData(response);
      setSelectedStudent(response?.students?.[0] ?? null);
      setSelectedSubjectCode(null);
    } catch (error) {
      console.error("❌ Failed to fetch performance summary:", error);
    }
  };

  // ✅ Initial Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return <div className="p-4 text-primary-600">Loading dashboard...</div>;
  }

  return (
    <Page title="CMS Analytics Dashboard">
      <div className="mt-5 pb-8 lg:mt-6">
        <div className="transition-content px-4 sm:px-6 lg:px-8">
          {/* ✅ Subject Performance Summary */}
          {data && selectedStudent && (
            <PageViews
              summaryData={data}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              onSubjectSelect={setSelectedSubjectCode}
              refreshData={refreshData}
            />
          )}

          {/* ✅ Subject Filter Reset Button */}
          {selectedSubjectCode && (
            <div className="mt-3 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSelectedSubjectCode(null)}
                className="text-xs text-primary-600 underline hover:text-primary-800 transition"
              >
                Clear Subject Filter ({selectedSubjectCode})
              </button>
            </div>
          )}

          {/* ✅ Additional Analytics Cards */}
          {data && selectedStudent && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
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

        {/* ✅ Footer */}
        <FeaturedAuthors />
      </div>
    </Page>
  );
}
