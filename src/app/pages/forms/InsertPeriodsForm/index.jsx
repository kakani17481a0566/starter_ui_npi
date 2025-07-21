import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { getSessionData } from "utils/sessionStorage";
import { useEffect, useState } from "react";
import { schema } from "./schema";
import { fetchCourseList, createPeriod, fetchTenantById } from "./data"; // ✅ Updated import

const InsertPeriodsForm = ({ onSuccess }) => {
  const session = getSessionData();
  const [courses, setCourses] = useState([]);
  const [tenantName, setTenantName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      courseId: "",
      startTime: "",
      endTime: "",
      tenantId: session.tenantId,
      createdBy: session.userId,
    },
    mode: "onChange",
  });

  const padTime = (time) => (time?.length === 5 ? `${time}:00` : time);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      startTime: padTime(data.startTime),
      endTime: padTime(data.endTime),
    };

    try {
      const response = await createPeriod(payload);
      if (response.status === 201) {
        toast.success("✅ " + (response.data.message || "Period created successfully"));
        reset();
        if (onSuccess) onSuccess();
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

  const requiredMark = <span className="text-red-500 pl-1">*</span>;

  useEffect(() => {
    const fetchInitialData = async () => {
      const [courseData, tenant] = await Promise.all([
        fetchCourseList(),
        fetchTenantById(session.tenantId),
      ]);
      setCourses(courseData);
      setTenantName(tenant?.name || "");
    };
    fetchInitialData();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="space-y-5 p-5 text-primary-950">
        <h2 className="text-lg font-semibold text-primary-950 dark:text-white">
          Insert New Period
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
                {...field}
                value={field.value || ""}
                onValueChange={(val) => field.onChange(val)}
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

          {/* Tenant Name (Read-Only) + Hidden Tenant ID */}
          <>
            <Input
              label="Tenant"
              value={tenantName}
              readOnly
              labelSlot={requiredMark}
            />
            <input
              type="hidden"
              {...register("tenantId")}
            />
          </>

          <Input
            label="Created By"
            type="number"
            readOnly
            {...register("createdBy")}
            error={errors?.createdBy?.message}
            labelSlot={requiredMark}
          />
        </div>

        <div className="flex justify-end">
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
              <span className="text-primary-600">Saving...</span>
            ) : (
              <span className="text-primary-600">Save</span>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InsertPeriodsForm;
