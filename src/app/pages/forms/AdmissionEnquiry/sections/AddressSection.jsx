import { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Input, Checkbox, Collapse } from "components/ui";
import { CountrySelect } from "../components/CountrySelect";
import SectionCard from "../components/SectionCard";
import {
  HomeIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

export default function AddressSection() {
  const { register, control, setValue, clearErrors, formState: { errors } } = useFormContext();

  const small = "h-8 py-1 text-xs placeholder:text-xs";

  // Watches
  const isSame = useWatch({ control, name: "isSameCorrespondenceAddress" });

  const addr1 = useWatch({ control, name: "address_line1" });
  const addr2 = useWatch({ control, name: "address_line2" });
  const city = useWatch({ control, name: "city" });
  const state = useWatch({ control, name: "state" });
  const pcode = useWatch({ control, name: "postal_code" });
  const country = useWatch({ control, name: "country" });

  // Mirror logic
  useEffect(() => {
    if (isSame) {
      setValue("correspondence_address_line1", addr1 ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_address_line2", addr2 ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_city", city ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_state", state ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_postal_code", pcode ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_country", country ?? null, { shouldDirty: true, shouldValidate: true });

      clearErrors([
        "correspondence_address_line1",
        "correspondence_address_line2",
        "correspondence_city",
        "correspondence_state",
        "correspondence_postal_code",
        "correspondence_country",
      ]);
    }
  }, [isSame, addr1, addr2, city, state, pcode, country, setValue, clearErrors]);

  useEffect(() => {
    if (isSame === false) {
      setValue("correspondence_address_line1", "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_address_line2", "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_city", "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_state", "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_postal_code", "", { shouldDirty: true, shouldValidate: true });
      setValue("correspondence_country", null, { shouldDirty: true, shouldValidate: true });
    }
  }, [isSame, setValue]);

  return (
    <div className="col-span-12">
      <SectionCard>
        {/* Title */}
        <div className="flex items-center gap-2">
          <HomeIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Address
          </h3>
        </div>

        {/* Divider (consistent visual style) */}
        <div className="mt-3 border-t border-gray-200 dark:border-dark-600" />

        {/* Permanent Address */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6">
            <Input
              label={<Label label="Address Line 1" Icon={MapPinIcon} />}
              placeholder="House/Flat, Street/Road"
              autoComplete="address-line1"
              className={small}
              {...register("address_line1")}
              error={errors?.address_line1?.message}
            />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Input
              label={<Label label="Address Line 2" Icon={MapPinIcon} trailing="(Optional)" />}
              placeholder="Area, Landmark (optional)"
              autoComplete="address-line2"
              className={small}
              {...register("address_line2")}
              error={errors?.address_line2?.message}
            />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Input
              label={<Label label="City" Icon={BuildingOffice2Icon} />}
              autoComplete="address-level2"
              className={small}
              {...register("city")}
              error={errors?.city?.message}
            />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Input
              label={<Label label="State/Province" Icon={GlobeAltIcon} />}
              autoComplete="address-level1"
              className={small}
              {...register("state")}
              error={errors?.state?.message}
            />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Input
              label={<Label label="Postal Code" Icon={HashtagIcon} />}
              inputMode="numeric"
              autoComplete="postal-code"
              className={small}
              {...register("postal_code")}
              error={errors?.postal_code?.message}
            />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Controller
              name="country"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <CountrySelect
                  onChange={onChange}
                  value={value ?? null}
                  error={errors?.country?.message}
                  className={small}
                  {...rest}
                />
              )}
            />
          </div>

          <div className="col-span-12">
            <Checkbox
              {...register("isSameCorrespondenceAddress")}
              label="Correspondence address is the same as permanent address."
            />
          </div>
        </div>

        {/* Correspondence Section */}
        <Collapse in={!isSame}>
          <hr className="mt-6 border-gray-200 dark:border-dark-600" />
          <div className="mt-4 flex items-center gap-2">
            <HomeIcon className="size-5 text-primary-600 dark:text-primary-400" />
            <h4 className="dark:text-dark-100 text-sm font-medium text-gray-800">
              Correspondence Address
            </h4>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              <Input
                label={<Label label="Address Line 1" Icon={MapPinIcon} />}
                placeholder="House/Flat, Street/Road"
                autoComplete="address-line1"
                disabled={isSame}
                className={small}
                {...register("correspondence_address_line1")}
                error={errors?.correspondence_address_line1?.message}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <Input
                label={<Label label="Address Line 2" Icon={MapPinIcon} trailing="(Optional)" />}
                placeholder="Area, Landmark (optional)"
                autoComplete="address-line2"
                disabled={isSame}
                className={small}
                {...register("correspondence_address_line2")}
                error={errors?.correspondence_address_line2?.message}
              />
            </div>

            <div className="col-span-12 lg:col-span-3">
              <Input
                label={<Label label="City" Icon={BuildingOffice2Icon} />}
                autoComplete="address-level2"
                disabled={isSame}
                className={small}
                {...register("correspondence_city")}
                error={errors?.correspondence_city?.message}
              />
            </div>

            <div className="col-span-12 lg:col-span-3">
              <Input
                label={<Label label="State/Province" Icon={GlobeAltIcon} />}
                autoComplete="address-level1"
                disabled={isSame}
                className={small}
                {...register("correspondence_state")}
                error={errors?.correspondence_state?.message}
              />
            </div>

            <div className="col-span-12 lg:col-span-3">
              <Input
                label={<Label label="Postal Code" Icon={HashtagIcon} />}
                inputMode="numeric"
                autoComplete="postal-code"
                disabled={isSame}
                className={small}
                {...register("correspondence_postal_code")}
                error={errors?.correspondence_postal_code?.message}
              />
            </div>

            <div className="col-span-12 lg:col-span-3">
              <Controller
                name="correspondence_country"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <CountrySelect
                    onChange={onChange}
                    value={value ?? null}
                    error={errors?.correspondence_country?.message}
                    disabled={isSame}
                    className={small}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>
        </Collapse>
      </SectionCard>
    </div>
  );
}

function Label({ label, Icon, trailing }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="size-4 text-primary-600 dark:text-primary-400" />
      <span>{label}</span>
      {trailing ? (
        <span className="text-xs text-gray-400 dark:text-dark-300">{trailing}</span>
      ) : null}
    </span>
  );
}
