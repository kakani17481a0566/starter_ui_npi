import { useFormContext } from "react-hook-form";
import { Input, Radio, Textarea, Collapse } from "components/ui";
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  HashtagIcon,
  MapPinIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, useMemo } from "react";
import LabelWithIcon from "../components/LabelWithIcon";
import SectionCard from "../components/SectionCard";
import { fetchTransportOptions } from "../dropdown";

export default function TransportationSection({ tenantId = 1 }) {
  const { register, watch, formState: { errors } } = useFormContext();

  // Watch the correct field names that are being registered
  const regTransportId = watch("regular_transport_id");
  const altTransportId = watch("alternate_transport_id");

  const [transportOptions, setTransportOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const compact = "h-8 py-1 text-xs";

  // Find the "OTHER" option IDs (if present)
  const otherRegularId = useMemo(
    () => transportOptions.find((t) => t.code === "OTHER")?.id,
    [transportOptions]
  );
  const otherAlternateId = otherRegularId; // same list, same id

  // ✅ FIXED: Proper useEffect with cleanup
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    async function loadOptions() {
      try {
        setLoading(true);
        const opts = await fetchTransportOptions(tenantId);

        // Only update state if component is still mounted
        if (isMounted) {
          setTransportOptions(opts);
        }
      } catch (err) {
        console.error("Failed to load transport options", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    // ✅ Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [tenantId]); // tenantId as dependency is fine if it can change

  // Optional: Add loading state
  if (loading) {
    return (
      <SectionCard
        title="Transportation"
        icon={BuildingOfficeIcon}
        variant="outlined"
        elevation={1}
        padding="md"
      >
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-500">Loading transport options...</div>
        </div>
      </SectionCard>
    );
  }

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
            {transportOptions.map((opt) => (
              <Radio
                key={opt.id}
                value={opt.id}             // ✅ send ID to backend
                label={opt.name}           // ✅ show name in UI
                {...register("regular_transport_id")}
              />
            ))}
          </div>

          {/* Show "Other" input when "OTHER" option is selected */}
          <Collapse in={Number(regTransportId) === otherRegularId}>
            <div className="mt-3">
              <Input
                className={compact}
                label={
                  <LabelWithIcon icon={HashtagIcon}>
                    Other (specify)
                  </LabelWithIcon>
                }
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
            {transportOptions.map((opt) => (
              <Radio
                key={opt.id}
                value={opt.id}
                label={opt.name}
                {...register("alternate_transport_id")}
              />
            ))}
          </div>

          {/* Show "Other" input when "OTHER" option is selected */}
          <Collapse in={Number(altTransportId) === otherAlternateId}>
            <div className="mt-3">
              <Input
                className={compact}
                label={
                  <LabelWithIcon icon={HashtagIcon}>
                    Other (specify)
                  </LabelWithIcon>
                }
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