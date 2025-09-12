// src/app/pages/forms/StudentRegistrationForm/sections/TransportationSection.jsx
import { useFormContext } from "react-hook-form";
import { Input, Radio, Textarea, Collapse } from "components/ui";
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  HashtagIcon,
  MapPinIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";
import SectionCard from "../components/SectionCard";

export default function TransportationSection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const regOtherTransport = watch("regular_transport");
  const altOtherTransport = watch("alternate_transport");

  const compact = "h-8 py-1 text-xs";

  return (
    <SectionCard
      title="Transportation"
      icon={BuildingOfficeIcon}
      variant="outlined"
      elevation={1}
      padding="md"
    >
      <div className="mt-2 grid grid-cols-12 gap-4">
        {/* Regular Transportation */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={BuildingOffice2Icon}>
              REGULAR Transportation
            </LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio value="bus" label="Bus" {...register("regular_transport")} />
            <Radio value="walk" label="Walk" {...register("regular_transport")} />
            <Radio value="other" label="Other" {...register("regular_transport")} />
          </div>

          <Collapse in={regOtherTransport === "other"}>
            <div className="mt-3">
              <Input
                className={compact}
                label={<LabelWithIcon icon={HashtagIcon}>Other (specify)</LabelWithIcon>}
                {...register("regular_transport_other")}
                error={errors?.regular_transport_other?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* Alternate Transportation */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={BuildingOffice2Icon}>
              ALTERNATE Transportation
            </LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio value="bus" label="Bus" {...register("alternate_transport")} />
            <Radio value="walk" label="Walk" {...register("alternate_transport")} />
            <Radio value="other" label="Other" {...register("alternate_transport")} />
          </div>

          <Collapse in={altOtherTransport === "other"}>
            <div className="mt-3">
              <Input
                className={compact}
                label={<LabelWithIcon icon={HashtagIcon}>Other (specify)</LabelWithIcon>}
                {...register("alternate_transport_other")}
                error={errors?.alternate_transport_other?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* Free-text: Other transportation info */}
        <div className="col-span-12 md:col-span-6">
          <Textarea
            className={compact}
            rows={2}
            label={
              <LabelWithIcon icon={MapPinIcon}>
                Other transportation information (if any)
              </LabelWithIcon>
            }
            {...register("transport_other_info")}
            error={errors?.transport_other_info?.message}
          />
        </div>

        {/* Speech therapy */}
        <div className="col-span-12">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={MegaphoneIcon}>
              Has child received speech therapy?
            </LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio label="Yes" value="yes" {...register("speech_therapy")} />
            <Radio label="No" value="no" {...register("speech_therapy")} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
