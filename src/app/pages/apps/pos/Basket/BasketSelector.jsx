// BasketSelector.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function BasketSelector({ onSelectStudent }) {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`https://localhost:7202/search/${query}`);
        setStudents(res.data.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    const debounce = setTimeout(fetchStudents, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (student) => {
    setSelectedStudent(student);
    setQuery(student.studentName);
    setShowDropdown(false);
    onSelectStudent?.(student);
  };

  return (
    <div className="relative w-72">
      {/* ✅ Label + Icon Row */}
      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-200">
        <MagnifyingGlassIcon className="h-5 w-5 text-primary-600" />
        <span>Enter Student Name:</span>
      </div>

      {/* ✅ Input Field */}
      <input
        type="text"
        placeholder="Search Student..."
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedStudent(null);
        }}
        onFocus={() => query && setShowDropdown(true)}
      />

      {/* ✅ Dropdown */}
      {showDropdown && students.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-dark-500 dark:bg-dark-700">
          {students.map((s) => (
            <div
              key={s.studentId}
              onClick={() => handleSelect(s)}
              className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <span className="font-medium text-gray-800 dark:text-dark-100">
                {s.studentName}
              </span>
              <span className="text-xs text-gray-500">
                {s.courseName} • {s.branchName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Selected Student Info */}
      {selectedStudent && (
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-dark-200">
          <span className="font-semibold">{selectedStudent.studentName}</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-dark-100">
            {selectedStudent.courseName}
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-dark-100">
            {selectedStudent.branchName}
          </span>
        </div>
      )}
    </div>
  );
}
