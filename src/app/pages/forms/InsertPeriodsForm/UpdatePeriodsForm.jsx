// src/app/pages/forms/InsertPeriodsForm/UpdatePeriodsForm.jsx

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { useEffect, useState } from "react";
import { schema } from "./schema";
import {
  fetchCourseList,
  updatePeriod,
  fetchTenantById,
} from "./data";
import { getSessionData } from "utils/sessionStorage";

const UpdatePeriodsForm = ({ initialData, onSuccess, onCancel }) => {
  const session = getSessionData();
  const [courses, setCourses] = useState([]);
  const [tenantName, setTenantName] = useState("");
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
    getValues,
  } = useForm({
    resolver: yupResolver(schema("update")), // <-- USE UPDATE MODE HERE
    defaultValues: {
      name: "",
      courseId: "",
      startTime: "",
      endTime: "",
      tenantId: session.tenantId,
      updatedBy: session.userId,
    },
    mode: "onChange",
  });

  // Pad time to "HH:mm:ss"
  const padTime = (time) => (time?.length === 5 ? `${time}:00` : time);

  // Mount log
  useEffect(() => {
    console.log("[UpdatePeriodsForm] Mounted, session:", session);
  }, []);

  useEffect(() => {
    console.log("[UpdatePeriodsForm] initialData changed:", initialData);
  }, [initialData]);

  // Fetch courses and tenant info
  useEffect(() => {
    const fetchInitialData = async () => {
      const [courseData, tenant] = await Promise.all([
        fetchCourseList(),
        fetchTenantById(session.tenantId),
      ]);
      console.log("[UpdatePeriodsForm] Fetched courseData:", courseData);
      setCourses(courseData);
      setTenantName(tenant?.name || "");
      setCoursesLoaded(true);
    };
    fetchInitialData();
  }, [session.tenantId]);

  // Reset form ONLY when both initialData and courses are loaded
  useEffect(() => {
    if (initialData && coursesLoaded) {
      // Try to resolve courseId from courseName if needed
      let courseId = "";
      if (initialData.courseId) {
        courseId = String(initialData.courseId);
      } else if (initialData.courseName && courses.length > 0) {
        const matched = courses.find(
          (c) => c.name?.toLowerCase() === initialData.courseName?.toLowerCase()
        );
        if (matched) courseId = String(matched.id);
      }
      console.log("[UpdatePeriodsForm] Resetting form with:", {
        name: initialData.name || "",
        courseId,
        startTime: initialData.startTime ? initialData.startTime.slice(0, 5) : "",
        endTime: initialData.endTime ? initialData.endTime.slice(0, 5) : "",
        tenantId: initialData.tenantId,
        updatedBy: session.userId,
      });
      reset({
        name: initialData.name || "",
        courseId,
        startTime: initialData.startTime ? initialData.startTime.slice(0, 5) : "",
        endTime: initialData.endTime ? initialData.endTime.slice(0, 5) : "",
        tenantId: initialData.tenantId,
        updatedBy: session.userId,
      });
    }
  }, [initialData, coursesLoaded, courses, reset, session.userId]);

  // DEBUG: Log validation state, values, and errors
  useEffect(() => {
    console.log("[UpdatePeriodsForm] isValid:", isValid, "errors:", errors, "values:", getValues());
  }, [isValid, errors, getValues]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      courseId: Number(data.courseId), // Always send as number
      startTime: padTime(data.startTime),
      endTime: padTime(data.endTime),
    };
    try {
      const response = await updatePeriod({
        id: initialData.id,
        tenantId: data.tenantId,
        payload,
      });
      if (response?.statusCode === 200) {
        toast.success("✅ " + (response.message || "Period updated successfully"));
        if (onSuccess) onSuccess();
      } else {
        toast.error("❌ Unexpected response");
      }
    } catch (error) {
      const errData = error.response?.data;
      const firstError = Object.values(errData?.errors || {})[0]?.[0];
      const message = firstError || errData?.title || "Failed to update period";
      toast.error("❌ " + message);
    }
  };

  const requiredMark = <span className="text-red-500 pl-1">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="space-y-5 p-5 text-primary-950">
        <h2 className="text-lg font-semibold text-primary-950 dark:text-white">
          Update Period
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Period Name"
            {...register("name")}
            error={errors?.name?.message}
            labelSlot={requiredMark}
          />

          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <Select
                label="Course"
                value={field.value || ""}
                onChange={e => field.onChange(e.target.value)}
                error={errors?.courseId?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Input
            label="Start Time"
            type="time"
            {...register("startTime")}
            error={errors?.startTime?.message}
            labelSlot={requiredMark}
          />
          <Input
            label="End Time"
            type="time"
            {...register("endTime")}
            error={errors?.endTime?.message}
            labelSlot={requiredMark}
          />

          {/* Tenant Name + Hidden Tenant ID */}
          <>
            <Input
              label="Tenant"
              value={tenantName}
              readOnly
              labelSlot={requiredMark}
            />
            <input type="hidden" {...register("tenantId")} />
          </>

          <Input
            label="Updated By"
            type="number"
            readOnly
            {...register("updatedBy")}
            error={errors?.updatedBy?.message}
            labelSlot={requiredMark}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            className="min-w-[7rem]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`min-w-[7rem] text-white transition-all ${
              !isValid || isSubmitting
                ? "bg-red-500 cursor-not-allowed opacity-70"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="text-white">Saving...</span>
            ) : (
              <span className="text-white">Save</span>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default UpdatePeriodsForm;
