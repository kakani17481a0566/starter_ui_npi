import { Card, Textarea, Input } from "components/ui";
import {
  EnvelopeIcon,
  MegaphoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useFormContext } from "react-hook-form";
import LabelWithIcon from "../components/LabelWithIcon";
import ContactRow from "../components/ContactRow";

export default function ContactSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const contactGroups = [
    { title: "Father", prefix: "father" }, // Primary Contact
    { title: "Mother", prefix: "mother", enableSameAsPrimary: true },
    { title: "Guardian", prefix: "guardian", enableSameAsPrimary: true },
    { title: "After school", prefix: "after_school", enableSameAsPrimary: true },
    { title: "Early Closure", prefix: "ec", enableSameAsPrimary: true },
    { title: "Emergency", prefix: "emergency", enableSameAsPrimary: true },
  ];

  return (
    <Card className="p-4 sm:px-5">
      <div className="flex items-center gap-2">
        <UserGroupIcon className="text-primary-600 dark:text-primary-400 size-5" />
        <h3 className="text-base font-medium">Demographics — Contact Information</h3>
      </div>

      <fieldset className="mt-4 grid grid-cols-12 gap-4">
        <legend className="sr-only">Contact Information</legend>

        {contactGroups.map(({ title, prefix, enableSameAsPrimary }) => (
          <ContactRow
            key={prefix}
            title={title}
            prefix={prefix}
            register={register}
            errors={errors}
            enableSameAsPrimary={enableSameAsPrimary}
            primaryPrefix="father"
          />
        ))}

        <div className="col-span-12">
          <Textarea
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Other contact information the school should be aware of (if any)
              </LabelWithIcon>
            }
            {...register("other_contact_info")}
            error={errors?.other_contact_info?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <Input
            label={
              <LabelWithIcon icon={EnvelopeIcon}>
                Parent E-mail to communicate
              </LabelWithIcon>
            }
            inputMode="email"
            autoComplete="email"
            {...register("parent_comm_email")}
            error={errors?.parent_comm_email?.message}
          />
        </div>
      </fieldset>
    </Card>
  );
}
