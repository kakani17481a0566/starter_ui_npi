// BasketSelector.jsx
import { useEffect, useState } from "react";
import axios from "axios";

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
        setStudents(res.data);
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
    onSelectStudent?.(student); // ✅ Notify parent
  };

  return (
    <div className="relative w-64">
      Enter Student Name:
      <input
        type="text"
        placeholder="Search Student..."
        className="w-full border rounded-md px-3 py-2 text-sm text-gray-800 dark:text-dark-100"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedStudent(null);
        }}
        onFocus={() => query && setShowDropdown(true)}
      />

      {showDropdown && students.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-dark-500 dark:bg-dark-700">
          {students.map((s) => (
            <div
              key={s.studentId}
              onClick={() => handleSelect(s)}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              {s.studentName}
            </div>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div className="mt-2 flex gap-4 text-sm text-gray-700 dark:text-dark-200">
          <span className="font-semibold">{selectedStudent.studentName}</span>
          <span>{selectedStudent.branchName}</span>
          <span>{selectedStudent.courseName}</span>
        </div>
      )}
    </div>
  );
}
