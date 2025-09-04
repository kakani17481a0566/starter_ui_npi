import  { useEffect, useMemo, useState } from "react";
import { getBranches } from "./branchData";
import { getCoursesByBranch } from "./courseData";
import { getStudentsByCourse } from "./StudentData";
import { getStudentTest } from "./testData";

export default function StudentTest() {
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [testId, setTestId] = useState("");


  const [loading, setLoading] = useState({
    branches: false,
    courses: false,
    students: false,
  });
  const [error, setError] = useState("");

  // load branches on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading((s) => ({ ...s, branches: true }));
      setError("");
      try {
        const data = await getBranches();
        if (alive) setBranches(data);
      } catch (e) {
        if (alive) setError("Failed to load branches.");
        console.error(e);
      } finally {
        if (alive) setLoading((s) => ({ ...s, branches: false }));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // when branch changes → load courses
  useEffect(() => {
    let alive = true;
    setCourses([]);
    setCourseId("");
    setStudents([]);
    setStudentId("");

    if (!branchId) return;
    (async () => {
      setLoading((s) => ({ ...s, courses: true }));
      setError("");
      try {
        const data = await getCoursesByBranch();
        if (alive) setCourses(data);
      } catch (e) {
        if (alive) setError("Failed to load courses for the selected branch.");
        console.error(e);
      } finally {
        if (alive) setLoading((s) => ({ ...s, courses: false }));
      }
    })();

    return () => {
      alive = false;
    };
  }, [branchId]);

  // when course changes → load students
  useEffect(() => {
    let alive = true;
    setStudents([]);
    setStudentId("");

    if (!courseId) return;
    (async () => {
      setLoading((s) => ({ ...s, students: true }));
      setError("");
      try {
        const data = await getStudentsByCourse(branchId,courseId);
        if (alive) setStudents(data);
      } catch (e) {
        if (alive) setError("Failed to load students for the selected course.");
        console.error(e);
      } finally {
        if (alive) setLoading((s) => ({ ...s, students: false }));
      }
    })();

    return () => {
      alive = false;
    };
  }, [courseId,branchId]);

  const canSubmit = useMemo(
    () => !!branchId && !!courseId && !!studentId,
    [branchId, courseId, studentId]
  );

  useEffect(() => {
    let alive = true;
    setTests([]);
    setTestId("");

    if (!courseId) return;
    (async () => {
      setLoading((s) => ({ ...s, students: true }));
      setError("");
      try {
        const data = await getStudentTest();
        if (alive) setTests(data);
      } catch (e) {
        if (alive) setError("Failed to load students for the selected course.");
        console.error(e);
      } finally {
        if (alive) setLoading((s) => ({ ...s, students: false }));
      }
    })();

    return () => {
      alive = false;
    };
  }, [courseId,branchId,studentId]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      branchId: Number(branchId),
      courseId: Number(courseId),
      studentId: Number(studentId),
      testId:testId
    };
    console.log("Submit payload:", payload);
    
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header box */}
      <div className="border-4 border-black p-8 mb-6">
        <h1 className="text-2xl font-bold text-center">Student Test</h1>
      </div>

      {/* Form box */}
      <form onSubmit={onSubmit} className="border-4 border-black p-6 md:p-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Branch */}
          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="font-semibold md:text-right">Branch :</label>
            <div className="md:col-span-2">
              <select
                className="w-full border rounded px-3 py-2"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {loading.branches && (
                <p className="text-sm mt-1">Loading branches…</p>
              )}
            </div>
          </div>

          {/* Course */}
          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="font-semibold md:text-right">Course :</label>
            <div className="md:col-span-2">
              <select
                className="w-full border rounded px-3 py-2"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={!branchId || loading.courses}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {loading.courses && (
                <p className="text-sm mt-1">Loading courses…</p>
              )}
            </div>
          </div>

          {/* Student */}
          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="font-semibold md:text-right">Student :</label>
            <div className="md:col-span-2">
              <select
                className="w-full border rounded px-3 py-2"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={!courseId || loading.students}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {loading.students && (
                <p className="text-sm mt-1">Loading students…</p>
              )}
            </div>
          </div>

          {/* Tests Display */}

          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="font-semibold md:text-right">Test:</label>
            <div className="md:col-span-2">
              <select
                className="w-full border rounded px-3 py-2"
                value={studentId}
                onChange={(e) => setTestId(e.target.value)}
                disabled={!courseId || loading.students}
              >
                <option value="">Select Test</option>
                {tests.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {loading.tests && (
                <p className="text-sm mt-1">Loading Tests....</p>
              )}
            </div>
          </div>

          {/* Error */}
          {!!error && <p className="text-red-600">{error}</p>}

          {/* Submit */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2 font-semibold border rounded disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

