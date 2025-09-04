import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { grades } from "../data";
import SectionCard from "../components/SectionCard";
import LabelWithIcon from "../components/LabelWithIcon";
import InputWithIcon from "../components/InputWithIcon";
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function PreviousSchoolInfo() {
  const { control, register, formState: { errors } } = useFormContext();

  return (
    <div className="col-span-12">
      <SectionCard>
        <div className="flex items-center gap-2">
          <BuildingOfficeIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Previous School Info
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <InputWithIcon
              icon={BuildingOffice2Icon}
              label="School Name"
              placeholder="Enter previous school name"
              {...register("prev_school_name")}
              error={errors?.prev_school_name?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Controller
              name="from_grade"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={<LabelWithIcon icon={AcademicCapIcon}>From Grade</LabelWithIcon>}
                  data={grades}
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select grade"
                  error={errors?.from_grade?.message}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Controller
              name="from_year"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={<LabelWithIcon icon={CalendarDaysIcon}>From Year</LabelWithIcon>}
                  value={value ?? null}
                  onChange={onChange}
                  error={errors?.from_year?.message}
                  options={{ disableMobile: true, dateFormat: "Y" }}
                  placeholder="Choose year..."
                  {...rest}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Controller
              name="to_grade"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={<LabelWithIcon icon={AcademicCapIcon}>To Grade</LabelWithIcon>}
                  data={grades}
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select grade"
                  error={errors?.to_grade?.message}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Controller
              name="to_year"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={<LabelWithIcon icon={CalendarDaysIcon}>To Year</LabelWithIcon>}
                  value={value ?? null}
                  onChange={onChange}
                  error={errors?.to_year?.message}
                  options={{ disableMobile: true, dateFormat: "Y" }}
                  placeholder="Choose year..."
                  {...rest}
                />
              )}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
