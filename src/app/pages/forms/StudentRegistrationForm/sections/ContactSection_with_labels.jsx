import { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Card, Textarea, Checkbox } from "components/ui";
import {
  EnvelopeIcon,
  MegaphoneIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  InboxIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";
import RHFInput from "../components/RHFInput";
import { useContactMirror } from "../components/useContactMirror";

export default function ContactSection() {
  const { control, register } = useFormContext();

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
      {/* Header */}
      <div className="flex items-center gap-2">
        <UserIcon className="size-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-base font-medium">Demographics — Contact Information</h3>
      </div>

      {/* Desktop Table */}
      <div className="mt-4 hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-sm text-white bg-primary-600 dark:bg-primary-700">
                <th className="px-3 py-2">Contact</th>
                <th className="w-[16%] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <UserIcon className="size-4 text-white" />
                    First Name
                  </div>
                </th>
                <th className="w-[16%] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <UserIcon className="size-4 text-white" />
                    Last Name
                  </div>
                </th>
                <th className="w-[16%] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <DevicePhoneMobileIcon className="size-4 text-white" />
                    Phone
                  </div>
                </th>
                <th className="w-[16%] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <DevicePhoneMobileIcon className="size-4 text-white" />
                    Alt. Phone
                  </div>
                </th>
                <th className="w-[22%] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <InboxIcon className="size-4 text-white" />
                    Email
                  </div>
                </th>
                <th className="w-[14%] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <CheckCircleIcon className="size-4 text-white" />
                    Same as Father
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {CONTACT_GROUPS.map(({ title, prefix, enableSameAsPrimary }) => {
                const father = prefix === "father";
                const disabled = isDisabled(prefix, enableSameAsPrimary);

                return (
                  <tr key={prefix} className="align-top">
                    <td className="px-3 py-2 text-sm font-medium">{title}</td>

                    {FIELDS.map((field) => (
                      <td key={field} className="px-3 py-2">
                        <RHFInput
                          name={fieldFor(prefix, field)}
                          placeholder={field.replace("_", " ")}
                          inputMode={field.includes("phone") ? "tel" : field === "email" ? "email" : undefined}
                          autoComplete={field === "email" ? "email" : undefined}
                          disabled={disabled}
                          onBlur={father ? onFatherBlur : undefined}
                        />
                      </td>
                    ))}

                    <td className="px-3 py-2">
                      {enableSameAsPrimary ? (
                        <Controller
                          control={control}
                          name={fieldFor(prefix, "same_as_father")}
                          render={({ field }) => (
                            <div className="flex justify-center items-center h-full">
                              <Checkbox
                                {...field}
                                variant="outlined"
                                color="primary"
                                label=""
                                className="h-5 w-5"
                              />
                            </div>
                          )}
                        />
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <span className="text-xs text-gray-400">—</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Layout (Card format) */}
      <div className="mt-4 space-y-6 md:hidden">
        {CONTACT_GROUPS.map(({ title, prefix, enableSameAsPrimary }) => {
          const father = prefix === "father";
          const disabled = isDisabled(prefix, enableSameAsPrimary);

          return (
            <Card key={prefix} className="p-4 border border-gray-200 rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>

              {FIELDS.map((field) => (
                <div key={field} className="mb-3">
                  <RHFInput
                    name={fieldFor(prefix, field)}
                    placeholder={field.replace("_", " ")}
                    inputMode={field.includes("phone") ? "tel" : field === "email" ? "email" : undefined}
                    autoComplete={field === "email" ? "email" : undefined}
                    disabled={disabled}
                    onBlur={father ? onFatherBlur : undefined}
                  />
                </div>
              ))}

              {enableSameAsPrimary && (
                <Controller
                  control={control}
                  name={fieldFor(prefix, "same_as_father")}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox {...field} variant="outlined" color="primary" />
                      <span className="text-sm text-gray-700">Same as Father</span>
                    </div>
                  )}
                />
              )}
            </Card>
          );
        })}
      </div>

      {/* Notes + Communication Email */}
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
    </Card>
  );
}
