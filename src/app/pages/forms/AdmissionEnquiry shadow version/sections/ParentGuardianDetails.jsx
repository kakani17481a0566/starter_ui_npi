// src/app/pages/forms/StudentRegistrationForm/sections/ParentGuardianDetails.jsx
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

const smallInput = "h-8 py-1 text-xs";

const IconLabel = ({ Icon, text }) => (
  <span className="inline-flex items-center gap-2">
    <Icon className="size-4 text-primary-600 dark:text-primary-400" />
    <span>{text}</span>
  </span>
);

const Field = ({ name, label, error, register }) => (
  <Input className={smallInput} label={label} {...register(name)} error={error} />
);

export default function ParentGuardianDetails() {
  const { register, control, formState: { errors } } = useFormContext();

  const nameFields = [
    {
      name: "parent_first_name",
      label: <IconLabel Icon={UserIcon} text="First Name" />,
      err: errors?.parent_first_name?.message,
    },
    {
      name: "parent_middle_name",
      label: <IconLabel Icon={UserIcon} text="Middle Name" />,
      err: errors?.parent_middle_name?.message,
    },
    {
      name: "parent_last_name",
      label: <IconLabel Icon={UserIcon} text="Last Name" />,
      err: errors?.parent_last_name?.message,
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-6">
      <SectionCard className="rounded-lg ">
        {/* Header + radios */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
            <h3
              id="relation_type_heading"
              className="text-base font-medium text-gray-800 dark:text-dark-100"
            >
              Father / Guardian Details
            </h3>
          </div>

          <div className="ml-auto shrink-0 whitespace-nowrap">
            <Controller
              name="relation_type"
              control={control}
              render={({ field }) => (
                <div
                  className="flex items-center gap-5"
                  role="radiogroup"
                  aria-labelledby="relation_type_heading"
                >
                  <Radio
                    label="Parent"
                    name={field.name}
                    value="parent"
                    variant="outlined"
                    color="primary"
                    checked={field.value === "parent"}
                    onChange={() => field.onChange("parent")}
                  />
                  <Radio
                    label="Guardian"
                    name={field.name}
                    value="guardian"
                    variant="outlined"
                    color="primary"
                    checked={field.value === "guardian"}
                    onChange={() => field.onChange("guardian")}
                  />
                </div>
              )}
            />
          </div>
        </div>

        {errors?.relation_type && (
          <p className="mt-1 text-xs text-red-500">
            {errors.relation_type.message}
          </p>
        )}

        {/* Body */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* Names */}
          {nameFields.map(({ name, label, err }) => (
            <div key={name} className="col-span-12 md:col-span-4">
              <Field
                name={name}
                label={label}
                error={err}
                register={register}
              />
            </div>
          ))}

          {/* Qualification / Profession */}
          <div className="col-span-12 md:col-span-6">
            <Field
              name="parent_qualification"
              label={<IconLabel Icon={PencilSquareIcon} text="Qualification" />}
              error={errors?.parent_qualification?.message}
              register={register}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Field
              name="parent_profession"
              label={<IconLabel Icon={BriefcaseIcon} text="Profession" />}
              error={errors?.parent_profession?.message}
              register={register}
            />
          </div>

          {/* Contact row: Mobile | Email */}
          <div className="col-span-12 md:col-span-6">
            <PhoneField
              dialName="parent_dialCode"
              numberName="parent_phone"
              label="Mobile Number"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Input
              className={smallInput}
              label={<IconLabel Icon={EnvelopeIcon} text="Email" />}
              inputMode="email"
              autoComplete="email"
              {...register("parent_email")}
              error={errors?.parent_email?.message}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
