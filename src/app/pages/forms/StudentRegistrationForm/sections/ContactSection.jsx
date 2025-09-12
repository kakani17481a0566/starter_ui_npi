// src/app/pages/forms/StudentRegistrationForm/sections/ContactSection.jsx
import { useMemo, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea, Checkbox } from "components/ui";
import {
  EnvelopeIcon,
  MegaphoneIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  InboxIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import SectionCard from "../components/SectionCard";
import LabelWithIcon from "../components/LabelWithIcon";
import RHFInput from "../components/RHFInput";
import { useContactMirror } from "../components/useContactMirror";

export default function ContactSection() {
  const { control, register, setValue, watch } = useFormContext();

  const CONTACT_GROUPS = useMemo(
    () => [
      { title: "Father", prefix: "father" },
      { title: "Mother", prefix: "mother", enableSameAsPrimary: true },
      { title: "Guardian", prefix: "guardian", enableSameAsPrimary: true },
      { title: "After school", prefix: "after_school", enableSameAsPrimary: true },
      { title: "Early Closure", prefix: "ec", enableSameAsPrimary: true },
      { title: "Emergency", prefix: "emergency", enableSameAsPrimary: true },
    ],
    []
  );

  const FIELDS = [
    { key: "first_name", label: "First Name", icon: UserIcon },
    { key: "last_name", label: "Last Name", icon: UserIcon },
    { key: "phone", label: "Phone", icon: DevicePhoneMobileIcon },
    { key: "alt_phone", label: "Alt. Phone", icon: DevicePhoneMobileIcon },
    { key: "email", label: "Email", icon: InboxIcon },
  ];
  const fieldFor = (p, n) => `${p}_${n}`;

  const { isSameByPrefix, onFatherBlur } = useContactMirror({
    groups: CONTACT_GROUPS,
    fields: FIELDS.map((f) => f.key),
  });

  // NEW: single global control to mirror all contacts from Father
  const MIRROR_ALL_FIELD = "contacts_mirror_all";
  const mirrorAll = watch(MIRROR_ALL_FIELD);

  // Keep per-group *_same_as_father fields in sync (for useContactMirror internals)
  useEffect(() => {
    CONTACT_GROUPS.forEach(({ prefix }) => {
      if (prefix === "father") return;
      setValue(fieldFor(prefix, "same_as_father"), !!mirrorAll, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });
  }, [mirrorAll, setValue, CONTACT_GROUPS]);

  const isDisabled = (prefix) =>
    prefix !== "father" && (mirrorAll || isSameByPrefix[prefix]);

  return (
    <SectionCard
      title="Demographics — Contact Information"
      icon={UserIcon}
      variant="outlined"
      elevation={1}
      padding="md"
      actions={
        <Controller
          control={control}
          name={MIRROR_ALL_FIELD}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox {...field} variant="outlined" color="primary" />
              <span className="text-xs text-gray-700 dark:text-dark-100">
                Mirror all from Father
              </span>
            </div>
          )}
        />
      }
    >
      {/* Desktop Table */}
      <div className="mt-2 hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-primary-600 text-left text-sm text-white dark:bg-primary-700">
                <th className="px-3 py-2">Contact</th>
                {FIELDS.map(({ key, label, icon: Icon }) => (
                  <th key={key} className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Icon className="size-4 text-white" />
                      {label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTACT_GROUPS.map(({ title, prefix }) => {
                const father = prefix === "father";
                const disabled = isDisabled(prefix);
                const mirrored = !father && (mirrorAll || isSameByPrefix[prefix]);

                return (
                  <tr key={prefix} className="align-top">
                    <td className="px-3 py-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <span>{title}</span>
                        {mirrored && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-100">
                            <CheckCircleIcon className="size-3" />
                            Mirrored
                          </span>
                        )}
                      </div>
                    </td>

                    {FIELDS.map(({ key }) => (
                      <td key={key} className="px-3 py-2">
                        <RHFInput
                          name={fieldFor(prefix, key)}
                          label={null} // no inline label inside table
                          inputMode={
                            key.includes("phone") ? "tel" : key === "email" ? "email" : undefined
                          }
                          autoComplete={key === "email" ? "email" : undefined}
                          disabled={disabled}
                          onBlur={father ? onFatherBlur : undefined}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Layout (Card format) */}
      <div className="mt-4 space-y-6 md:hidden">
        {CONTACT_GROUPS.map(({ title, prefix }) => {
          const father = prefix === "father";
          const disabled = isDisabled(prefix);
          const mirrored = !father && (mirrorAll || isSameByPrefix[prefix]);

          return (
            <SectionCard
              key={prefix}
              title={title}
              variant="outlined"
              elevation={0}
              padding="md"
              actions={
                mirrored ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-100">
                    <CheckCircleIcon className="size-3" />
                    Mirrored
                  </span>
                ) : null
              }
            >
              {FIELDS.map(({ key, label, icon: Icon }) => (
                <div key={key} className="mb-3">
                  <RHFInput
                    name={fieldFor(prefix, key)}
                    label={<LabelWithIcon icon={Icon}>{label}</LabelWithIcon>}
                    inputMode={
                      key.includes("phone") ? "tel" : key === "email" ? "email" : undefined
                    }
                    autoComplete={key === "email" ? "email" : undefined}
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
              ))}
            </SectionCard>
          );
        })}
      </div>

      {/* Notes + Communication Email */}
      <fieldset className="mt-5 grid grid-cols-12 gap-4">
        <legend className="sr-only">Other contact information</legend>

        <div className="col-span-12">
          <Textarea className="h-8 py-1 text-xs"
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Other contact information the school should be aware of (if any)
              </LabelWithIcon>
            }
            {...register("other_contact_info")}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <RHFInput
            name="parent_comm_email"
            label={
              <LabelWithIcon icon={EnvelopeIcon}>
                Parent E-mail to communicate
              </LabelWithIcon>
            }
            inputMode="email"
            autoComplete="email"
          />
        </div>
      </fieldset>
    </SectionCard>
  );
}
