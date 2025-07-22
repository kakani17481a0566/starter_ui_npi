import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { getSessionData } from "utils/sessionStorage";
import { createTimeTableDetail, fetchTimeTableDetailInsertOptions } from "./data";
import { Loader2Icon, CalendarIcon } from "lucide-react";
import { schema } from "./schema";

const InsertTimeTableDetailForm = ({ onSuccess }) => {
  const session = getSessionData();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    courses: [],
    periods: [],
    timeTables: [],
    teachers: [],
  });

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseId: "",
      subjectId: "",
      weekId: "",
      periodId: "",
      timeTableId: "",
      teacherId: "",
      tenantId: session.tenantId,
      createdBy: session.userId,
    },
    mode: "onChange",
  });

  const selectedCourseId = watch("courseId") ?? "";
  const selectedSubjectId = watch("subjectId") ?? "";
  const selectedWeekId = watch("weekId") ?? "";

  // Derived options
  const selectedCourse = options.courses.find((c) => String(c.id) === selectedCourseId);
  const subjects = selectedCourse?.subjects || [];
  const selectedSubject = subjects.find((s) => String(s.id) === selectedSubjectId);
  const weeks = selectedSubject?.weeks || [];

  // Filter periods by selected course
  const filteredPeriods = options.periods.filter(
    (period) => selectedCourseId ? period.courseId === Number(selectedCourseId) : true
  );
  // Filter timeTables by selected course and week
  const filteredTimeTables = options.timeTables.filter(
    (tt) =>
      (!selectedCourseId || tt.courseId === Number(selectedCourseId)) &&
      (!selectedWeekId || tt.weekId === Number(selectedWeekId))
  );

  // Fetch insert options
  useEffect(() => {
    async function loadOptions() {
      setLoading(true);
      try {
        const res = await fetchTimeTableDetailInsertOptions(session.tenantId);
        setOptions({
          courses: res.data?.courses || [],
          periods: res.data?.periods || [],
          timeTables: res.data?.timeTables || [],
          teachers: res.data?.teachers || [],
        });
      } catch {
        toast.error("❌ Failed to load insert options");
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, [session.tenantId]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    setValue("subjectId", "");
    setValue("weekId", "");
    setValue("periodId", "");
    setValue("timeTableId", "");
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    setValue("weekId", "");
    setValue("periodId", "");
    setValue("timeTableId", "");
  }, [selectedSubjectId, setValue]);

  useEffect(() => {
    setValue("periodId", "");
    setValue("timeTableId", "");
  }, [selectedWeekId, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        courseId: Number(data.courseId),
        subjectId: Number(data.subjectId),
        weekId: Number(data.weekId),
        periodId: Number(data.periodId),
        timeTableId: Number(data.timeTableId),
        teacherId: Number(data.teacherId),
        tenantId: Number(data.tenantId),
        createdBy: Number(data.createdBy),
      };
      const res = await createTimeTableDetail(payload);

      if (res?.statusCode === 201) {
        toast.success("✅ Time Table Detail Created Successfully");
        reset();
        onSuccess?.();
      } else {
        toast.error("❌ Failed to create time table detail");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to create time table detail";
      toast.error(`❌ ${errMsg}`);
    }
  };

  const requiredMark = <span className="pl-1 text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 dark:bg-dark-700 space-y-6 p-6 shadow-lg">
        <div className="flex items-center gap-2 text-primary-900 mb-2 text-lg font-semibold tracking-wide dark:text-white">
          <CalendarIcon className="inline-block h-5 w-5" />
          Create New Time Table Detail
          {(loading || isSubmitting) && (
            <Loader2Icon className="ml-2 h-5 w-5 animate-spin text-primary-600" />
          )}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Course */}
          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <Select
                label="Course"
                {...field}
                value={field.value}
                onChange={field.onChange}
                error={errors?.courseId?.message}
                labelSlot={requiredMark}
              >
                <option value="">Select Course</option>
                {options.courses.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Subject */}
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select
                label="Subject"
                {...field}
                value={field.value}
                onChange={field.onChange}
                error={errors?.subjectId?.message}
                labelSlot={requiredMark}
                disabled={!selectedCourseId}
              >
                <option value="">
                  {selectedCourseId ? "Select Subject" : "Select Course First"}
                </option>
                {subjects.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Week */}
          <Controller
            name="weekId"
            control={control}
            render={({ field }) => (
              <Select
                label="Week"
                {...field}
                value={field.value}
                onChange={field.onChange}
                error={errors?.weekId?.message}
                labelSlot={requiredMark}
                disabled={!selectedSubjectId}
              >
                <option value="">
                  {selectedSubjectId ? "Select Week" : "Select Subject First"}
                </option>
                {weeks.map((w) => (
                  <option key={w.id} value={String(w.id)}>
                    {w.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Period */}
          <Controller
            name="periodId"
            control={control}
            render={({ field }) => (
              <Select
                label="Period"
                {...field}
                value={field.value}
                onChange={field.onChange}
                error={errors?.periodId?.message}
                labelSlot={requiredMark}
                disabled={!selectedCourseId}
              >
                <option value="">
                  {selectedCourseId ? "Select Period" : "Select Course First"}
                </option>
                {filteredPeriods.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Time Table */}
          <Controller
            name="timeTableId"
            control={control}
            render={({ field }) => (
              <Select
                label="Time Table"
                {...field}
                value={field.value}
                onChange={field.onChange}
                error={errors?.timeTableId?.message}
                labelSlot={requiredMark}
                disabled={!selectedCourseId || !selectedWeekId}
              >
                <option value="">
                  {selectedCourseId && selectedWeekId
                    ? "Select Time Table"
                    : "Select Course & Week First"}
                </option>
                {filteredTimeTables.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Teacher */}
          <Controller
            name="teacherId"
            control={control}
            render={({ field }) => (
              <Select
                label="Teacher"
                {...field}
                value={field.value}
                onChange={field.onChange}
                error={errors?.teacherId?.message}
                labelSlot={requiredMark}
              >
                <option value="">Select Teacher</option>
                {options.teachers.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Tenant ID */}
          <Input
            label="Tenant ID"
            {...register("tenantId")}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />

          {/* Created By */}
          <Input
            label="Created By"
            {...register("createdBy")}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className={`min-w-[8rem] font-medium text-white ${
              !isValid || isSubmitting || loading
                ? "cursor-not-allowed bg-red-500 opacity-70"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
            disabled={!isValid || isSubmitting || loading}
          >
            {(isSubmitting || loading) ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InsertTimeTableDetailForm;
