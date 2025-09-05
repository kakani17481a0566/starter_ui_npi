import { useFormContext } from "react-hook-form";
import { Card, Input, Textarea, Radio, Collapse } from "components/ui";
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
    formState: { errors },
  } = useFormContext();

  const lifeThreatAllergy = watch("life_threat_allergy");
  const emergencyKit = watch("emergency_kit_recommended");

  return (
    <Card className="p-4 sm:px-5">
      <div className="flex items-center gap-2">
        <MegaphoneIcon className="text-primary-600 dark:text-primary-400 size-5" />
        <h3 className="text-base font-medium">Medical Information</h3>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Life-threatening allergy */}
        <div className="col-span-12">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={MegaphoneIcon}>
              Life-threatening allergy to foods, insect venom, medication, or other material?
            </LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio label="Yes" value="yes" {...register("life_threat_allergy")} />
            <Radio label="No" value="no" {...register("life_threat_allergy")} />
          </div>
        </div>

        {/* Allergy substance details */}
        <div className="col-span-12">
          <Collapse in={lifeThreatAllergy === "yes"} className="block w-full">
            <div className="mt-3">
              <Textarea
                label={
                  <LabelWithIcon icon={HashtagIcon}>
                    Indicate the substance(s)
                  </LabelWithIcon>
                }
                rows={1}
                {...register("allergy_substances")}
                error={errors?.allergy_substances?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* Emergency kit recommended */}
        <div className="col-span-12">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={MegaphoneIcon}>
              Has a medical doctor recommended an emergency medical kit at school?
            </LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio label="Yes" value="yes" {...register("emergency_kit_recommended")} />
            <Radio label="No" value="no" {...register("emergency_kit_recommended")} />
          </div>
        </div>

        {/* Emergency kit details */}
        <div className="col-span-12">
          <Collapse in={emergencyKit === "yes"} className="block w-full">
            <div className="mt-3">
              <Input
                label={
                  <LabelWithIcon icon={PencilSquareIcon}>
                    Kit details (if any)
                  </LabelWithIcon>
                }
                {...register("emergency_kit_details")}
                error={errors?.emergency_kit_details?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* Serious medical conditions */}
        <div className="col-span-12 md:col-span-6">
          <Textarea
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Serious medical condition(s)
              </LabelWithIcon>
            }
            rows={1}
            {...register("serious_medical_conditions")}
            error={errors?.serious_medical_conditions?.message}
          />
        </div>

        {/* Info about serious conditions */}
        <div className="col-span-12 md:col-span-6">
          <Textarea
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Information pertaining to serious condition(s)
              </LabelWithIcon>
            }
            rows={1}
            {...register("serious_medical_info")}
            error={errors?.serious_medical_info?.message}
          />
        </div>

        {/* Other medical info */}
        <div className="col-span-12">
          <Textarea
            label={
              <LabelWithIcon icon={MegaphoneIcon}>
                Other medical information the school should be aware of
              </LabelWithIcon>
            }
            rows={1}
            {...register("other_medical_info")}
            error={errors?.other_medical_info?.message}
          />
        </div>
      </div>
    </Card>
  );
}
