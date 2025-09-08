import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import SectionCard from "../components/SectionCard";
import { MegaphoneIcon } from "@heroicons/react/24/outline";
import { fetchHeardAboutUsOptions } from "./MarketingConsentdata";

export default function MarketingConsent() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const [heardAboutUsOptions, setHeardAboutUsOptions] = useState([]);

  useEffect(() => {
    fetchHeardAboutUsOptions().then(setHeardAboutUsOptions);
  }, []);

  return (
    <div className="col-span-12">
      <SectionCard>
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Marketing & Consent
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Heard About Us */}
          <div className="col-span-12 lg:col-span-6">
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
                  value={heardAboutUsOptions.find((h) => h.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select option"
                  error={errors?.hearAboutUsTypeId?.message}
                />
              )}
            />
          </div>

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

          {/* E-signature */}
          <div className="col-span-12 lg:col-span-6">
            <Input
              label="E-Signature"
              {...register("signature")}
              error={errors?.signature?.message}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
