// src/app/pages/forms/StudentRegistrationForm/sections/MedicalInfoSection.jsx
import { useEffect, useState, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input, Textarea, Radio } from "components/ui";
import {
  MegaphoneIcon,
  HashtagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";
import SectionCard from "../components/SectionCard";
import { fetchAllergyOptions } from "../dropdown"; // masters_type_id = 50

export default function MedicalInfoSection({
  padding = "md",
  className,
  elevation = 6,
  variant = "solid",
  radius = "xl",
  hoverLift = true,
  interactive = false,
  subtitle,
  tenantId = 1,
  ...cardProps
}) {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const compact = "h-8 py-1 text-xs";
  const radiosRow = "flex flex-wrap items-center gap-4 text-xs";

  const [allergyOptions, setAllergyOptions] = useState([]);

  // Fetch allergy options
  useEffect(() => {
    async function loadOptions() {
      try {
        const opts = await fetchAllergyOptions(tenantId);
        setAllergyOptions(opts || []);
      } catch (err) {
        console.error("Failed to load allergy options", err);
      }
    }
    loadOptions();
  }, [tenantId]);

  // Get OTHER id
  const otherAllergyId = useMemo(
    () => allergyOptions.find((a) => a.code === "OTHER")?.id,
    [allergyOptions]
  );

  // Defaults
  useEffect(() => {
    const init = (name, fallback) => {
      const v = getValues(name);
      if (v == null || v === "") {
        setValue(name, fallback, { shouldDirty: false, shouldValidate: false });
      }
    };
    init("life_threat_allergy", "yes");
    init("emergency_kit_recommended", "yes");
  }, [getValues, setValue]);

  const lifeThreatAllergy = watch("life_threat_allergy");
  const emergencyKit = watch("emergency_kit_recommended");
  const selectedAllergy = watch("WhatAllergyId");

  // Clear dependent fields
  useEffect(() => {
    if (lifeThreatAllergy !== "yes") {
      setValue("WhatAllergyId", null, { shouldDirty: true, shouldValidate: true });
      setValue("OtherAllergyText", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [lifeThreatAllergy, setValue]);

  useEffect(() => {
    if (emergencyKit !== "yes") {
      setValue("emergency_kit_details", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [emergencyKit, setValue]);

  return (
    <SectionCard
      title="Medical Information"
      subtitle={subtitle}
      icon={MegaphoneIcon}
      padding={padding}
      elevation={elevation}
      variant={variant}
      radius={radius}
      hoverLift={hoverLift}
      interactive={interactive}
      className={className}
      {...cardProps}
    >
      <div className="mt-1 grid grid-cols-12 gap-4">
        {/* LEFT: Life-threatening allergy + substances */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={MegaphoneIcon}>
              Life-threatening allergy to foods, insect venom, medication, or other material?
            </LabelWithIcon>
          </label>
          <div className={radiosRow}>
            <Radio label="Yes" value="yes" {...register("life_threat_allergy")} />
            <Radio label="No" value="no" {...register("life_threat_allergy")} />
          </div>

          {lifeThreatAllergy === "yes" && (
            <div className="mt-3 space-y-2">
              {/* Render allergy options as radio buttons */}
              <div className={radiosRow}>
                <Controller
                  name="allergy_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      {allergyOptions.map((opt) => (
                        <Radio
                          key={opt.id}
                          value={opt.id}
                          checked={Number(field.value) === opt.id}
                          onChange={() => field.onChange(opt.id)} // force number
                          label={opt.name}
                        />
                      ))}
                    </>
                  )}
                />
              </div>

              {/* Show extra input if OTHER is selected */}
              {Number(selectedAllergy) === Number(otherAllergyId) && (
                <Input
                  className={compact}
                  label={
                    <LabelWithIcon icon={HashtagIcon}>
                      Other allergy (specify)
                    </LabelWithIcon>
                  }
                  {...register("OtherAllergyText")}
                  error={errors?.OtherAllergyText?.message}
                />
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Emergency kit recommended */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={MegaphoneIcon}>
              Has a medical doctor recommended an emergency medical kit at school?
            </LabelWithIcon>
          </label>
          <div className={radiosRow}>
            <Radio label="Yes" value="yes" {...register("emergency_kit_recommended")} />
            <Radio label="No" value="no" {...register("emergency_kit_recommended")} />
          </div>

          <div className="mt-3">
            <Input
              className={compact}
              label={<LabelWithIcon icon={PencilSquareIcon}>Kit details (if any)</LabelWithIcon>}
              disabled={emergencyKit !== "yes"}
              {...register("emergency_kit_details")}
              error={errors?.emergency_kit_details?.message}
            />
          </div>
        </div>

        {/* Additional free-text fields */}
        <div className="col-span-12 md:col-span-6">
          <Textarea
            className={compact}
            rows={2}
            label={<LabelWithIcon icon={MegaphoneIcon}>Serious medical condition(s)</LabelWithIcon>}
            {...register("serious_medical_conditions")}
            error={errors?.serious_medical_conditions?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <Textarea
            className={compact}
            rows={2}
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Information pertaining to serious condition(s)
              </LabelWithIcon>
            }
            {...register("serious_medical_info")}
            error={errors?.serious_medical_info?.message}
          />
        </div>

        <div className="col-span-12">
          <Textarea
            className={compact}
            rows={2}
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Other medical information the school should be aware of
              </LabelWithIcon>
            }
            {...register("other_medical_info")}
            error={errors?.other_medical_info?.message}
          />
        </div>
      </div>
    </SectionCard>
  );
}
