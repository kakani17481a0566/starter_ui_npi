  import { useEffect, useMemo, useState, Fragment } from "react";
  import { useNavigate } from "react-router-dom";

  import {
    ChevronDownIcon,
    CheckIcon,
    BuildingLibraryIcon,
    BookOpenIcon,
    UserIcon,
    ClipboardDocumentIcon,
    ClipboardIcon, // ✅ for Exam Type
  } from "@heroicons/react/24/outline";

  import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
  } from "@headlessui/react";
  import clsx from "clsx";

  import { getCoursesByBranch } from "./courseData";
  import { getStudentsByCourse } from "./StudentData";
  import { getStudentTest } from "./testData";
  import { getExamTypes } from "./Exam"; // ✅ use helper
  import { StudentTestVertical } from "./components/StudentTestVertical/StudentTestVertical";
  import { Button } from "components/ui";
  import { getSessionData } from "utils/sessionStorage";

  export default function StudentTest() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [tests, setTests] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    

    const { branch } = getSessionData();
    const navigate = useNavigate();

    const [courseId, setCourseId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [examType, setExamType] = useState(null);
    const [testId, setTestId] = useState("");

    const [loading, setLoading] = useState({
      courses: false,
      students: false,
      tests: false,
      exams: false,
    });

    const [error, setError] = useState("");

    const canSubmit = useMemo(
      () => !!courseId && !!studentId && !!examType && !!testId,
      [courseId, studentId, examType, testId],
    );

    // 🔹 Fetch Courses
    useEffect(() => {
      let alive = true;
      setCourses([]);
      setCourseId("");
      setStudents([]);
      setStudentId("");
      setExamType("");
      setTests([]);
      setTestId("");

      (async () => {
        setLoading((s) => ({ ...s, courses: true }));
        setError("");
        try {
          const data = await getCoursesByBranch(branch);
          if (alive) setCourses(data);
        } catch {
          if (alive) setError("Failed to load courses.");
        } finally {
          if (alive) setLoading((s) => ({ ...s, courses: false }));
        }
      })();

      return () => {
        alive = false;
      };
    }, []);

    // 🔹 Fetch Students
    useEffect(() => {
      let alive = true;
      setStudents([]);
      setStudentId("");
      setExamType("");
      setTests([]);
      setTestId("");

      if (!courseId) return;

      (async () => {
        setLoading((s) => ({ ...s, students: true }));
        setError("");
        try {
          const data = await getStudentsByCourse(branch, courseId);
          if (alive) setStudents(data);
        } catch {
          if (alive) setError("Failed to load students.");
        } finally {
          if (alive) setLoading((s) => ({ ...s, students: false }));
        }
      })();

      return () => {
        alive = false;
      };
    }, [courseId]);

    // 🔹 Fetch Exam Types
    useEffect(() => {
      let alive = true;
      setExamTypes([]);
      setExamType("");

      (async () => {
        setLoading((s) => ({ ...s, exams: true }));
        try {
          const tenantId = branch?.tenantId || 1;
          const data = await getExamTypes(tenantId);
          if (alive) {
            setExamTypes(data.map((item) => ({ id: item.id, name: item.name })));
          }
        } catch {
          if (alive) setError("Failed to load exam types.");
        } finally {
          if (alive) setLoading((s) => ({ ...s, exams: false }));
        }
      })();

      return () => {
        alive = false;
      };
    }, [branch]);

    // 🔹 Fetch Tests
    useEffect(() => {
      let alive = true;
      setTests([]);
      setTestId("");

      if (!studentId || !examType) return;

      (async () => {
        setLoading((s) => ({ ...s, tests: true }));
        setError("");
        try {
          const data = await getStudentTest(examType);
          if (alive) setTests(data);
        } catch {
          if (alive) setError("Failed to load tests.");
        } finally {
          if (alive) setLoading((s) => ({ ...s, tests: false }));
        }
      })();

      return () => {
        alive = false;
      };
    }, [studentId, examType]);

    const onSubmit = async (e) => {
  e.preventDefault();
  if (!canSubmit) return;
  console.log(examType)

  // Find selected test by ID
  const selectedTest = tests.find((t) => t.id === testId);

  if (!selectedTest) {
    alert("Please select a valid test");
    return;
  }
  console.log(examType);

  try {
    if (examType === 264) {
      // ✅ Navigate to AI dashboard flow
      navigate("/dashboards/ai", {
        state: {
          relationId: selectedTest.relationId || 0,
          testId: selectedTest.id,
          studentId,
          examType, // exam type string (from dropdown)
        },
      });
    } else {
      // ✅ Navigate to Parent Exam page
      navigate("/parent/Exam", {
        state: {
          relationId: selectedTest.relationId || 0,
          testId: selectedTest.id,
          studentId,
          examType,
        },
      });
    }
  } catch (err) {
    console.error("Submit failed:", err);
    alert("Failed to start test");
  }
};



    const iconMap = {
      Branch: BuildingLibraryIcon,
      Course: BookOpenIcon,
      Student: UserIcon,
      Exam: ClipboardIcon,
      Test: ClipboardDocumentIcon,
    };

    const renderDropdown = (
      label,
      data,
      selectedId,
      setSelectedId,
      loadingKey,
      disabled,
    ) => {
      const Icon = iconMap[label];
      return (
        <div className="space-y-1">
          <label className="flex items-center gap-1 font-medium text-sm text-gray-800 dark:text-gray-200">
            <Icon className="w-4 h-4 text-primary-500" />
            {label}:
          </label>
          <Menu as="div" className="relative w-full text-left">
            <MenuButton
              as="button"
              disabled={disabled}
              className={clsx(
                "w-full flex justify-between items-center px-4 py-2 text-sm rounded-md border shadow-sm",
                "border-primary-500 bg-white dark:bg-gray-900 text-black dark:text-white",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <span className="truncate">
                {data.find((item) => item.id === selectedId)?.name ||
                  `Select ${label}`}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <MenuItems className="absolute z-50 mt-2 w-full rounded-md border border-primary-800 bg-white dark:bg-gray-900 shadow-md text-sm overflow-hidden">
                {data.map((item) => (
                  <MenuItem key={item.id}>
                    {() => (
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className={clsx(
                          "w-full px-4 py-2 text-left flex justify-between items-center",
                          selectedId === item.id
                            ? "bg-primary-500 text-white"
                            : "bg-white dark:bg-gray-900 text-black dark:text-white",
                        )}
                      >
                        {item.name}
                        {selectedId === item.id && (
                          <CheckIcon className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>

          {loadingKey && loading[loadingKey] && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Loading {label.toLowerCase()}…
            </p>
          )}
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 p-4 md:p-8">
        <StudentTestVertical />

        <div className="max-w-3xl mx-auto rounded-lg border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-md px-6 py-8 space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {renderDropdown("Course", courses, courseId, setCourseId, "courses", false)}
            {renderDropdown("Student", students, studentId, setStudentId, "students", !courseId)}
            {renderDropdown("Exam", examTypes, examType, setExamType, "exams", !studentId)}
            {renderDropdown("Test", tests, testId, setTestId, "tests", !examType)}

            {!!error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={!canSubmit} size="sm">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
