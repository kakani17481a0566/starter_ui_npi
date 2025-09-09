import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Card, Input, Textarea, Radio } from "components/ui";
import {
  MegaphoneIcon,
  HashtagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";

export default function MedicalInfoSection() {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Compact control styles
  const compact = "h-8 py-1 text-xs";
  const radiosRow = "flex flex-wrap items-center gap-4 text-xs";

  // --- Defaults: set to "yes" to keep inputs enabled initially ---
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

  // --- When toggled to "No", clear the dependent values but keep the field visible (disabled) ---
  useEffect(() => {
    if (lifeThreatAllergy !== "yes") {
      setValue("allergy_substances", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [lifeThreatAllergy, setValue]);

  useEffect(() => {
    if (emergencyKit !== "yes") {
      setValue("emergency_kit_details", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [emergencyKit, setValue]);

  // Required only when controlling radio is "yes"
  const requiredIfYes = (dep) => ({
    validate: (val) =>
      dep === "yes" ? (val && String(val).trim().length > 0) || "This field is required." : true,
  });

  return (
    <Card className="p-4 sm:px-5">
      <div className="flex items-center gap-2">
        <MegaphoneIcon className="size-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-base font-medium">Medical Information</h3>
      </div>

      {/* One row on desktop: left = Allergy block, right = Emergency kit block */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* LEFT: Life-threatening allergy + substances (always visible; disabled when "No") */}
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

          <div className="mt-3">
            <Textarea
              className={compact}
              rows={1}
              label={<LabelWithIcon icon={HashtagIcon}>Indicate the substance(s)</LabelWithIcon>}
              disabled={lifeThreatAllergy !== "yes"}
              {...register("allergy_substances", requiredIfYes(lifeThreatAllergy))}
              error={errors?.allergy_substances?.message}
            />
          </div>
        </div>

        {/* RIGHT: Emergency kit recommended + details (always visible; disabled when "No") */}
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
              {...register("emergency_kit_details", requiredIfYes(emergencyKit))}
              error={errors?.emergency_kit_details?.message}
            />
          </div>
        </div>

        {/* Additional free-text fields */}
        <div className="col-span-12 md:col-span-6">
          <Textarea
            className={compact}
            rows={1}
            label={<LabelWithIcon icon={MegaphoneIcon}>Serious medical condition(s)</LabelWithIcon>}
            {...register("serious_medical_conditions")}
            error={errors?.serious_medical_conditions?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <Textarea
            className={compact}
            rows={1}
            label={<LabelWithIcon icon={MegaphoneIcon}>Information pertaining to serious condition(s)</LabelWithIcon>}
            {...register("serious_medical_info")}
            error={errors?.serious_medical_info?.message}
          />
        </div>

        <div className="col-span-12">
          <Textarea
            className={compact}
            rows={1}
            label={<LabelWithIcon icon={MegaphoneIcon}>Other medical information the school should be aware of</LabelWithIcon>}
            {...register("other_medical_info")}
            error={errors?.other_medical_info?.message}
          />
        </div>
      </div>
    </Card>
  );
}
