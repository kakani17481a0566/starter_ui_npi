// src/app/pages/forms/StudentRegistrationForm/sections/OtherInfoSection.jsx
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Radio } from "components/ui";
import { AcademicCapIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import SectionCard from "../components/SectionCard";
import LabelWithIcon from "../components/LabelWithIcon";
import { fetchReadAbilityOptions, fetchWriteAbilityOptions } from "../dropdown";

export default function OtherInfoSection({ tenantId = 1 }) {
  const { register, formState: { errors } } = useFormContext();

  const [readOptions, setReadOptions] = useState([]);
  const [writeOptions, setWriteOptions] = useState([]);

  const compact = "h-8 py-1 text-xs";
  const radiosRow = "flex flex-wrap items-center gap-4 text-xs";

  // 🔹 Friendly label mapper
  const friendlyLabel = (code) => {
    switch (code) {
      case "READ_LITTLE": return "Reads a little";
      case "READ_WELL": return "Reads well";
      case "WRITE_LITTLE": return "Writes a little";
      case "WRITE_WELL": return "Writes well";
      default: return code; // fallback
    }
  };

  useEffect(() => {
    let mounted = true;
    async function loadOptions() {
      try {
        const [read, write] = await Promise.all([
          fetchReadAbilityOptions(tenantId),
          fetchWriteAbilityOptions(tenantId),
        ]);
        if (mounted) {
          setReadOptions(read);
          setWriteOptions(write);
        }
      } catch (err) {
        console.error("Failed to load read/write ability options", err);
      }
    }
    loadOptions();
    return () => { mounted = false };
  }, [tenantId]);

  return (
    <SectionCard
      title="Other Information"
      icon={AcademicCapIcon}
      variant="outlined"
      elevation={1}
      padding="md"
    >
      <div className="mt-2 grid grid-cols-12 gap-4">
        {/* Languages */}
        <div className="col-span-12 md:col-span-4">
          <Input
            className={compact}
            label={
              <LabelWithIcon icon={GlobeAltIcon}>
                Language most often spoken by adults at home
              </LabelWithIcon>
            }
            {...register("lang_adults_home")}
            error={errors?.lang_adults_home?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input
            className={compact}
            label={
              <LabelWithIcon icon={GlobeAltIcon}>
                Language most frequently used with child
              </LabelWithIcon>
            }
            {...register("lang_with_child")}
            error={errors?.lang_with_child?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input
            className={compact}
            label={<LabelWithIcon icon={GlobeAltIcon}>Language first learned</LabelWithIcon>}
            {...register("lang_first_learned")}
            error={errors?.lang_first_learned?.message}
          />
        </div>

        {/* Understand home language */}
        <div className="col-span-12">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={GlobeAltIcon}>
              Is child able to understand almost everything said in home language?
            </LabelWithIcon>
          </label>
          <div className={radiosRow}>
            <Radio label="Yes" value="yes" {...register("home_lang_understand")} />
            <Radio label="No" value="no" {...register("home_lang_understand")} />
          </div>
        </div>

        {/* Reading ability */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={AcademicCapIcon}>Reading ability in English</LabelWithIcon>
          </label>
          <div className={radiosRow}>
            {readOptions.map((opt) => (
              <Radio
                key={opt.id}
                value={opt.id}               // ✅ backend gets ID
                label={friendlyLabel(opt.code)} // ✅ UI shows friendly text
                {...register("read_english_id")}
              />
            ))}
          </div>
        </div>

        {/* Writing ability */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={AcademicCapIcon}>Writing ability in English</LabelWithIcon>
          </label>
          <div className={radiosRow}>
            {writeOptions.map((opt) => (
              <Radio
                key={opt.id}
                value={opt.id}
                label={friendlyLabel(opt.code)}
                {...register("write_english_id")}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
