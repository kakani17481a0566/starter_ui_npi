// src/app/pages/forms/StudentRegistrationForm/sections/AddressSection.jsx

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Checkbox, Radio, Card } from "components/ui";
import {
  HomeIcon,
  UserGroupIcon,
  MapPinIcon,
  GlobeAltIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";
import SectionCard from "../components/SectionCard";
import clsx from "clsx";
import { fetchCustodyOptions, fetchLivesWithOptions } from "../dropdown"; // ✅ added

const f = (p, n) => (p ? `${p}${n}` : n);
const COMPACT = "h-8 py-1 text-xs";

function AddressGroup({ title, prefix = "", syncWithPrimary = false, showRole = false }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  // primary values for mirroring
  const primaryVals = watch([
    "pg_names", "home_apt", "home_street",
    "mailing_city", "mailing_postal",
    "civic_city", "civic_postal",
    "civic_house", "civic_po_box",
  ]);

  const sameAsName = f(prefix, "same_as_primary");
  const sameAs = watch(sameAsName);

  const usePOBoxName = f(prefix, "use_po_box");
  const usePOBox = watch(usePOBoxName);

  const roleName = f(prefix, "pg_role");

  // Mirror fields when "Same as Primary" is checked
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

  const fieldsetCls = clsx(!sameAs ? "" : "opacity-60 pointer-events-none");

  return (
    <SectionCard
      title={title}
      icon={HomeIcon}
      variant="outlined"
      elevation={1}
      padding="md"
      actions={
        showRole ? (
          <div className="flex items-center gap-4 text-xs">
            <Radio value="parent" label="Parent" {...register(roleName)} />
            <Radio value="guardian" label="Guardian" {...register(roleName)} />
          </div>
        ) : null
      }
    >
      {syncWithPrimary && (
        <div className="mb-2 flex items-center justify-between">
          <Checkbox {...register(sameAsName)} label="Same as Primary Address" />
          <Checkbox {...register(usePOBoxName)} label="Use PO Box" />
        </div>
      )}

      <fieldset disabled={!!sameAs} className={fieldsetCls}>
        <div className="grid grid-cols-12 gap-2">
          {/* Row 1: Name | Apt | Street */}
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

          {/* Row 2: Mailing + Civic */}
          <div className="col-span-12 md:col-span-3">
            <Input
              className={COMPACT}
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

          {/* Optional PO Box */}
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
    </SectionCard>
  );
}

export default function AddressSection({ tenantId = 1 }) {
  const { register, formState: { errors } } = useFormContext();
  const [custodyOptions, setCustodyOptions] = useState([]);
  const [livesWithOptions, setLivesWithOptions] = useState([]); // ✅ new state

  useEffect(() => {
    let mounted = true;
    async function loadMasters() {
      try {
        const [custody, livesWith] = await Promise.all([
          fetchCustodyOptions(tenantId),
          fetchLivesWithOptions(tenantId),
        ]);
        if (mounted) {
          setCustodyOptions(custody);
          setLivesWithOptions(livesWith);
        }
      } catch (err) {
        console.error("Failed to load custody/livesWith options", err);
      }
    }
    loadMasters();
    return () => { mounted = false };
  }, [tenantId]);

  return (
    <>
      <AddressGroup
        title="Demographics — Home Address (Civic + Mailing)"
        prefix=""
        syncWithPrimary={false}
        showRole={true}
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

      {/* 🔹 Custody & Lives With */}
      <div className="col-span-12">
        <Card className="p-4 sm:px-5 mt-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Custody */}
            <div className="col-span-12 md:col-span-6">
              <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                <LabelWithIcon icon={UserGroupIcon}>
                  Custody (check one)
                </LabelWithIcon>
              </label>
              <div className="flex flex-wrap gap-6">
                {custodyOptions.map((opt) => (
                  <Radio
                    key={opt.id}
                    value={opt.id}     // ✅ numeric ID
                    label={opt.name}
                    {...register("custody_of_id")}
                  />
                ))}
              </div>
              {errors?.custody_of_id && (
                <p className="mt-1 text-xs text-red-500">{errors.custody_of_id.message}</p>
              )}
            </div>

            {/* Lives With */}
            <div className="col-span-12 md:col-span-6">
              <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                <LabelWithIcon icon={UserGroupIcon}>
                  Lives With (check one)
                </LabelWithIcon>
              </label>
              <div className="flex flex-wrap gap-6">
                {livesWithOptions.map((opt) => (
                  <Radio
                    key={opt.id}
                    value={opt.id}     // ✅ numeric ID
                    label={opt.name}
                    {...register("lives_with_id")}
                  />
                ))}
              </div>
              {errors?.lives_with_id && (
                <p className="mt-1 text-xs text-red-500">{errors.lives_with_id.message}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
