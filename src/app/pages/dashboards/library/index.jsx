import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import


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
        const res = await axios.get("https://localhost:7202/api/Course/dropdown-options-course/1");
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
        `https://localhost:7202/api/Student/dropdown-options-students?tenantId=1&courseId=${courseId}&branchId=1`
      );
      setStudents(res.data.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      setMessage("❌ Unable to fetch students.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        className="w-full max-w-sm bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-end border-b pb-4 mb-4">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-wider">
            MySchoolItaly
          </h1>
        </div>

        <div className="space-y-4">
          <div className="pt-2">
            <h3 className="text-sm font-bold text-gray-700 pb-1">Library</h3>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="course" className="text-sm font-semibold text-gray-700">
              Course
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={handleCourseChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
              <label htmlFor="studentId" className="text-sm font-semibold text-gray-700">
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
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
            className={`p-3 text-sm rounded-lg ${message.startsWith("✅")
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
                state: { studentId,studentName }, // ✅ pass studentId in location.state
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
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
