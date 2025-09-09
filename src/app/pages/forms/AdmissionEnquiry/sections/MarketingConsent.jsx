// src/app/pages/forms/StudentRegistrationForm/sections/MarketingConsent.jsx
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {  Button } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import SectionCard from "../components/SectionCard";
import { MegaphoneIcon } from "@heroicons/react/24/outline";
import SignaturePad from "react-signature-canvas";
import { fetchHeardAboutUsOptions } from "./MarketingConsentdata";

export default function MarketingConsent() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [heardAboutUsOptions, setHeardAboutUsOptions] = useState([]);
  const sigRef = useRef(null);
  const savedSignature = useWatch({ control, name: "signature" }); // base64 or ""

  // compact inputs
  const small = "h-8 py-1 text-xs placeholder:text-xs";

  useEffect(() => {
    fetchHeardAboutUsOptions().then((opts) =>
      setHeardAboutUsOptions(Array.isArray(opts) ? opts : []),
    );
  }, []);

  // Load saved signature (if editing)
  useEffect(() => {
    if (sigRef.current && savedSignature) {
      try {
        sigRef.current.fromDataURL(savedSignature);
      } catch {
        // ignore invalid data URL
      }
    }
  }, [savedSignature]);

  const handleSigEnd = () => {
    if (!sigRef.current) return;
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    setValue("signature", dataUrl, { shouldDirty: true, shouldValidate: true });
  };

  const clearSignature = () => {
    sigRef.current?.clear();
    setValue("signature", "", { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="col-span-12">
      <SectionCard>
        {/* Header: title on left, dropdown on right */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MegaphoneIcon className="size-5 text-primary-600 dark:text-primary-400" />
            <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
              Marketing & Consent
            </h3>
          </div>

          {/* Dropdown on right */}
          <div className="w-full sm:w-80">
            <Controller
              name="hear_about_us_type_id"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={
                    <span className="inline-flex items-center gap-2">
                      <MegaphoneIcon className="size-4 text-primary-600 dark:text-primary-400" />
                      Where did you hear about us?
                    </span>
                  }
                  data={heardAboutUsOptions}
                  displayField="label"
                  value={
                    heardAboutUsOptions.find((h) => h.id === field.value) || null
                  }
                  onChange={(val) =>
                    field.onChange(val?.id != null ? Number(val.id) : null)
                  }
                  placeholder="Select option"
                  error={errors?.hear_about_us_type_id?.message}
                  inputProps={{ className: small }}
                />
              )}
            />
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Consent Checkbox */}
          <div className="col-span-12">
            <label className="dark:text-dark-100 flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("isAgreedToTerms")}
                className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-gray-300"
              />
              <span>
                I hereby acknowledge to receive promotion and transaction updates
                through Email/SMS from My School Italy.
              </span>
            </label>
            {errors?.isAgreedToTerms && (
              <p className="mt-1 text-xs text-red-500">
                {errors.isAgreedToTerms.message}
              </p>
            )}
          </div>

          {/* E-signature (draw) */}
          <div className="col-span-12 lg:col-span-6">
            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-dark-100">
              E-Signature
            </div>

            <div className="rounded-md border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800">
              <SignaturePad
                ref={sigRef}
                canvasProps={{
                  className:
                    "w-full h-32 rounded-md [touch-action:none] cursor-crosshair",
                }}
                onEnd={handleSigEnd}
              />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Button size="sm" variant="outlined" onClick={clearSignature}>
                Clear
              </Button>
              <span className="text-xs text-gray-500 dark:text-dark-300">
                {savedSignature ? "Signature captured ✓" : "Draw your signature above"}
              </span>
            </div>

            {/* If you also want a typed fallback, uncomment below:
            <div className="mt-3">
              <Input
                label="Type your full name (optional)"
                placeholder="e.g., Jane Doe"
                {...register("signature_name")}
              />
            </div>
            */}

            {errors?.signature && (
              <p className="mt-1 text-xs text-red-500">
                {errors.signature.message}
              </p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
