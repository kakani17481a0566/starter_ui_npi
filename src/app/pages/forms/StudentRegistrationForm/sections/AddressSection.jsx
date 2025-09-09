import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Card, Input, Checkbox } from "components/ui";
import {
  HomeIcon,
  UserGroupIcon,
  MapPinIcon,
  GlobeAltIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";

const f = (prefix, name) => (prefix ? `${prefix}${name}` : name);

function AddressGroup({ title, prefix = "", syncWithPrimary = false }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const primaryValues = watch([
    "pg_names",
    "home_apt",
    "home_street",
    "mailing_city",
    "mailing_postal",
    "civic_city",
    "civic_postal",
    "civic_house",
    "civic_po_box",
  ]);

  const sameAsPrimaryName = f(prefix, "same_as_primary");
  const sameAsPrimaryChecked = watch(sameAsPrimaryName);

  // keep alt fields synced when checkbox is ON
  useEffect(() => {
    if (!syncWithPrimary || !sameAsPrimaryChecked) return;
    const [
      pg_names,
      home_apt,
      home_street,
      mailing_city,
      mailing_postal,
      civic_city,
      civic_postal,
      civic_house,
      civic_po_box,
    ] = primaryValues;

    setValue(f(prefix, "pg_names"), pg_names ?? "");
    setValue(f(prefix, "home_apt"), home_apt ?? "");
    setValue(f(prefix, "home_street"), home_street ?? "");
    setValue(f(prefix, "mailing_city"), mailing_city ?? "");
    setValue(f(prefix, "mailing_postal"), (mailing_postal || "").toString().toUpperCase());
    setValue(f(prefix, "civic_city"), civic_city ?? "");
    setValue(f(prefix, "civic_postal"), (civic_postal || "").toString().toUpperCase());
    setValue(f(prefix, "civic_house"), civic_house ?? "");
    setValue(f(prefix, "civic_po_box"), civic_po_box ?? "");
  }, [sameAsPrimaryChecked, primaryValues, prefix, setValue, syncWithPrimary]);

  const handlePostalBlur = (fieldName) => (e) => {
    const val = (e.target.value || "").toString().trim().toUpperCase();
    setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Card className="p-4 sm:px-5">
      <div className="flex items-center gap-2">
        <HomeIcon className="text-primary-600 dark:text-primary-400 size-5" />
        <h3 className="text-base font-medium">{title}</h3>
      </div>

      {syncWithPrimary && (
        <div className="mt-3">
          <Checkbox
            {...register(sameAsPrimaryName)}
            label="Same as Primary Address"
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <Input
            label={<LabelWithIcon icon={UserGroupIcon}>Parent/Guardian – Name(s)</LabelWithIcon>}
            {...register(f(prefix, "pg_names"))}
            error={errors?.[f(prefix, "pg_names")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <Input
            label={<LabelWithIcon icon={HomeIcon}>Apt</LabelWithIcon>}
            {...register(f(prefix, "home_apt"))}
            error={errors?.[f(prefix, "home_apt")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>

        <div className="col-span-12 md:col-span-9">
          <Input
            label={<LabelWithIcon icon={MapPinIcon}>Street/Road</LabelWithIcon>}
            {...register(f(prefix, "home_street"))}
            error={errors?.[f(prefix, "home_street")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input
            label={<LabelWithIcon icon={GlobeAltIcon}>City (mailing)</LabelWithIcon>}
            {...register(f(prefix, "mailing_city"))}
            error={errors?.[f(prefix, "mailing_city")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Input
            label={<LabelWithIcon icon={HashtagIcon}>Postal Code </LabelWithIcon>}
            {...register(f(prefix, "mailing_postal"))}
            onBlur={handlePostalBlur(f(prefix, "mailing_postal"))}
            error={errors?.[f(prefix, "mailing_postal")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input
            label={<LabelWithIcon icon={GlobeAltIcon}>City (civic)</LabelWithIcon>}
            {...register(f(prefix, "civic_city"))}
            error={errors?.[f(prefix, "civic_city")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Input   className="h-8 py-1 text-xs"
            label={<LabelWithIcon icon={HashtagIcon}>Postal Code (civic)</LabelWithIcon>}
            {...register(f(prefix, "civic_postal"))}
            onBlur={handlePostalBlur(f(prefix, "civic_postal"))}
            error={errors?.[f(prefix, "civic_postal")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input   className="h-8 py-1 text-xs"
            label={<LabelWithIcon icon={HomeIcon}>House</LabelWithIcon>}
            {...register(f(prefix, "civic_house"))}
            error={errors?.[f(prefix, "civic_house")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>
        <div className="col-span-12 md:col-span-4 h-8 py-1 text-xs">
          <Input  className="h-8 py-1 text-xs"
            label={<LabelWithIcon icon={HomeIcon}>PO Box</LabelWithIcon>}
            {...register(f(prefix, "civic_po_box"))}
            error={errors?.[f(prefix, "civic_po_box")]?.message}
            disabled={syncWithPrimary && sameAsPrimaryChecked}
          />
        </div>
      </div>
    </Card>
  );
}

export default function AddressSection() {
  return (
    <>
      <AddressGroup
        title="Demographics — Home Address (Civic + Mailing)"
        prefix="" // primary group
        syncWithPrimary={false}
      />
      <AddressGroup
        title="Demographics — Alternate Home Address (Shared Custody) — Civic + Mailing"
        prefix="alt_" // alternate group
        syncWithPrimary={true}
      />
    </>
  );
}
