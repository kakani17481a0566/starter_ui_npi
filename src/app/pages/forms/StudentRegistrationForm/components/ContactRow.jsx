import {
  HomeIcon,
  BriefcaseIcon,
  HashtagIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Input } from "components/ui";
import LabelWithIcon from "./LabelWithIcon";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";

export default function ContactRow({
  title,
  prefix,
  register,
  errors,
  enableSameAsPrimary = false,
  primaryPrefix = "father",
}) {
  const { setValue, control, watch } = useFormContext();

  const primaryLabel = useMemo(
    () => primaryPrefix.charAt(0).toUpperCase() + primaryPrefix.slice(1),
    [primaryPrefix]
  );

  const sameAsPrimary = watch(`${prefix}_same_as_primary`);

  const FIELD_KEYS = ["first_name", "last_name", "home_phone", "cell_phone", "business_phone"];

  const primaryValues = useWatch({
    control,
    name: FIELD_KEYS.map((field) => `${primaryPrefix}_${field}`),
  });

  // Mirror logic
  useEffect(() => {
    if (!sameAsPrimary) return;

    FIELD_KEYS.forEach((field, idx) => {
      setValue(`${prefix}_${field}`, primaryValues[idx] ?? "", { shouldValidate: true });
    });
  }, [sameAsPrimary, primaryValues, setValue, prefix]);

  const fieldProps = (name) => ({
    ...register(name),
    readOnly: sameAsPrimary, // ✅ use readOnly instead of disabled
    error: errors?.[name]?.message,
  });

  return (
    <div className="col-span-12">
      {/* Header */}
      <div className="mt-6 mb-3 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <UserIcon className="text-primary-600 dark:text-primary-400 size-5" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-dark-100">
            {title}
          </h4>
        </div>

        {enableSameAsPrimary && (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" {...register(`${prefix}_same_as_primary`)} />
            <CheckCircleIcon className="size-4 text-primary-500" />
            <span>Same as {primaryLabel}</span>
          </label>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <Input
            label={<LabelWithIcon icon={UserIcon}>First Name</LabelWithIcon>}
            {...fieldProps(`${prefix}_first_name`)}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <Input
            label={<LabelWithIcon icon={UserIcon}>Last Name</LabelWithIcon>}
            {...fieldProps(`${prefix}_last_name`)}
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <Input
            label={<LabelWithIcon icon={HomeIcon}>Home Phone</LabelWithIcon>}
            inputMode="tel"
            {...fieldProps(`${prefix}_home_phone`)}
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <Input
            label={<LabelWithIcon icon={HashtagIcon}>Cell Phone</LabelWithIcon>}
            inputMode="tel"
            {...fieldProps(`${prefix}_cell_phone`)}
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <Input
            label={<LabelWithIcon icon={BriefcaseIcon}>Business Phone</LabelWithIcon>}
            inputMode="tel"
            {...fieldProps(`${prefix}_business_phone`)}
          />
        </div>
      </div>
    </div>
  );
}
