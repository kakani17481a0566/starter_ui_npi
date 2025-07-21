import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import axios from "axios";
import dayjs from "dayjs";
import { Input } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Button, Card } from "components/ui";
import { schema } from "./schema";

const initialState = {
  TermId: 1,
  Name: "",
  StartDate: "",
  EndDate: "",
  TenantId: 2,
  CreatedBy: 1,
};

export default function InsertWeekForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      StartDate: dayjs(data.StartDate).format("YYYY-MM-DD"),
      EndDate: dayjs(data.EndDate).format("YYYY-MM-DD"),
    };

    try {
      const response = await axios.post(
        "https://localhost:7202/api/Week",
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        toast.success("✅ " + (response.data.message || "Week created successfully"));
        reset();
        onSuccess?.();
      } else {
        toast.error("❌ Unexpected response");
      }
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.errors?.Name?.[0] ||
        error.response?.data?.title ||
        "Failed to create week";
      toast.error("❌ " + message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="space-y-5 p-5 text-primary-950">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Week Name"
            placeholder="e.g., Week 7"
            {...register("Name")}
            error={errors?.Name?.message}
            className="text-primary-950"
          />

          <Input
            label="Term ID"
            type="number"
            {...register("TermId")}
            error={errors?.TermId?.message}
            className="text-primary-950"
          />

          <Controller
            control={control}
            name="StartDate"
            render={({ field }) => (
              <DatePicker
                label="Start Date"
                value={field.value}
                onChange={field.onChange}
                error={errors?.StartDate?.message}
                labelClass="text-primary-950"
                className="text-primary-950"
              />
            )}
          />

          <Controller
            control={control}
            name="EndDate"
            render={({ field }) => (
              <DatePicker
                label="End Date"
                value={field.value}
                onChange={field.onChange}
                error={errors?.EndDate?.message}
                labelClass="text-primary-950"
                className="text-primary-950"
              />
            )}
          />

          <Input
            label="Tenant ID"
            type="number"
            {...register("TenantId")}
            error={errors?.TenantId?.message}
            className="text-primary-950"
          />

          <Input
            label="Created By"
            type="number"
            {...register("CreatedBy")}
            error={errors?.CreatedBy?.message}
            className="text-primary-950"
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
}
