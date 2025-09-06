// src/app/pages/forms/StudentRegistrationForm/sections/ContactSection.jsx
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Card, Textarea } from "components/ui";
import { EnvelopeIcon, MegaphoneIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";
import RHFInput from "../components/RHFInput";
import { useContactMirror } from "../components/useContactMirror";

export default function ContactSection() {
  const { register } = useFormContext();

  // config
  const CONTACT_GROUPS = useMemo(() => ([
    { title: "Father", prefix: "father" }, // primary (always editable)
    { title: "Mother", prefix: "mother", enableSameAsPrimary: true },
    { title: "Guardian", prefix: "guardian", enableSameAsPrimary: true },
    { title: "After school", prefix: "after_school", enableSameAsPrimary: true },
    { title: "Early Closure", prefix: "ec", enableSameAsPrimary: true },
    { title: "Emergency", prefix: "emergency", enableSameAsPrimary: true },
  ]), []);

  const FIELDS = ["first_name", "last_name", "phone", "alt_phone", "email"];
  const fieldFor = (p, n) => `${p}_${n}`;

  const { isSameByPrefix, onFatherBlur } = useContactMirror({
    groups: CONTACT_GROUPS,
    fields: FIELDS,
  });

  const isDisabled = (prefix, enableSame) =>
    prefix !== "father" && enableSame && isSameByPrefix[prefix];

  return (
    <Card className="p-4 sm:px-5">
      <div className="flex items-center gap-2">
        <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-base font-medium">Demographics — Contact Information</h3>
      </div>

      {/* Desktop: table */}
      <div className="mt-4 hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-dark-200">
                <th className="px-3 py-2">Contact</th>
                <th className="w-[16%] px-3 py-2">First Name</th>
                <th className="w-[16%] px-3 py-2">Last Name</th>
                <th className="w-[16%] px-3 py-2">Phone</th>
                <th className="w-[16%] px-3 py-2">Alt. Phone</th>
                <th className="w-[22%] px-3 py-2">Email</th>
                <th className="w-[14%] px-3 py-2">Same as Father</th>
              </tr>
            </thead>
            <tbody>
              {CONTACT_GROUPS.map(({ title, prefix, enableSameAsPrimary }) => {
                const father = prefix === "father";
                const disabled = isDisabled(prefix, enableSameAsPrimary);

                return (
                  <tr key={prefix} className="align-top">
                    <td className="px-3 py-2">
                      <div className="text-sm font-medium">{title}</div>
                    </td>

                    <td className="px-3 py-2">
                      <RHFInput
                        name={fieldFor(prefix, "first_name")}
                        placeholder="First name"
                        disabled={disabled}
                        onBlur={father ? onFatherBlur : undefined}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <RHFInput
                        name={fieldFor(prefix, "last_name")}
                        placeholder="Last name"
                        disabled={disabled}
                        onBlur={father ? onFatherBlur : undefined}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <RHFInput
                        name={fieldFor(prefix, "phone")}
                        placeholder="Phone"
                        inputMode="tel"
                        disabled={disabled}
                        onBlur={father ? onFatherBlur : undefined}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <RHFInput
                        name={fieldFor(prefix, "alt_phone")}
                        placeholder="Alt. phone"
                        inputMode="tel"
                        disabled={disabled}
                        onBlur={father ? onFatherBlur : undefined}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <RHFInput
                        name={fieldFor(prefix, "email")}
                        placeholder="Email"
                        inputMode="email"
                        autoComplete="email"
                        disabled={disabled}
                        onBlur={father ? onFatherBlur : undefined}
                      />
                    </td>

                    <td className="px-3 py-2">
                      {enableSameAsPrimary ? (
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            {...register(fieldFor(prefix, "same_as_father"))}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span>Same as Father</span>
                        </label>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="mt-4 space-y-4 md:hidden">
        {CONTACT_GROUPS.map(({ title, prefix, enableSameAsPrimary }) => {
          const father = prefix === "father";
          const disabled = isDisabled(prefix, enableSameAsPrimary);
          return (
            <div key={prefix} className="rounded-lg border p-3 dark:border-dark-600">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">{title}</div>
                {enableSameAsPrimary ? (
                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      {...register(fieldFor(prefix, "same_as_father"))}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Same as Father</span>
                  </label>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>

              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 sm:col-span-6">
                  <RHFInput
                    name={fieldFor(prefix, "first_name")}
                    label="First name"
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <RHFInput
                    name={fieldFor(prefix, "last_name")}
                    label="Last name"
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <RHFInput
                    name={fieldFor(prefix, "phone")}
                    label="Phone"
                    inputMode="tel"
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <RHFInput
                    name={fieldFor(prefix, "alt_phone")}
                    label="Alt. phone"
                    inputMode="tel"
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
                <div className="col-span-12">
                  <RHFInput
                    name={fieldFor(prefix, "email")}
                    label="Email"
                    inputMode="email"
                    autoComplete="email"
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes + comms email */}
      <fieldset className="mt-5 grid grid-cols-12 gap-4">
        <legend className="sr-only">Other contact information</legend>

        <div className="col-span-12">
          <Textarea
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
            label={<LabelWithIcon icon={EnvelopeIcon}>Parent E-mail to communicate</LabelWithIcon>}
            inputMode="email"
            autoComplete="email"
          />
        </div>
      </fieldset>
    </Card>
  );
}
