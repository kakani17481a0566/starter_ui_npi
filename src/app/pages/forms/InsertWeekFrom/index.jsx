import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import axios from "axios";
import dayjs from "dayjs";
import { Input } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Button, Card } from "components/ui";
import { schema } from "./schema";
import { getSessionData } from "utils/sessionStorage";

export default function InsertWeekForm({ onSuccess, onCancel }) {
  // Get session info
  const session = getSessionData();
  const sessionUserId = session.userId ? parseInt(session.userId) : 1;
  const userName = session.user || `User ID: ${sessionUserId}`;
  const tenantId = session.tenantId ? parseInt(session.tenantId) : "";

  const initialState = {
    TermId: "",
    Name: "",
    StartDate: "",
    EndDate: "",
    TenantId: tenantId,
    CreatedBy: sessionUserId,
  };

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
      TenantId: tenantId,
      CreatedBy: sessionUserId,
    };

    try {
      const response = await axios.post(
        "https://localhost:7202/api/Week",
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 201) {
        toast.success(
          "✅ " + (response.data.message || "Week created successfully"),
        );
        reset(initialState);
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
      <Card className="text-primary-950 space-y-5 p-5">
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
            value={tenantId}
            readOnly
            className="text-primary-950"
          />
          {/* Show user name, but pass only ID to backend */}
          <Input
            label="Created By"
            type="text"
            value={userName}
            readOnly
            className="text-primary-950"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outlined"
            className="min-w-[7rem]"
            onClick={onCancel}
          >
            Cancel
          </Button>
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
}
