import { useFormContext, Controller } from "react-hook-form";
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
  const { register, control, formState: { errors }, watch } = useFormContext();
  const isSame = watch("isSameCorrespondenceAddress");

  return (
    <div className="col-span-12">
      <SectionCard>
        <div className="flex items-center gap-2">
          <HomeIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Address
          </h3>
        </div>

        {/* Permanent */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Input
              label={<Label label="Address Line 1" Icon={MapPinIcon} />}
              placeholder="House/Flat, Street/Road"
              autoComplete="address-line1"
              {...register("address_line1")}
              error={errors?.address_line1?.message}
            />
          </div>

          <div className="col-span-12">
            <Input
              label={<Label label="Address Line 2" Icon={MapPinIcon} trailing="(Optional)" />}
              placeholder="Area, Landmark (optional)"
              autoComplete="address-line2"
              {...register("address_line2")}
              error={errors?.address_line2?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<Label label="City" Icon={BuildingOffice2Icon} />}
              autoComplete="address-level2"
              {...register("city")}
              error={errors?.city?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<Label label="State/Province" Icon={GlobeAltIcon} />}
              autoComplete="address-level1"
              {...register("state")}
              error={errors?.state?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<Label label="Postal Code" Icon={HashtagIcon} />}
              inputMode="numeric"
              autoComplete="postal-code"
              {...register("postal_code")}
              error={errors?.postal_code?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Controller
              name="country"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <CountrySelect
                  onChange={onChange}
                  value={value ?? null}
                  error={errors?.country?.message}
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

        {/* Correspondence */}
        <Collapse in={!isSame}>
          <hr className="mt-4 border-gray-200 dark:border-dark-500" />
          <div className="flex items-center gap-2 mt-4">
            <HomeIcon className="size-5 text-primary-600 dark:text-primary-400" />
            <h4 className="dark:text-dark-100 text-sm font-medium text-gray-800">
              Correspondence Address
            </h4>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <Input
                label={<Label label="Address Line 1" Icon={MapPinIcon} />}
                placeholder="House/Flat, Street/Road"
                autoComplete="address-line1"
                disabled={isSame}
                {...register("correspondence_address_line1")}
                error={errors?.correspondence_address_line1?.message}
              />
            </div>

            <div className="col-span-12">
              <Input
                label={<Label label="Address Line 2" Icon={MapPinIcon} trailing="(Optional)" />}
                placeholder="Area, Landmark (optional)"
                autoComplete="address-line2"
                disabled={isSame}
                {...register("correspondence_address_line2")}
                error={errors?.correspondence_address_line2?.message}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Input
                label={<Label label="City" Icon={BuildingOffice2Icon} />}
                autoComplete="address-level2"
                disabled={isSame}
                {...register("correspondence_city")}
                error={errors?.correspondence_city?.message}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Input
                label={<Label label="State/Province" Icon={GlobeAltIcon} />}
                autoComplete="address-level1"
                disabled={isSame}
                {...register("correspondence_state")}
                error={errors?.correspondence_state?.message}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Input
                label={<Label label="Postal Code" Icon={HashtagIcon} />}
                inputMode="numeric"
                autoComplete="postal-code"
                disabled={isSame}
                {...register("correspondence_postal_code")}
                error={errors?.correspondence_postal_code?.message}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Controller
                name="correspondence_country"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <CountrySelect
                    onChange={onChange}
                    value={value ?? null}
                    error={errors?.correspondence_country?.message}
                    disabled={isSame}
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
      {trailing ? <span className="text-xs text-gray-400 dark:text-dark-300">{trailing}</span> : null}
    </span>
  );
}
