// src/app/pages/forms/StudentRegistrationForm/sections/AddressSection.jsx
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Card, Input, Checkbox, Radio } from "components/ui";
import {
  HomeIcon, UserGroupIcon, MapPinIcon, GlobeAltIcon, HashtagIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";
import clsx from "clsx";

const f = (p, n) => (p ? `${p}${n}` : n);
const COMPACT = "h-8 py-1 text-xs";

function AddressGroup({ title, prefix = "", syncWithPrimary = false, showRole = false }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  // primary values for mirroring
  const primaryVals = watch([
    "pg_names","home_apt","home_street",
    "mailing_city","mailing_postal",
    "civic_city","civic_postal",
    "civic_house","civic_po_box",
  ]);

  const sameAsName = f(prefix, "same_as_primary");
  const sameAs = watch(sameAsName);

  // optional toggle to show PO Box
  const usePOBoxName = f(prefix, "use_po_box");
  const usePOBox = watch(usePOBoxName);

  // NEW: Parent/Guardian role (only rendered if showRole)
  const roleName = f(prefix, "pg_role");

  // mirror when checked
  useEffect(() => {
    if (!syncWithPrimary || !sameAs) return;
    const [
      pg_names, home_apt, home_street,
      mailing_city, mailing_postal,
      civic_city, civic_postal,
      civic_house, civic_po_box,
    ] = primaryVals;

    setValue(f(prefix, "pg_names"), pg_names ?? "");
    setValue(f(prefix, "home_apt"), home_apt ?? "");
    setValue(f(prefix, "home_street"), home_street ?? "");
    setValue(f(prefix, "mailing_city"), mailing_city ?? "");
    setValue(f(prefix, "mailing_postal"), (mailing_postal || "").toString().toUpperCase());
    setValue(f(prefix, "civic_city"), civic_city ?? "");
    setValue(f(prefix, "civic_postal"), (civic_postal || "").toString().toUpperCase());
    setValue(f(prefix, "civic_house"), civic_house ?? "");
    setValue(f(prefix, "civic_po_box"), civic_po_box ?? "");
  }, [sameAs, primaryVals, prefix, setValue, syncWithPrimary]);

  // formatters
  const setUpper = (name) => (e) =>
    setValue(name, (e.target.value || "").toString().trim().toUpperCase(), {
      shouldDirty: true,
      shouldValidate: true,
    });

  // disabled overlay style when mirrored
  const fieldsetCls = clsx(!sameAs ? "" : "opacity-60 pointer-events-none");

  return (
    <Card className="p-3 sm:p-4">
      {/* Header with right-side Parent/Guardian radios when showRole */}
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HomeIcon className="size-4 text-primary-600 dark:text-primary-400" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        {showRole && (
          <div className="flex items-center gap-4 text-xs">
            <Radio value="parent" label="Parent" {...register(roleName)} />
            <Radio value="guardian" label="Guardian" {...register(roleName)} />
          </div>
        )}
      </div>

      {syncWithPrimary && (
        <div className="mb-2 flex items-center justify-between">
          <Checkbox {...register(sameAsName)} label="Same as Primary Address" />
          <Checkbox {...register(usePOBoxName)} label="Use PO Box" />
        </div>
      )}

      {/* Disable all inputs when same-as is on */}
      <fieldset disabled={!!sameAs} className={fieldsetCls}>
        <div className="grid grid-cols-12 gap-2">
          {/* Row 1: Name(4) | Apt(2) | Street(6) */}
          <div className="col-span-12 md:col-span-4">
            <Input
              className={COMPACT}
              autoComplete="name"
              label={<LabelWithIcon icon={UserGroupIcon}>Parent/Guardian – Name(s)</LabelWithIcon>}
              {...register(f(prefix, "pg_names"))}
              error={errors?.[f(prefix, "pg_names")]?.message}
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <Input
              className={COMPACT}
              autoComplete="address-line2"
              label={<LabelWithIcon icon={HomeIcon}>Apt</LabelWithIcon>}
              {...register(f(prefix, "home_apt"))}
              error={errors?.[f(prefix, "home_apt")]?.message}
              maxLength={10}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Input
              className={COMPACT}
              autoComplete="address-line1"
              label={<LabelWithIcon icon={MapPinIcon}>Street</LabelWithIcon>}
              {...register(f(prefix, "home_street"))}
              error={errors?.[f(prefix, "home_street")]?.message}
            />
          </div>

          {/* Row 2: Mailing City(3) | Mailing Postal(2) | Civic City(3) | Civic Postal(2) | House(2) */}
          <div className="col-span-12 md:col-span-3">
            <Input
              className={COMPACT}
              autoComplete="address-level2"
              label={<LabelWithIcon icon={GlobeAltIcon}>City (mailing)</LabelWithIcon>}
              {...register(f(prefix, "mailing_city"))}
              error={errors?.[f(prefix, "mailing_city")]?.message}
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <Input
              className={COMPACT}
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
              label={<LabelWithIcon icon={HashtagIcon}>Postal</LabelWithIcon>}
              {...register(f(prefix, "mailing_postal"))}
              onChange={setUpper(f(prefix, "mailing_postal"))}
              error={errors?.[f(prefix, "mailing_postal")]?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Input
              className={COMPACT}
              autoComplete="address-level2"
              label={<LabelWithIcon icon={GlobeAltIcon}>City (civic)</LabelWithIcon>}
              {...register(f(prefix, "civic_city"))}
              error={errors?.[f(prefix, "civic_city")]?.message}
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <Input
              className={COMPACT}
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
              label={<LabelWithIcon icon={HashtagIcon}>Postal (civic)</LabelWithIcon>}
              {...register(f(prefix, "civic_postal"))}
              onChange={setUpper(f(prefix, "civic_postal"))}
              error={errors?.[f(prefix, "civic_postal")]?.message}
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <Input
              className={COMPACT}
              label={<LabelWithIcon icon={HomeIcon}>House</LabelWithIcon>}
              {...register(f(prefix, "civic_house"))}
              error={errors?.[f(prefix, "civic_house")]?.message}
              maxLength={10}
            />
          </div>

          {/* Optional PO Box (hidden unless toggled) */}
          {usePOBox && (
            <div className="col-span-6 md:col-span-3">
              <Input
                className={COMPACT}
                label={<LabelWithIcon icon={HomeIcon}>PO Box</LabelWithIcon>}
                {...register(f(prefix, "civic_po_box"))}
                error={errors?.[f(prefix, "civic_po_box")]?.message}
                maxLength={12}
              />
            </div>
          )}
        </div>
      </fieldset>
    </Card>
  );
}

export default function AddressSection() {
  return (
    <>
      <AddressGroup
        title="Demographics — Home Address (Civic + Mailing)"
        prefix=""
        syncWithPrimary={false}
        showRole={true}   // <- Parent/Guardian radio on the right
      />
      <AddressGroup
        title="Demographics — Alternate Home Address (Shared Custody)"
        prefix="alt_"
        syncWithPrimary={true}
      />
      <AddressGroup
        title="Demographics — Early Closure Address"
        prefix="ec_"
        syncWithPrimary={true}
      />
    </>
  );
}
