import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import
import { BASE_URL } from "constants/apis";

export default function Library() {
  const [selectedCourse, setSelectedCourse] = useState(""); // only for fetching students
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ hook for navigation

  // 🔹 Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/Course/dropdown-options-course/1`,
        );
        // ✅ assuming your courses API: /api/Course/dropdown-options-course/{tenantId}
        setCourses(res.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setMessage("❌ Unable to load courses.");
      }
    };
    fetchCourses();
  }, []);

  // 🔹 When course changes → fetch students
  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setStudentId(""); // reset student
    setMessage("");

    if (!courseId) {
      setStudents([]);
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/Student/dropdown-options-students?tenantId=1&courseId=${courseId}&branchId=1`,
      );
      setStudents(res.data.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      setMessage("❌ Unable to fetch students.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form className="w-full max-w-sm space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl md:p-8">
        {/* Header */}
        <div className="mb-4 flex justify-end border-b pb-4">
          <h1 className="text-2xl font-extrabold tracking-wider text-blue-600">
            MySchoolItaly
          </h1>
        </div>

        <div className="space-y-4">
          <div className="pt-2">
            <h3 className="pb-1 text-sm font-bold text-gray-700">Library</h3>
          </div>
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="course"
              className="text-sm font-semibold text-gray-700"
            >
              Course
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={handleCourseChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCourse && (
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="studentId"
                className="text-sm font-semibold text-gray-700"
              >
                Student
              </label>
              <select
                id="studentId"
                value={studentId}
                onChange={(e) => {
                  const id = e.target.value;
                  setStudentId(id);
                  const student = students.find((s) => String(s.id) === id);
                  if (student) {
                    setStudentName(student.name);
                  } else {
                    setStudentName("");
                  }
                }}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Feedback */}
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={() => {
            if (!studentId) {
              setMessage("Please select a student.");
              return;
            }

            try {
              navigate("/apps/library", {
                state: { studentId, studentName }, // ✅ pass studentId in location.state
              });

              // Reset form
              setSelectedCourse("");
              setStudentId("");
              setStudents([]);
            } catch (err) {
              console.error("Error navigating:", err);
              setMessage("❌ Error: Unable to navigate.");
            }
          }}
          className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition duration-200 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
