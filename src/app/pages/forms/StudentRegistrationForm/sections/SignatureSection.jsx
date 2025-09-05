import { useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import SignaturePad from "react-signature-canvas";
import { Card, Button } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import {
  CalendarDaysIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Label with Icon helper
const LabelWithIcon = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2">
    <Icon className="text-primary-600 dark:text-primary-400 size-4" />
    <span>{children}</span>
  </span>
);

export default function SignatureSection() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const sigRef = useRef();
  const saved = watch("signature_data");

  // Load saved signature into pad
  useEffect(() => {
    if (sigRef.current && saved) {
      try {
        sigRef.current.fromDataURL(saved);
      } catch {
        console.warn("Invalid signature base64 data");
      }
    }
  }, [saved]);

  // Save signature to form
  const handleSave = () => {
    if (!sigRef.current.isEmpty()) {
      const dataURL = sigRef.current.toDataURL();
      setValue("signature_data", dataURL, { shouldValidate: true });
    }
  };

  // Clear signature
  const handleClear = () => {
    sigRef.current.clear();
    setValue("signature_data", "", { shouldValidate: true });
  };

  return (
    <Card className="p-4 sm:px-5">
      <div className="grid grid-cols-12 gap-4">
        {/* Signature Pad */}
        <div className="col-span-12">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            <LabelWithIcon icon={PencilSquareIcon}>
              Signature of Custodial Parent
            </LabelWithIcon>
          </label>
          <div className="border border-gray-300 rounded-md p-2 bg-white dark:bg-dark-800">
            <SignaturePad
              ref={sigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 150, className: "bg-white" }}
            />

            {/* Buttons */}
            <div className="mt-2 flex gap-2">
              <Button type="button" onClick={handleSave}>
                Save Signature
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                <TrashIcon className="size-4" />
                Clear
              </Button>
            </div>

            {/* Error */}
            {errors?.signature_data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.signature_data.message}
              </p>
            )}
          </div>
        </div>

        {/* Hidden Field for base64 data */}
        <input type="hidden" {...register("signature_data")} />

        {/* Signature Date */}
        <div className="col-span-12 md:col-span-6">
          <Controller
            name="signature_date"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <DatePicker
                label={<LabelWithIcon icon={CalendarDaysIcon}>Date</LabelWithIcon>}
                value={value ?? null}
                onChange={onChange}
                options={{
                  disableMobile: true,
                  dateFormat: "d/m/Y",
                  maxDate: "today",
                }}
                placeholder="dd/mm/yyyy"
                error={errors?.signature_date?.message}
                {...rest}
              />
            )}
          />
        </div>
      </div>
    </Card>
  );
}
