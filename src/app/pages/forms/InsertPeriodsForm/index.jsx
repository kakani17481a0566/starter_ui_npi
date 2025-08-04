import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { useEffect, useState } from "react";
import { schema } from "./schema";
import { fetchCourseList, fetchTenantById, createPeriod } from "./data";
import { getSessionData } from "utils/sessionStorage";

const InsertPeriodsForm = ({ onSuccess }) => {
  const session = getSessionData();
  const [courses, setCourses] = useState([]);
  const [tenantName, setTenantName] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema("insert")),
    defaultValues: {
      name: "",
      courseId: null,
      startTime: "",
      endTime: "",
      tenantId: session.tenantId,
      createdBy: session.userId,
    },
    mode: "onChange",
  });

  const padTime = (time) => (time?.length === 5 ? `${time}:00` : time);

  useEffect(() => {
    const fetchData = async () => {
      const [courseData, tenant] = await Promise.all([
        fetchCourseList(),
        fetchTenantById(session.tenantId),
      ]);
      setCourses(courseData);
      setTenantName(tenant?.name || "");
    };
    fetchData();
  }, [session.tenantId]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      courseId: Number(data.courseId),
      startTime: padTime(data.startTime),
      endTime: padTime(data.endTime),
    };

    try {
      const response = await createPeriod(payload);

      const statusCode = response?.statusCode || response?.status;
      const message =
        response?.message ||
        response?.data?.message ||
        "Period created successfully";

      if (statusCode === 201) {
        toast.success("✅ " + message);
        reset();
        onSuccess?.();
      } else {
        toast.error("❌ Unexpected response");
      }
    } catch (error) {
      const errData = error.response?.data;
      const firstError = Object.values(errData?.errors || {})[0]?.[0];
      const message = firstError || errData?.title || "Failed to create period";
      toast.error("❌ " + message);
    }
  };

  const requiredMark = <span className="pl-1 text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 space-y-5 p-5">
        <h2 className="text-primary-950 text-lg font-semibold dark:text-white">
          New Period
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
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : null)
                }
                error={errors?.courseId?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
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

          <Input
            label="Tenant"
            value={tenantName}
            readOnly
            labelSlot={requiredMark}
          />
          <input type="hidden" {...register("tenantId")} />

          <Input
            label="Created By"
            value={session.user}
            readOnly
            labelSlot={requiredMark}
          />
          <input type="hidden" {...register("createdBy")} />
        </div>

        <div className="flex justify-end gap-4">
        
          <Button
            type="submit"
            className={`min-w-[7rem] rounded-md px-4 py-2 font-medium transition-all duration-200 ease-in-out ${
              isValid && !isSubmitting
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                <span>Saving...</span>
              </div>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InsertPeriodsForm;
