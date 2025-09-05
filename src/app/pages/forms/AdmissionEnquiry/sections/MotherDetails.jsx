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

  return (
    <div className="col-span-12 lg:col-span-6">
      <SectionCard>
        <div className="flex items-center gap-2">
          <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Mother Details
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* Name Fields */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label={<IconLabel Icon={UserIcon} text="First Name" />}
              {...register("mother_first_name")}
              error={errors?.mother_first_name?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              label={<IconLabel Icon={UserIcon} text="Middle Name" />}
              {...register("mother_middle_name")}
              error={errors?.mother_middle_name?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              label={<IconLabel Icon={UserIcon} text="Last Name" />}
              {...register("mother_last_name")}
              error={errors?.mother_last_name?.message}
            />
          </div>

          {/* Qualification & Profession */}
          <div className="col-span-12 md:col-span-6">
            <Input
              label={<IconLabel Icon={PencilSquareIcon} text="Qualification" />}
              {...register("mother_qualification")}
              error={errors?.mother_qualification?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Input
              label={<IconLabel Icon={BriefcaseIcon} text="Profession" />}
              {...register("mother_profession")}
              error={errors?.mother_profession?.message}
            />
          </div>

          {/* Phone */}
          <PhoneField
            dialName="mother_dialCode"
            numberName="mother_phone"
            label="Mobile Number"
          />

          {/* Email */}
          <div className="col-span-12 md:col-span-6">
            <Input
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
