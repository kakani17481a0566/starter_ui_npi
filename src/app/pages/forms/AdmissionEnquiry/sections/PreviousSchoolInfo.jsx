// PreviousSchoolInfo.jsx
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { Radio } from "components/ui";
import { fetchCourseOptions } from "./PreviousSchoolInfodata";
// import SectionCard from "../components/SectionCard";
import LabelWithIcon from "../components/LabelWithIcon";
import InputWithIcon from "../components/InputWithIcon";
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function PreviousSchoolInfo({ embedded = false }) {
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const small = "h-8 py-1 text-xs placeholder:text-xs";

  // Watches
  const joinedSchool   = useWatch({ control, name: "joinedSchool" }); // "yes" | "no" | ""
  const from_course_id = useWatch({ control, name: "from_course_id" });
  const to_course_id   = useWatch({ control, name: "to_course_id" });
  const from_year      = useWatch({ control, name: "from_year" });
  const to_year        = useWatch({ control, name: "to_year" });

  const [grades, setGrades] = useState([]);
  const tenantId = 1; // TODO: make dynamic

  // --- Default to "yes" if not set by parent defaultValues ---
  useEffect(() => {
    if (joinedSchool == null || joinedSchool === "") {
      setValue("joinedSchool", "yes", { shouldDirty: false, shouldValidate: true });
    }
  }, [joinedSchool, setValue]);

  // Load grades/courses
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const options = await fetchCourseOptions(tenantId);
        if (!ignore) setGrades(Array.isArray(options) ? options : []);
      } catch {
        if (!ignore) setGrades([]);
      }
    })();
    return () => { ignore = true; };
  }, [tenantId]);

  // Autofill To Grade if empty (only when "yes")
  useEffect(() => {
    if (joinedSchool === "yes" && from_course_id && !to_course_id) {
      setValue("to_course_id", from_course_id, { shouldValidate: true, shouldDirty: true });
    }
  }, [joinedSchool, from_course_id, to_course_id, setValue]);

  // Autofill To Year = From Year + 1 if To Year empty (only when "yes")
  useEffect(() => {
    if (joinedSchool === "yes" && Number.isInteger(from_year) && !to_year) {
      setValue("to_year", from_year + 1, { shouldValidate: true, shouldDirty: true });
    }
  }, [joinedSchool, from_year, to_year, setValue]);

  // Clear prev-school fields and errors when "No"
  useEffect(() => {
    if (joinedSchool === "no") {
      setValue("prev_school_name", "", { shouldValidate: true, shouldDirty: true });
      setValue("from_course_id", null, { shouldValidate: true, shouldDirty: true });
      setValue("to_course_id", null,   { shouldValidate: true, shouldDirty: true });
      setValue("from_year", null,      { shouldValidate: true, shouldDirty: true });
      setValue("to_year", null,        { shouldValidate: true, shouldDirty: true });
      clearErrors(["prev_school_name", "from_course_id", "to_course_id", "from_year", "to_year"]);
    }
  }, [joinedSchool, setValue, clearErrors]);

  const gradeOptions = useMemo(() => grades, [grades]);
  const showPrevSchoolFields = joinedSchool === "yes";

  // Header radio render (beside title)
  const JoinedSchoolHeaderRadios = (
    <Controller
      name="joinedSchool"
      control={control}
      render={({ field }) => {
        const current = field.value; // "yes" | "no" | ""
        const setJoined = (val) => {
          setValue("joinedSchool", val, { shouldValidate: true, shouldDirty: true });
          if (val === "no") {
            setValue("prev_school_name", "", { shouldValidate: true, shouldDirty: true });
            setValue("from_course_id", null, { shouldValidate: true, shouldDirty: true });
            setValue("to_course_id", null,   { shouldValidate: true, shouldDirty: true });
            setValue("from_year", null,      { shouldValidate: true, shouldDirty: true });
            setValue("to_year", null,        { shouldValidate: true, shouldDirty: true });
            clearErrors(["prev_school_name","from_course_id","to_course_id","from_year","to_year"]);
          }
        };

        return (
          <div
            role="radiogroup"
            aria-label="Did the student join the school?"
            className="flex items-center gap-3"
          >
            <span className="text-sm text-gray-700 dark:text-dark-100">Joined?</span>
            <div className="flex items-center gap-3">
              <Radio
                checked={current === "yes"}
                value="yes"
                label="Yes"
                name="joinedSchool"
                onChange={() => setJoined("yes")}
              />
              <Radio
                checked={current === "no"}
                value="no"
                label="No"
                name="joinedSchool"
                onChange={() => setJoined("no")}
              />
            </div>
          </div>
        );
      }}
    />
  );

  // Content grid
  const ContentGrid = (
    <div className="mt-4 grid grid-cols-12 gap-4">
      {/* Helper when No */}
      {joinedSchool === "no" && (
        <div className="col-span-12">
          <div className="text-sm text-gray-600 dark:text-dark-200">
            Since you selected <strong>No</strong>, grade and year fields are not required.
          </div>
        </div>
      )}

      {/* School Name (only when Yes) */}
      {showPrevSchoolFields && (
        <div className="col-span-12">
          <InputWithIcon
            icon={BuildingOffice2Icon}
            label="School Name"
            placeholder="Enter previous school name"
            className={small}
            {...register("prev_school_name")}
            error={errors?.prev_school_name?.message || errors?.prevSchoolName?.message}
          />
        </div>
      )}

      {/* Row 1: From Grade → To Grade */}
      {showPrevSchoolFields && (
        <>
          <div className="col-span-12 md:col-span-6">
            <Controller
              name="from_course_id"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={<LabelWithIcon icon={AcademicCapIcon}>From Grade</LabelWithIcon>}
                  data={gradeOptions}
                  value={gradeOptions.find((g) => g.id === field.value) ?? null}
                  onChange={(val) => field.onChange(val?.id != null ? Number(val.id) : null)}
                  displayField="label"
                  placeholder="Select grade"
                  error={errors?.from_course_id?.message || errors?.fromCourseId?.message}
                  inputProps={{ className: small }}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Controller
              name="to_course_id"
              control={control}
              render={({ field }) => (
                <Listbox
                  label={<LabelWithIcon icon={AcademicCapIcon}>To Grade</LabelWithIcon>}
                  data={gradeOptions}
                  value={gradeOptions.find((g) => g.id === field.value) ?? null}
                  onChange={(val) => field.onChange(val?.id != null ? Number(val.id) : null)}
                  displayField="label"
                  placeholder="Select grade"
                  error={errors?.to_course_id?.message || errors?.toCourseId?.message}
                  inputProps={{ className: small }}
                />
              )}
            />
          </div>

          {/* Row 2: From Year → To Year */}
          <div className="col-span-12 md:col-span-6">
            <Controller
              name="from_year"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={<LabelWithIcon icon={CalendarDaysIcon}>From Year</LabelWithIcon>}
                  value={Number.isInteger(value) ? new Date(value, 0, 1) : null}
                  onChange={(date) => {
                    if (!date) return onChange(null);
                    const year = new Date(date).getFullYear();
                    onChange(year);
                  }}
                  error={errors?.from_year?.message || errors?.fromYear?.message}
                  options={{ disableMobile: true, dateFormat: "Y" }}
                  placeholder="Choose year..."
                  inputClassName={small}
                  className={small}
                  {...rest}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Controller
              name="to_year"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={<LabelWithIcon icon={CalendarDaysIcon}>To Year</LabelWithIcon>}
                  value={Number.isInteger(value) ? new Date(value, 0, 1) : null}
                  onChange={(date) => {
                    if (!date) return onChange(null);
                    const year = new Date(date).getFullYear();
                    onChange(year);
                  }}
                  error={errors?.to_year?.message || errors?.toYear?.message}
                  options={{ disableMobile: true, dateFormat: "Y" }}
                  placeholder="Choose year..."
                  inputClassName={small}
                  className={small}
                  {...rest}
                />
              )}
            />
          </div>
        </>
      )}
    </div>
  );

  // Embedded mode (no outer SectionCard)
  if (embedded) {
    return (
      <>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BuildingOfficeIcon className="size-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-bold text-gray-800 dark:text-dark-100">
              Previous School Info
            </h3>
          </div>
          {JoinedSchoolHeaderRadios}
        </div>
        {ContentGrid}
      </>
    );
  }

  // Standalone card
  return (
    <div className="col-span-12">
      {/* <SectionCard> */}
        {/* Header with radios on the right */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BuildingOfficeIcon className="size-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold  dark:text-dark-100 text-base  text-gray-800">
              Previous School Info
            </h3>
          </div>
          {JoinedSchoolHeaderRadios}
        </div>

        {/* Divider */}
        <div className="mt-3 border-t border-gray-200 dark:border-dark-600" />

        {ContentGrid}
      {/* </SectionCard> */}
    </div>
  );
}
