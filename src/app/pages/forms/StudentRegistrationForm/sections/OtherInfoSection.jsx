// src/app/pages/forms/StudentRegistrationForm/sections/OtherInfoSection.jsx
import { useFormContext } from "react-hook-form";
import { Card, Input, Radio } from "components/ui";
import { AcademicCapIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";

export default function OtherInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const compact = "h-8 py-1 text-xs";
  const radiosRow = "flex flex-wrap items-center gap-4 text-xs";

  return (
    <Card className="p-4 sm:px-5">
      <div className="flex items-center gap-2">
        <AcademicCapIcon className="size-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-base font-medium">Other Information</h3>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
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
            label={
              <LabelWithIcon icon={GlobeAltIcon}>
                Language first learned
              </LabelWithIcon>
            }
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
            <Radio value="none" label="Does not read it" {...register("read_english")} />
            <Radio value="little" label="Reads it a little" {...register("read_english")} />
            <Radio value="well" label="Reads it well" {...register("read_english")} />
          </div>
        </div>

        {/* Writing ability */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={AcademicCapIcon}>Writing ability in English</LabelWithIcon>
          </label>
          <div className={radiosRow}>
            <Radio value="none" label="Does not write it" {...register("write_english")} />
            <Radio value="little" label="Writes it a little" {...register("write_english")} />
            <Radio value="well" label="Writes it well" {...register("write_english")} />
          </div>
        </div>
      </div>
    </Card>
  );
}
