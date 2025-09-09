// src/app/pages/forms/StudentRegistrationForm/sections/MotherDetails.jsx
import { useFormContext } from "react-hook-form";
import { Input } from "components/ui";
import SectionCard from "../components/SectionCard";
import PhoneField from "../components/PhoneField";
import {
  UserGroupIcon,
  UserIcon,
  PencilSquareIcon,
  BriefcaseIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function MotherDetails() {
  const { register, formState: { errors } } = useFormContext();
  const smallInput = "h-8 py-1 text-xs"; // compact style

  return (
    <div className="col-span-12 lg:col-span-6">
      <SectionCard >
        {/* Header */}
        <div className="flex items-center gap-2">
          <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Mother Details
          </h3>
        </div>

        {/* Content */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* Name Fields */}
          <div className="col-span-12 md:col-span-4">
            <Input
              className={smallInput}
              label={<IconLabel Icon={UserIcon} text="First Name" />}
              {...register("mother_first_name")}
              error={errors?.mother_first_name?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              className={smallInput}
              label={<IconLabel Icon={UserIcon} text="Middle Name" />}
              {...register("mother_middle_name")}
              error={errors?.mother_middle_name?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              className={smallInput}
              label={<IconLabel Icon={UserIcon} text="Last Name" />}
              {...register("mother_last_name")}
              error={errors?.mother_last_name?.message}
            />
          </div>

          {/* Qualification & Profession */}
          <div className="col-span-12 md:col-span-6">
            <Input
              className={smallInput}
              label={<IconLabel Icon={PencilSquareIcon} text="Qualification" />}
              {...register("mother_qualification")}
              error={errors?.mother_qualification?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Input
              className={smallInput}
              label={<IconLabel Icon={BriefcaseIcon} text="Profession" />}
              {...register("mother_profession")}
              error={errors?.mother_profession?.message}
            />
          </div>

          {/* Contact row: Mobile + Email side by side */}
          <div className="col-span-12 md:col-span-6">
            <PhoneField
              dialName="mother_dialCode"
              numberName="mother_phone"
              label="Mobile Number"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Input
              className={smallInput}
              label={<IconLabel Icon={EnvelopeIcon} text="Email" />}
              inputMode="email"
              autoComplete="email"
              {...register("mother_email")}
              error={errors?.mother_email?.message}
            />
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
