// src/app/pages/forms/InsertTimeTableForm/UpdateTimeTableForm.jsx

import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { useEffect, useState } from "react";
import { schema } from "./schema";
import { updateTimeTable, fetchTimeTableInsertOptions } from "./data";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { getSessionData } from "utils/sessionStorage";

const UpdateTimeTableForm = ({ initialData, onSuccess }) => {
  const session = getSessionData();
  const userId = Number(session?.userId ?? 0);

  const [options, setOptions] = useState({
    weeks: [],
    holidays: [],
    courses: [],
    assessmentStatuses: [],
    statusOptions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema("update")), // ✅ use 'update' mode
    defaultValues: {
      name: "",
      date: null,
      weekId: "",
      holidayId: "",
      status: "",
      courseId: "",
      assessmentStatusCode: "",
      tenantId: "",
      updatedBy: userId,
    },
    mode: "onTouched",
  });

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      if (initialData?.tenantId) {
        setIsLoading(true);
        try {
          const res = await fetchTimeTableInsertOptions(initialData.tenantId);
          if (res.statusCode === 200) {
            setOptions({
              ...res.data,
              statusOptions: res.data.statusOptions || [],
            });
          } else {
            throw new Error(res.message || "Failed to fetch options");
          }
        } catch {
          toast.error("Failed to load form options");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadOptions();
  }, [initialData]);

  // Reset form with incoming initial data
  useEffect(() => {
    if (initialData) {
      let dateValue = initialData.date
        ? isValid(parseISO(initialData.date))
          ? parseISO(initialData.date)
          : new Date()
        : new Date();
      const dayName = format(dateValue, "EEEE").toUpperCase();

      let statusValue = initialData.status;
      if (!statusValue && options.statusOptions.length > 0) {
        statusValue = options.statusOptions[0];
      }

      reset({
        ...initialData,
        date: dateValue,
        name: dayName,
        weekId: initialData.weekId ? String(initialData.weekId) : "",
        holidayId: initialData.holidayId ? String(initialData.holidayId) : "",
        status: statusValue || "",
        courseId: initialData.courseId ? String(initialData.courseId) : "",
        assessmentStatusCode: initialData.assessmentStatusCode
          ? String(initialData.assessmentStatusCode)
          : "",
        tenantId: initialData.tenantId ? String(initialData.tenantId) : "",
        updatedBy: userId,
      });
    }
    // eslint-disable-next-line
  }, [initialData, options.statusOptions]);

  // Auto-sync day name from date
  const dateValue = useWatch({ control, name: "date" });
  useEffect(() => {
    if (dateValue && isValid(dateValue)) {
      const dayName = format(dateValue, "EEEE").toUpperCase();
      if (getValues("name") !== dayName) {
        reset(
          { ...getValues(), name: dayName },
          { keepErrors: true, keepDirty: true }
        );
      }
    }
  }, [dateValue]);

  const onSubmit = async (data) => {
    try {
      const formattedDate = data.date ? format(data.date, "yyyy-MM-dd") : null;

      const payload = {
        ...data,
        name: data.name?.trim(),
        date: formattedDate,
        weekId: Number(data.weekId),
        holidayId:
          data.holidayId === "" || data.holidayId == null
            ? null
            : Number(data.holidayId),
        courseId: Number(data.courseId),
        assessmentStatusCode: Number(data.assessmentStatusCode),
        tenantId: Number(data.tenantId),
        updatedBy: userId,
      };

      console.log("🔼 Submitting update payload", {
        id: initialData.id,
        tenantId: initialData.tenantId,
        payload,
      });

      const res = await updateTimeTable({
        id: initialData.id,
        tenantId: initialData.tenantId,
        payload,
      });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(res.message || "Time Table updated successfully");
        if (onSuccess) onSuccess();
      } else {
        throw new Error(res.message || "Unexpected server response");
      }
    } catch (error) {
      const errData = error.response?.data;
      const message =
        Object.values(errData?.errors || {})[0]?.[0] ||
        errData?.message ||
        error.message ||
        "Failed to update timetable";
      toast.error("❌ " + message);
    }
  };

  if (!initialData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-base text-gray-500">
          Loading timetable data...
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading form data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 dark:bg-dark-700 space-y-6 p-6 shadow-lg">
        <div className="text-primary-900 mb-2 text-lg font-semibold tracking-wide dark:text-white">
          <CalendarIcon className="mr-2 inline-block h-5 w-5" />
          Update Time Table
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Name"
            {...register("name")}
            error={errors?.name?.message}
            readOnly
            value={getValues("name") || ""}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date (YYYY-MM-DD)"
                options={{
                  dateFormat: "Y-m-d",
                  allowInput: true,
                  defaultDate: field.value,
                }}
                value={field.value}
                onChange={(dates) => {
                  if (dates && dates[0]) {
                    field.onChange(dates[0]);
                  } else {
                    field.onChange(null);
                  }
                }}
                error={errors?.date?.message}
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
                value={field.value || ""}
                onChange={field.onChange}
                error={errors?.weekId?.message}
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
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? null : e.target.value)
                }
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
                value={field.value || ""}
                onChange={field.onChange}
                error={errors?.status?.message}
              >
                <option value="" disabled>
                  Select Status
                </option>
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
                value={field.value || ""}
                onChange={field.onChange}
                error={errors?.courseId?.message}
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
                value={field.value || ""}
                onChange={field.onChange}
                error={errors?.assessmentStatusCode?.message}
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
            label="User"
            value={session.user || ""}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 min-w-[8rem] font-medium text-white"
            disabled={isSubmitting}
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

export default UpdateTimeTableForm;
