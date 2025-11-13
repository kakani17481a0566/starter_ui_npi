import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------
// 🎯 BasketSelector Component
// ----------------------------------------------------------------------
export function BasketSelector({ onSelectStudent }) {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ----------------------------------------------------------------------
  // 🔍 Fetch Students (debounced)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!query.trim()) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/search/${query}`);
        setStudents(res.data.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("❌ Failed to fetch students:", err);
      }
    };

    const debounce = setTimeout(fetchStudents, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  // ----------------------------------------------------------------------
  // 🧠 Handle Selection
  // ----------------------------------------------------------------------
  const handleSelect = (student) => {
    setSelectedStudent(student);
    setQuery(student.studentName);
    setShowDropdown(false);
    onSelectStudent?.(student);
  };

  // ----------------------------------------------------------------------
  // 🖱️ Close dropdown on outside click
  // ----------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------------------------------------------------
  // 🖥️ Render
  // ----------------------------------------------------------------------
  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Label */}
      <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-200">
        <MagnifyingGlassIcon className="h-5 w-5 text-primary-600" />
        <span>Search Student</span>
      </label>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Enter student name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedStudent(null);
          }}
          onFocus={() => query && setShowDropdown(true)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-800 shadow-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
        />
        <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Dropdown */}
      {showDropdown && students.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-dark-600 dark:bg-dark-800 animate-fadeIn">
          {students.map((s) => (
            <div
              key={s.studentId}
              onClick={() => handleSelect(s)}
              className="flex cursor-pointer items-start gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-dark-600 transition-all"
            >
              <UserCircleIcon className="h-6 w-6 text-primary-500 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-dark-100">
                  {s.studentName}
                </span>
                <span className="text-xs text-gray-500 dark:text-dark-300">
                  {s.courseName} • {s.branchName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showDropdown && query.trim() && students.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300">
          No students found.
        </div>
      )}

      {/* Selected Student Card */}
      {selectedStudent && (
        <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-dark-600 dark:bg-dark-700">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-10 w-10 text-primary-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-dark-100">
                {selectedStudent.studentName}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-dark-300">
                <span className="flex items-center gap-1">
                  <AcademicCapIcon className="h-4 w-4 text-primary-500" />
                  {selectedStudent.courseName}
                </span>
                <span className="flex items-center gap-1">
                  <BuildingLibraryIcon className="h-4 w-4 text-primary-500" />
                  {selectedStudent.branchName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
