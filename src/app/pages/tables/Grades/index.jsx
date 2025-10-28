// ----------------------------------------------------------------------
// Grades Table with Save Functionality + StudentCardCell Integration
// ----------------------------------------------------------------------

import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Spinner,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
  Button,
} from "components/ui";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { getSessionData } from "utils/sessionStorage";

import {
  fetchAssessmentMatrix,
  fetchGradeList,
  saveGradesMatrix,
} from "./data";

// Local component (see below)
import { StudentCardCell } from "components/shared/StudentCardCell";

// ----------------------------------------------------------------------

export default function Grades({
  timeTableId,
  assessmentStatusCode,
  courseId,
}) {
  const { tenantId, branch, course } = getSessionData();
  const defaultCourse = courseId != null ? courseId : course[0].id;

  const [students, setStudents] = useState([]);
  const [originalStudents, setOriginalStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradesList, setGradesList] = useState([]);
  const [gradeId, setGradeId] = useState(0);
  const [gradeName, setGradeName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentIdMap, setAssessmentIdMap] = useState({});

  const conductedById = 1;

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------

  const handleSave = async (statusCode = 172) => {
    try {
      const originalMap = Object.fromEntries(
        originalStudents.map((s) => [s.studentId, s]),
      );

      const changedStudents = students
        .map((student) => {
          const original = originalMap[student.studentId];
          const changedGrades = Object.entries(student.assessmentGrades)
            .filter(
              ([key, grade]) =>
                grade.gradeId !== original?.assessmentGrades?.[key]?.gradeId,
            )
            .map(([key, grade]) => ({
              assessmentId: assessmentIdMap[key],
              gradeId: grade.gradeId,
            }));

          if (!changedGrades.length) return null;

          return {
            studentId: student.studentId,
            grades: changedGrades,
          };
        })
        .filter(Boolean);

      if (!changedStudents.length) {
        return toast.error("Nothing to be saved", { className: "soft-color" });
      }

      // Validate before completion
      if (statusCode === 174) {
        const ungraded = students.filter((s) =>
          Object.values(s.assessmentGrades || {}).some(
            (g) =>
              !g.gradeName ||
              g.gradeName === "Not Graded" ||
              g.gradeName === "Marks Not Added",
          ),
        );
        if (ungraded.length) {
          const names = ungraded.map((s) => s.studentName).join(", ");
          setAlertMessage(`Ungraded students: ${names}`);
          return;
        }
      }

      const payload = {
        TimeTableId: timeTableId,
        TenantId: tenantId,
        BranchId: branch,
        conductedById,
        courseId,
        overrideStatusCode: statusCode,
        assessmentCode: statusCode,
        students: changedStudents,
      };

      setIsLoading(true);
      await saveGradesMatrix(payload);
      toast.success("Grades saved successfully!", { className: "soft-color" });
      setOriginalStudents(structuredClone(students));
      setIsCompleted(statusCode === 174);
      setAlertMessage("");
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Save failed. Please try again.", {
        className: "soft-color",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeChange = useCallback(
    (studentId, header, newGradeName) => {
      const gradeObj = gradesList.find(
        (g) => g.name.trim() === newGradeName.trim(),
      );
      const gradeId = gradeObj?.id ?? 0;

      setStudents((prev) =>
        prev.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                assessmentGrades: {
                  ...student.assessmentGrades,
                  [header]: {
                    ...student.assessmentGrades?.[header],
                    gradeId,
                    gradeName: newGradeName,
                  },
                },
              }
            : student,
        ),
      );
    },
    [gradesList],
  );

  const getGradeColorStyle = useCallback((grade) => {
    const map = {
      "A+": "bg-green-200",
      A: "bg-purple-200",
      B: "bg-yellow-200",
      C: "bg-yellow-200",
      "Marks Not Added": "bg-orange-200",
      Poor: "bg-pink-200",
      Fair: "bg-red-300",
      "Not Graded": "bg-gray-200",
    };
    return map[grade] || "bg-gray-50";
  }, []);

  const renderGradeCell = useCallback(
    (row, header) => {
      const grade = (
        row.assessmentGrades?.[header]?.gradeName || "Not Graded"
      ).trim();
      const bgColor = getGradeColorStyle(grade);

      if (
        isCompleted ||
        (assessmentStatusCode === gradeId && gradeName === "COMPLETED")
      ) {
        return (
          <div className={`rounded-md px-1 py-1 text-sm ${bgColor}`}>
            {grade}
          </div>
        );
      }

      return (
        <select
          value={grade}
          onChange={(e) =>
            handleGradeChange(row.studentId, header, e.target.value)
          }
          className={`rounded-md px-1 py-1 text-sm ${bgColor}`}
        >
          <option value="">Not Graded</option>
          {gradesList.map((g) => (
            <option key={g.id} value={g.name?.trim()}>
              {g.name}
            </option>
          ))}
        </select>
      );
    },
    [
      gradesList,
      handleGradeChange,
      getGradeColorStyle,
      isCompleted,
      assessmentStatusCode,
      gradeId,
      gradeName,
    ],
  );

  // ----------------------------------------------------------------------
  // Data Fetch
  // ----------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [data, grades] = await Promise.all([
          fetchAssessmentMatrix({
            timeTableId,
            tenantId,
            courseId: defaultCourse,
            branchId: branch,
          }),
          fetchGradeList(),
        ]);

        setGradeId(data.data.currentStatusId);
        setGradeName(data.data.currentStatusName);
        setAssessmentIdMap(data?.data?.headerSkillMap || {});
        setGradesList(grades);
        setStudents(data?.data?.rows || []);
        setOriginalStudents(structuredClone(data?.data?.rows || []));
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeTableId, tenantId, branch, courseId]);

  // ----------------------------------------------------------------------
  // Table Definition
  // ----------------------------------------------------------------------

  const columns = useMemo(() => {
    if (!students.length) return [];

    const assessmentHeaders = Object.keys(students[0].assessmentGrades || {});
    const studentColumn = {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <StudentCardCell
          avatar={`https://api.dicebear.com/7.x/initials/svg?seed=${row.original.studentName}`}
          name={row.original.studentName}
          shape="circle"
          color="blue"
        />
      ),
    };

    const assessmentColumns = assessmentHeaders.map((header) => ({
      id: header,
      accessorFn: (row) =>
        row.assessmentGrades?.[header]?.gradeName ?? "Not Graded",
      header,
      cell: ({ row }) => renderGradeCell(row.original, header),
    }));

    return [studentColumn, ...assessmentColumns];
  }, [students, renderGradeCell]);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetPageIndex: false,
  });

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------

  return (
    <div className="overflow-visible p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            color="error"
            onClick={() => {
              setStudents(structuredClone(originalStudents));
              toast.info("Local changes discarded");
            }}
            disabled={isLoading}
          >
            CANCEL
          </Button>
          <Button
            color="warning"
            onClick={() => handleSave(172)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "IN-PROGRESS"}
          </Button>
          <Button
            color="success"
            onClick={() => handleSave(174)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "COMPLETED"}
          </Button>
        </div>
      </div>

      {alertMessage && (
        <div className="mb-4 flex items-center gap-3 rounded bg-yellow-500 p-4 text-white">
          <ExclamationCircleIcon className="h-6 w-6" />
          <span>{alertMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner color="primary" className="size-14 border-4" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <Tr>
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                ))}
              </Tr>
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="disabled:opacity-50"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
