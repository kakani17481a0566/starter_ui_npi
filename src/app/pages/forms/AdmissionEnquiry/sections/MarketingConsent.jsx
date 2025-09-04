import { Controller, useFormContext } from "react-hook-form";
import { Input } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import SectionCard from "../components/SectionCard";
import { heardAboutUs } from "../data";
import { MegaphoneIcon } from "@heroicons/react/24/outline";

export default function MarketingConsent() {
  const { register, control, formState: { errors } } = useFormContext();

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
          <div className="col-span-12 lg:col-span-6">
            <Controller
              name="heard_about_us"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={
                    <span className="inline-flex items-center gap-2">
                      <MegaphoneIcon className="size-4 text-primary-600 dark:text-primary-400" />
                      Where did you hear about us?
                    </span>
                  }
                  data={heardAboutUs}
                  value={heardAboutUs.find((h) => h.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select option"
                  error={errors?.heard_about_us?.message}
                />
              )}
            />
          </div>

          <div className="col-span-12">
            <label className="dark:text-dark-100 flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("consent_agree")}
                className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-gray-300"
              />
              <span>
                I hereby acknowledge to receive promotion and transaction updates through Email/SMS from My School Italy.
              </span>
            </label>
            {errors?.consent_agree && (
              <p className="mt-1 text-xs text-red-500">{errors.consent_agree.message}</p>
            )}
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Input
              label="E-Signature"
              {...register("e_signature")}
              error={errors?.e_signature?.message}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
