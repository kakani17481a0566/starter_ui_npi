//src\app\pages\forms\InsertTimeTableForm\index.jsx
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { getSessionData } from "utils/sessionStorage";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { schema } from "./schema";
import { createTimeTable, fetchTimeTableInsertOptions } from "./data";
import { CalendarIcon, Loader2Icon } from "lucide-react";

const InsertTimeTableForm = ({ onSuccess }) => {
  const session = getSessionData();

  const [options, setOptions] = useState({
    weeks: [],
    holidays: [],
    courses: [],
    assessmentStatuses: [],
    statusOptions: [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "", // <-- start empty!
      date: new Date(),
      weekId: "",
      holidayId: "",
      status: "working",
      courseId: "",
      assessmentStatusCode: "",
      tenantId: session.tenantId,
      createdBy: session.userId,
    },
    mode: "onChange",
  });

  // Watch the date and name fields
  const dateValue = watch("date");
  const nameValue = watch("name");
  const didMount = useRef(false);

  // Only auto-fill name after mount and if name is empty
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return; // skip initial render
    }
    if (!dateValue) return;
    if (!nameValue) {
      const day = format(new Date(dateValue), "EEEE");
      setValue("name", day, { shouldValidate: true });
    }
  }, [dateValue, nameValue, setValue]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await fetchTimeTableInsertOptions(session.tenantId);
        setOptions(res.data);
      } catch {
        toast.error("❌ Failed to load insert options");
      }
    };
    loadOptions();
  }, [session.tenantId]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      name: data.name?.trim(),
      date: new Date(data.date).toISOString(),
      weekId: Number(data.weekId),
      holidayId: data.holidayId === "" ? null : Number(data.holidayId),
      status: data.status,
      courseId: Number(data.courseId),
      assessmentStatusCode: Number(data.assessmentStatusCode),
      tenantId: Number(data.tenantId),
      createdBy: Number(data.createdBy),
    };

    try {
      const res = await createTimeTable(payload);
      if (res?.statusCode === 201) {
        toast.success("✅ " + (res.message || "Time Table Created"));
        reset({
          name: "",
          date: new Date(),
          weekId: "",
          holidayId: "",
          status: "working",
          courseId: "",
          assessmentStatusCode: "",
          tenantId: session.tenantId,
          createdBy: session.userId,
        });
        if (onSuccess) onSuccess();
      } else {
        toast.error("❌ Unexpected error");
      }
    } catch (error) {
      const errData = error.response?.data;
      const message =
        Object.values(errData?.errors || {})[0]?.[0] ||
        errData?.title ||
        "Failed to create timetable";
      toast.error("❌ " + message);
    }
  };

  const requiredMark = <span className="pl-1 text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 dark:bg-dark-700 space-y-6 p-6 shadow-lg">
        <div className="text-primary-900 mb-2 text-lg font-semibold tracking-wide dark:text-white">
          <CalendarIcon className="mr-2 inline-block h-5 w-5" />
          Create New Time Table
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Name"
            {...register("name")}
            error={errors?.name?.message}
            labelSlot={requiredMark}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date"
                selected={field.value}
                onChange={field.onChange}
                error={errors?.date?.message}
                labelSlot={requiredMark}
              />
            )}
          />

          <Controller
            name="weekId"
            control={control}
            render={({ field }) => (
              <Select
                label="Week"
                {...field}
                onValueChange={field.onChange}
                error={errors?.weekId?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Week
                </option>
                {options.weeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="holidayId"
            control={control}
            render={({ field }) => (
              <Select
                label="Holiday (optional)"
                {...field}
                onValueChange={field.onChange}
                error={errors?.holidayId?.message}
              >
                <option value="">None</option>
                {options.holidays.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                {...field}
                onValueChange={field.onChange}
                error={errors?.status?.message}
                labelSlot={requiredMark}
              >
                {options.statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <Select
                label="Course"
                {...field}
                onValueChange={field.onChange}
                error={errors?.courseId?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Course
                </option>
                {options.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="assessmentStatusCode"
            control={control}
            render={({ field }) => (
              <Select
                label="Assessment Status"
                {...field}
                onValueChange={field.onChange}
                error={errors?.assessmentStatusCode?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Status
                </option>
                {options.assessmentStatuses.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Input
            label="Tenant ID"
            {...register("tenantId")}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />

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
              !isValid || isSubmitting
                ? "cursor-not-allowed bg-red-500 opacity-70"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
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

export default InsertTimeTableForm;
