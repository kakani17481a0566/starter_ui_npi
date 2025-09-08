// PreviousSchoolInfo.jsx
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { Radio } from "components/ui";
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
    clearErrors,
    formState: { errors },
  } = useFormContext();

  // --- Top-level watches (OK for hooks rule) ---
  const joinedSchool = useWatch({ control, name: "joinedSchool" }); // "yes" | "no" | ""
  const fromCourseId = useWatch({ control, name: "fromCourseId" });
  const toCourseId = useWatch({ control, name: "toCourseId" });
  const fromYear = useWatch({ control, name: "fromYear" });
  const toYear = useWatch({ control, name: "toYear" });

  const [grades, setGrades] = useState([]);
  const tenantId = 1; // TODO: make dynamic

  // Load grades/courses
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const options = await fetchCourseOptions(tenantId);
        if (!ignore) setGrades(options);
      } catch {
        if (!ignore) setGrades([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [tenantId]);

  // Autofill To Grade if empty
  useEffect(() => {
    if (fromCourseId && !toCourseId) {
      setValue("toCourseId", fromCourseId, { shouldValidate: true, shouldDirty: true });
    }
  }, [fromCourseId, toCourseId, setValue]);

  // Autofill To Year = From Year + 1 if To Year empty
  useEffect(() => {
    const currentToYear = toYear;
    if (Number.isInteger(fromYear) && !currentToYear) {
      setValue("toYear", fromYear + 1, { shouldValidate: true, shouldDirty: true });
    }
  }, [fromYear, toYear, setValue]);

  // When "No" is chosen, clear prev-school fields and validation errors
  useEffect(() => {
    if (joinedSchool === "no") {
      setValue("fromCourseId", null, { shouldValidate: true, shouldDirty: true });
      setValue("toCourseId", null, { shouldValidate: true, shouldDirty: true });
      setValue("fromYear", null, { shouldValidate: true, shouldDirty: true });
      setValue("toYear", null, { shouldValidate: true, shouldDirty: true });
      clearErrors(["fromCourseId", "toCourseId", "fromYear", "toYear"]);
    }
  }, [joinedSchool, setValue, clearErrors]);

  const gradeOptions = useMemo(() => grades, [grades]);
  const showPrevSchoolFields = joinedSchool === "yes";

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

          {/* Joined School? — full width so the next fields start on a new row */}
          <div className="col-span-12">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-2">
              Did the student join the school?
            </label>

            <Controller
              name="joinedSchool"
              control={control}
              render={({ field }) => {
                const current = field.value; // "yes" | "no" | ""
                const setJoined = (val) => {
                  setValue("joinedSchool", val, { shouldValidate: true, shouldDirty: true });
                  if (val === "no") {
                    setValue("fromCourseId", null, { shouldValidate: true, shouldDirty: true });
                    setValue("toCourseId", null, { shouldValidate: true, shouldDirty: true });
                    setValue("fromYear", null, { shouldValidate: true, shouldDirty: true });
                    setValue("toYear", null, { shouldValidate: true, shouldDirty: true });
                    clearErrors(["fromCourseId", "toCourseId", "fromYear", "toYear"]);
                  }
                };

                return (
                  <div role="radiogroup" aria-label="Did the student join the school?">
                    <div className="flex flex-wrap gap-5">
                      <Radio
                        checked={current === "yes"}
                        value="yes"
                        label="Yes"
                        name="joinedSchool"
                        color="primary"
                        onChange={() => setJoined("yes")}
                      />
                      <Radio
                        checked={current === "no"}
                        value="no"
                        label="No"
                        name="joinedSchool"
                        color="error"
                        onChange={() => setJoined("no")}
                      />
                    </div>

                    {/* Hidden inputs to keep native semantics if your form utilities expect them */}
                    <input
                      type="radio"
                      value="yes"
                      checked={current === "yes"}
                      onChange={() => setJoined("yes")}
                      className="sr-only"
                      tabIndex={-1}
                    />
                    <input
                      type="radio"
                      value="no"
                      checked={current === "no"}
                      onChange={() => setJoined("no")}
                      className="sr-only"
                      tabIndex={-1}
                    />
                  </div>
                );
              }}
            />

            {errors?.joinedSchool && (
              <p className="mt-1 text-sm text-red-600">{errors.joinedSchool.message}</p>
            )}
          </div>

          {/* Optional divider */}
          <div className="col-span-12">
            <div className="border-t border-gray-200 dark:border-dark-600 mt-2"></div>
          </div>

          {/* Helper note when No */}
          {joinedSchool === "no" && (
            <div className="col-span-12">
              <div className="text-sm text-gray-600 dark:text-dark-200">
                Since you selected <strong>No</strong>, grade and year fields are not required.
              </div>
            </div>
          )}

          {/* From Grade */}
          {showPrevSchoolFields && (
            <div className="col-span-12 md:col-span-3">
              <Controller
                name="fromCourseId"
                control={control}
                render={({ field }) => (
                  <Listbox
                    label={<LabelWithIcon icon={AcademicCapIcon}>From Grade</LabelWithIcon>}
                    data={gradeOptions}
                    value={gradeOptions.find((g) => g.id === field.value) ?? null}
                    onChange={(val) => field.onChange(val?.id ?? null)}
                    displayField="label"
                    placeholder="Select grade"
                    error={errors?.fromCourseId?.message}
                  />
                )}
              />
            </div>
          )}

          {/* From Year */}
          {showPrevSchoolFields && (
            <div className="col-span-12 md:col-span-3">
              <Controller
                name="fromYear"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    label={<LabelWithIcon icon={CalendarDaysIcon}>From Year</LabelWithIcon>}
                    value={Number.isInteger(value) ? new Date(value, 0, 1) : null}
                    onChange={(date) => {
                      if (!date) {
                        onChange(null);
                        return;
                      }
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
          )}

          {/* To Grade */}
          {showPrevSchoolFields && (
            <div className="col-span-12 md:col-span-3">
              <Controller
                name="toCourseId"
                control={control}
                render={({ field }) => (
                  <Listbox
                    label={<LabelWithIcon icon={AcademicCapIcon}>To Grade</LabelWithIcon>}
                    data={gradeOptions}
                    value={gradeOptions.find((g) => g.id === field.value) ?? null}
                    onChange={(val) => field.onChange(val?.id ?? null)}
                    displayField="label"
                    placeholder="Select grade"
                    error={errors?.toCourseId?.message}
                  />
                )}
              />
            </div>
          )}

          {/* To Year */}
          {showPrevSchoolFields && (
            <div className="col-span-12 md:col-span-3">
              <Controller
                name="toYear"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    label={<LabelWithIcon icon={CalendarDaysIcon}>To Year</LabelWithIcon>}
                    value={Number.isInteger(value) ? new Date(value, 0, 1) : null}
                    onChange={(date) => {
                      if (!date) {
                        onChange(null);
                        return;
                      }
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
          )}
        </div>
      </SectionCard>
    </div>
  );
}
