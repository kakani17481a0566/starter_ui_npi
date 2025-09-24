// src/app/pages/forms/StudentRegistrationForm/sections/ContactSection.jsx
import { useMemo, useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Textarea, Checkbox } from "components/ui";
import {
  EnvelopeIcon,
  MegaphoneIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import SectionCard from "../components/SectionCard";
import LabelWithIcon from "../components/LabelWithIcon";
import RHFInput from "../components/RHFInput";

export default function ContactSection() {
  const { control, register, setValue, getValues, watch } = useFormContext();

  // 🔹 Relationship IDs from masters table
  const CONTACT_GROUPS = useMemo(
    () => [
      { title: "Father", prefix: "father", relationshipId: 209 },
      { title: "Mother", prefix: "mother", relationshipId: 210 },
      { title: "Guardian", prefix: "guardian", relationshipId: 211 },
      { title: "After school", prefix: "after_school", relationshipId: 212 },
      { title: "Emergency", prefix: "emergency", relationshipId: 213 },
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

  // 🔹 Watch Father’s values
  const fatherValues = useWatch({
    control,
    name: FIELDS.map((f) => `father_${f.key}`),
  });

  // 🔹 Mirror Father → Others when active
  useEffect(() => {
    CONTACT_GROUPS.forEach(({ prefix }) => {
      if (prefix === "father") return;
      const active = getValues(`${prefix}_active`);
      if (active) {
        FIELDS.forEach((f, idx) => {
          setValue(`${prefix}_${f.key}`, fatherValues[idx] || "");
        });
      }
    });
  }, [fatherValues, CONTACT_GROUPS, FIELDS, getValues, setValue]);

  return (
    <SectionCard
      title="Demographics — Contact Information"
      icon={UserIcon}
      variant="outlined"
      elevation={1}
      padding="md"
    >
      {/* Table layout for desktop */}
      <div className="mt-2 hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-primary-600 text-left text-sm text-white dark:bg-primary-700">
                <th className="px-3 py-2">Include</th>
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
                const isFather = prefix === "father";
                const isActive = watch(`${prefix}_active`);
                return (
                  <tr key={prefix} className="align-top">
                    <td className="px-3 py-2">
                      <Controller
                        control={control}
                        name={fieldFor(prefix, "active")}
                        render={({ field }) => (
                          <Checkbox {...field} color="primary" variant="outlined" />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2 text-sm font-medium">{title}</td>
                    {FIELDS.map(({ key }) => (
                      <td key={key} className="px-3 py-2">
                        <RHFInput
                          name={fieldFor(prefix, key)}
                          label={null}
                          inputMode={
                            key.includes("phone")
                              ? "tel"
                              : key === "email"
                              ? "email"
                              : undefined
                          }
                          autoComplete={key === "email" ? "email" : undefined}
                          disabled={!isFather && isActive}
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

      {/* Mobile layout */}
      <div className="mt-4 space-y-6 md:hidden">
        {CONTACT_GROUPS.map(({ title, prefix }) => {
          const isFather = prefix === "father";
          const isActive = watch(`${prefix}_active`);
          return (
            <SectionCard
              key={prefix}
              title={title}
              variant="outlined"
              elevation={0}
              padding="md"
              actions={
                <Controller
                  control={control}
                  name={fieldFor(prefix, "active")}
                  render={({ field }) => (
                    <Checkbox {...field} color="primary" variant="outlined" />
                  )}
                />
              }
            >
              {FIELDS.map(({ key, label, icon: Icon }) => (
                <div key={key} className="mb-3">
                  <RHFInput
                    name={fieldFor(prefix, key)}
                    label={<LabelWithIcon icon={Icon}>{label}</LabelWithIcon>}
                    inputMode={
                      key.includes("phone")
                        ? "tel"
                        : key === "email"
                        ? "email"
                        : undefined
                    }
                    autoComplete={key === "email" ? "email" : undefined}
                    disabled={!isFather && isActive}
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
          <Textarea
            className="h-8 py-1 text-xs"
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

// 🔹 Helper: build contacts payload for API
export function buildContactsPayload(getValues, groups) {
  return groups
    .map(({ prefix, relationshipId }) => {
      const active = getValues(`${prefix}_active`);
      if (!active) return null; // skip inactive rows
      return {
        Name: getValues(`${prefix}_first_name`),
        PriNumber: getValues(`${prefix}_phone`),
        SecNumber: getValues(`${prefix}_alt_phone`),
        Email: getValues(`${prefix}_email`),
        Address1: "",
        City: "",
        State: "",
        Pincode: "",
        RelationshipId: relationshipId,
      };
    })
    .filter(Boolean);
}
