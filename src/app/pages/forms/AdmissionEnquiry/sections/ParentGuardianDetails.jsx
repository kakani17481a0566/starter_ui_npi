import { useFormContext, Controller } from "react-hook-form";
import { Input, Radio } from "components/ui";
import SectionCard from "../components/SectionCard";
import PhoneField from "../components/PhoneField";
import {
  UserGroupIcon,
  UserIcon,
  PencilSquareIcon,
  BriefcaseIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function ParentGuardianDetails() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="col-span-12 lg:col-span-6">
      <SectionCard>
        <div className="flex items-center gap-2">
          <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Father / Guardian Details
          </h3>
        </div>

        <div className="mt-4 space-y-4">
          <Controller
            name="relation_type"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  id="relation_type_label"
                  className="dark:text-dark-100 mb-2 inline-flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <UserGroupIcon className="size-4 text-primary-600 dark:text-primary-400" />
                  Parent/Guardian
                </label>

                <div className="flex flex-wrap gap-5" role="radiogroup" aria-labelledby="relation_type_label">
                  <Radio {...field} label="Parent" name={field.name} value="parent" variant="outlined"
                         color="primary" checked={field.value === "parent"} onChange={() => field.onChange("parent")} />
                  <Radio {...field} label="Guardian" name={field.name} value="guardian" variant="outlined"
                         color="primary" checked={field.value === "guardian"} onChange={() => field.onChange("guardian")} />
                </div>

                {errors?.relation_type && (
                  <p className="mt-1 text-xs text-red-500">{errors.relation_type.message}</p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Input
                label={<IconLabel Icon={UserIcon} text="First Name" />}
                {...register("parent_first_name")}
                error={errors?.parent_first_name?.message}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input
                label={<IconLabel Icon={UserIcon} text="Middle Name" />}
                {...register("parent_middle_name")}
                error={errors?.parent_middle_name?.message}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input
                label={<IconLabel Icon={UserIcon} text="Last Name" />}
                {...register("parent_last_name")}
                error={errors?.parent_last_name?.message}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <Input
                label={<IconLabel Icon={PencilSquareIcon} text="Qualification" />}
                {...register("parent_qualification")}
                error={errors?.parent_qualification?.message}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={<IconLabel Icon={BriefcaseIcon} text="Profession" />}
                {...register("parent_profession")}
                error={errors?.parent_profession?.message}
              />
            </div>

            <PhoneField dialName="parent_dialCode" numberName="parent_phone" label="Mobile Number" />

            <div className="col-span-12 md:col-span-6">
              <Input
                label={<IconLabel Icon={EnvelopeIcon} text="Email" />}
                inputMode="email"
                autoComplete="email"
                {...register("parent_email")}
                error={errors?.parent_email?.message}
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function IconLabel({ Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="size-4 text-primary-600 dark:text-primary-400" />
      <span>{text}</span>
    </span>
  );
}
