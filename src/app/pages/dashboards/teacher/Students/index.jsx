import { useEffect, useState } from "react";
import { StudentCard } from "./StudentCard";
import { fetchStudentsData } from "./studentdata";
import { getSessionData } from "utils/sessionStorage";
import { UsersIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export function Students({ courseId, courseName }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId && !courseName) {
      setStudents([]);
      setError("❌ No course selected.");
      setLoading(false);
      return;
    }

    const loadStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const { tenantId, branch } = getSessionData();
        const branchId = parseInt(branch, 10);

        if (!tenantId || !branchId) {
          setError("❌ Missing tenantId / branchId.");
          setStudents([]);
          return;
        }

        const res = await fetchStudentsData({
          tenantId: parseInt(tenantId, 10),
          courseId,
          courseName,
          branchId,
        });

        setStudents(res.students);
      } catch (err) {
        console.error("❌ Failed to load students", err);
        setError("❌ Failed to load students.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [courseId, courseName]);

  return (
    <div className="sm:col-span-2 lg:col-span-1">
      {/* Header */}
      <div className="flex h-8 items-center justify-between">
        <h2 className="flex items-center gap-2 font-medium tracking-wide text-gray-800 dark:text-dark-100">
          <UsersIcon className="size-5 text-primary-500" />
          Students
        </h2>
        <a
          href="#"
          className="group flex items-center gap-1 border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Content */}
      <div className="mt-3">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading students...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No students found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-1">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                name={student.name}
                avatar={student.avatar ?? null}
                isOnline={student.isOnline ?? true}
                progress={student.progress ?? Math.floor(Math.random() * 100)}
                messagesCount={student.messagesCount ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
