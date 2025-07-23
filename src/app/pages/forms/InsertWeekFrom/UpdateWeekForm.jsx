// src/app/pages/forms/UpdateWeekForm.jsx

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import axios from "axios";
import dayjs from "dayjs";
import { Input } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Button, Card } from "components/ui";
import * as Yup from "yup";
import { useEffect } from "react";
import { getSessionData } from "utils/sessionStorage";

// Validation schema
const schema = Yup.object().shape({
  name: Yup.string().trim().min(2, "Name too short").max(50, "Name too long").required("Name required"),
  startDate: Yup.date().required("Start date required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date required"),
  // updatedBy is not shown to user but is part of payload
});

export default function UpdateWeekForm({ initialValues, onSuccess }) {
  // Get session
  const session = getSessionData();
  const sessionUserId = session.userId ? parseInt(session.userId) : 1;
  const userName = session.user || `User ID: ${sessionUserId}`;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    reset,
    // setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialValues?.name || "",
      startDate: initialValues?.startDate ? dayjs(initialValues.startDate).format("YYYY-MM-DD") : "",
      endDate: initialValues?.endDate ? dayjs(initialValues.endDate).format("YYYY-MM-DD") : "",
    },
    mode: "onChange",
  });

  // Reset on row change
  useEffect(() => {
    reset({
      name: initialValues?.name || "",
      startDate: initialValues?.startDate ? dayjs(initialValues.startDate).format("YYYY-MM-DD") : "",
      endDate: initialValues?.endDate ? dayjs(initialValues.endDate).format("YYYY-MM-DD") : "",
    });
  }, [initialValues, reset]);

  // Inject updatedBy in submit only
  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
        updatedBy: sessionUserId,
      };

      const res = await axios.put(
        `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Week/${initialValues.id}/tenant/${initialValues.tenantId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        toast.success("✅ " + (res.data.message || "Week updated successfully"));
        reset(payload);
        onSuccess?.(res.data.data);
      } else {
        toast.error("❌ Unexpected response");
      }
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.errors?.name?.[0] ||
        error.response?.data?.title ||
        "Failed to update week";
      toast.error("❌ " + message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="space-y-5 p-5 text-primary-950">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Week Name"
            placeholder="e.g., Week 1"
            {...register("name")}
            error={errors?.name?.message}
            className="text-primary-950"
          />
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                label="Start Date"
                value={field.value}
                onChange={field.onChange}
                error={errors?.startDate?.message}
                labelClass="text-primary-950"
                className="text-primary-950"
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                label="End Date"
                value={field.value}
                onChange={field.onChange}
                error={errors?.endDate?.message}
                labelClass="text-primary-950"
                className="text-primary-950"
              />
            )}
          />
          {/* Show user name or fallback */}
          <Input
            label="Updated By"
            type="text"
            value={userName}
            readOnly
            className="text-primary-950"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className={`min-w-[7rem] text-white transition-all ${
              !isValid || isSubmitting || Object.keys(dirtyFields).length === 0
                ? "bg-red-500 cursor-not-allowed opacity-70"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
            disabled={!isValid || isSubmitting || Object.keys(dirtyFields).length === 0}
          >
            {isSubmitting ? (
              <span className="text-primary-600">Saving...</span>
            ) : (
              <span className="text-primary-600">Update</span>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}
