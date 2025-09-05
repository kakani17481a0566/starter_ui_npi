import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { fetchCourseOptions } from "./PreviousSchoolInfodata";
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
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fromGrade = watch("fromCourseId");
  const [grades, setGrades] = useState([]);
  const tenantId = 1; // Make dynamic if needed

  // Load grades/courses from API
  useEffect(() => {
    const loadCourses = async () => {
      const options = await fetchCourseOptions(tenantId);
      setGrades(options);
    };
    loadCourses();
  }, [tenantId]);

  // Auto-fill toCourseId if empty
  useEffect(() => {
    const existingToGrade = watch("toCourseId");
    if (fromGrade && !existingToGrade) {
      setValue("toCourseId", fromGrade);
    }
  }, [fromGrade, setValue, watch]);

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
          {/* School Name */}
          <div className="col-span-12">
            <InputWithIcon
              icon={BuildingOffice2Icon}
              label="School Name"
              placeholder="Enter previous school name"
              {...register("prevSchoolName")}
              error={errors?.prevSchoolName?.message}
            />
          </div>

          {/* From Grade */}
          <div className="col-span-12 md:col-span-3">
            <Controller
              name="fromCourseId"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={
                    <LabelWithIcon icon={AcademicCapIcon}>
                      From Grade
                    </LabelWithIcon>
                  }
                  data={grades}
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select grade"
                  error={errors?.fromCourseId?.message}
                />
              )}
            />
          </div>

          {/* From Year */}
          <div className="col-span-12 md:col-span-3">
            <Controller
              name="fromYear"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={<LabelWithIcon icon={CalendarDaysIcon}>From Year</LabelWithIcon>}
                  value={value ? new Date(value, 0) : null}
                  onChange={(date) => {
                    const year = new Date(date).getFullYear();
                    onChange(year);
                  }}
                  error={errors?.fromYear?.message}
                  options={{ disableMobile: true, dateFormat: "Y" }}
                  placeholder="Choose year..."
                  {...rest}
                />
              )}
            />
          </div>

          {/* To Grade */}
          <div className="col-span-12 md:col-span-3">
            <Controller
              name="toCourseId"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={<LabelWithIcon icon={AcademicCapIcon}>To Grade</LabelWithIcon>}
                  data={grades}
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select grade"
                  error={errors?.toCourseId?.message}
                />
              )}
            />
          </div>

          {/* To Year */}
          <div className="col-span-12 md:col-span-3">
            <Controller
              name="toYear"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={<LabelWithIcon icon={CalendarDaysIcon}>To Year</LabelWithIcon>}
                  value={value ? new Date(value, 0) : null}
                  onChange={(date) => {
                    const year = new Date(date).getFullYear();
                    onChange(year);
                  }}
                  error={errors?.toYear?.message}
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
