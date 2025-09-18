// src/app/pages/forms/StudentRegistrationForm/sections/StudentDetailsSection.jsx

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input, Radio, Select } from "components/ui";
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  InboxIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "components/shared/form/Datepicker";
import LabelWithIcon from "../components/LabelWithIcon";
import SectionCard from "../components/SectionCard";
import clsx from "clsx";
import { fetchBranchOptions, fetchCourseOptions } from "../dropdown";

export default function StudentDetailsSection() {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);

  // 🔹 Ensure defaults for radio fields
  useEffect(() => {
    [
      "attending_preschool",
      "previously_registered_kg",
      "siblings_in_this_school",
      "siblings_in_other_schools",
      "extra_entry_yesno",
    ].forEach((f) => {
      const v = getValues(f);
      if (v == null || v === "") {
        setValue(f, "no", { shouldDirty: false, shouldValidate: true });
      }
    });
  }, [getValues, setValue]);

  // 🔹 Load branches on mount
  useEffect(() => {
    fetchBranchOptions().then((data) => {
      // console.log("✅ Branch API Response:", data);
      setBranches(data);
    });
  }, []);

  // 🔹 Load courses when branch changes
  const selectedBranch = watch("branch_id");
  useEffect(() => {
    console.log("🔍 Selected Branch:", selectedBranch);

    if (selectedBranch) {
      fetchCourseOptions().then((data) => {
        // console.log("✅ Course API Response:", data);
        setCourses(data);
      });
    } else {
      setCourses([]);
      console.log("⚠️ No branch selected, clearing courses");
    }
  }, [selectedBranch]);

  // 🔹 Watches for dependent conditional fields
  const attendingPreschool = watch("attending_preschool");
  const previousKG = watch("previously_registered_kg");
  const hasSiblingsHere = watch("siblings_in_this_school");
  const hasSiblingsOther = watch("siblings_in_other_schools");
  const extraEntryYesNo = watch("extra_entry_yesno");

  const isOn = (v) => v === "yes";
  const compact = "h-9 py-2 text-sm";

  return (
    <SectionCard
      title="Student Details"
      icon={UserGroupIcon}
      variant="outlined"
      elevation={1}
      padding="lg"
    >
      <div className="grid grid-cols-12 gap-6">
        {/* ---------- Extra Entry ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={PhoneIcon}>
              Extra Entry — Do you have a number?
            </LabelWithIcon>
          </label>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Radio label="Yes" value="yes" {...register("extra_entry_yesno")} />
              <fieldset
                disabled={!isOn(extraEntryYesNo)}
                className={clsx(
                  "flex items-center gap-2",
                  !isOn(extraEntryYesNo) && "pointer-events-none opacity-60"
                )}
              >
                <Input
                  className={`${compact} w-28`}
                  type="number"
                  placeholder="Number"
                  {...register("extra_entry_number")}
                  error={errors?.extra_entry_number?.message}
                />
              </fieldset>
            </div>
            <Radio label="No" value="no" {...register("extra_entry_yesno")} />
          </div>
        </div>

        {/* ---------- Registration Channel ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={InboxIcon}>Registration Channel</LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio label="By Post" value="post" {...register("registration_channel")} />
            <Radio label="In Person" value="in_person" {...register("registration_channel")} />
            <Radio label="Online" value="online" {...register("registration_channel")} />
          </div>
          {errors?.registration_channel?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.registration_channel.message}</p>
          )}
        </div>

        {/* ---------- Registration Date ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={CalendarDaysIcon}>Registration Date</LabelWithIcon>
          </label>
          <Controller
            name="registration_date"
            control={control}
            render={({ field }) => (
              <>
                <DatePicker
                  value={field.value ?? null}
                  onChange={field.onChange}
                  className={compact}
                />
                {errors?.registration_date?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.registration_date.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* ---------- Branch ---------- */}
        <div className="col-span-12 md:col-span-6">
          <Controller
            name="branch_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className={compact}
                label={<LabelWithIcon icon={BuildingLibraryIcon}>Branch</LabelWithIcon>}
                data={branches}
                placeholder="Select Branch"
                error={errors?.branch_id?.message}
              />
            )}
          />
        </div>

        {/* ---------- Course ---------- */}
        <div className="col-span-12 md:col-span-6">
          <Controller
            name="course_id"
            rules={{
              setValueAs: (v) => (v == null || v === "" ? null : Number(v)),
            }}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className={compact}
                label={<LabelWithIcon icon={BookOpenIcon}>Course</LabelWithIcon>}
                data={courses} // ✅ FIXED (was options)
                placeholder="Select Course"
                error={errors?.course_id?.message}
              />
            )}
          />
        </div>

        {/* ---------- Student Name ---------- */}
        <div className="col-span-12 md:col-span-4">
          <Input
            className={compact}
            label={<LabelWithIcon icon={UserGroupIcon}>Student First Name</LabelWithIcon>}
            {...register("student_first_name")}
            error={errors?.student_first_name?.message}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Input
            className={compact}
            label={<LabelWithIcon icon={UserGroupIcon}>Student Middle Name</LabelWithIcon>}
            {...register("student_middle_name")}
            error={errors?.student_middle_name?.message}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Input
            className={compact}
            label={<LabelWithIcon icon={UserGroupIcon}>Student Last Name</LabelWithIcon>}
            {...register("student_last_name")}
            error={errors?.student_last_name?.message}
          />
        </div>

        {/* ---------- DOB ---------- */}
        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={CalendarDaysIcon}>Date of Birth</LabelWithIcon>
          </label>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <>
                <DatePicker
                  value={field.value ?? null}
                  onChange={field.onChange}
                  className={compact}
                />
                {errors?.dob?.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.dob.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* ---------- Gender ---------- */}
        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={AcademicCapIcon}>Gender</LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio
              label="Male"
              value="204"
              {...register("gender_id", {
                setValueAs: (v) => (v == null || v === "" ? null : Number(v)),
              })}
            />
            <Radio
              label="Female"
              value="205"
              {...register("gender_id", {
                setValueAs: (v) => (v == null || v === "" ? null : Number(v)),
              })}
            />
            <Radio
              label="Other"
              value="206"
              {...register("gender_id", {
                setValueAs: (v) => (v == null || v === "" ? null : Number(v)),
              })}
            />
          </div>
          {errors?.gender_id?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.gender_id.message}</p>
          )}
        </div>

        {/* ---------- Attending Pre-school ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={AcademicCapIcon}>Attending Pre-school?</LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio label="Yes" value="yes" {...register("attending_preschool")} />
            <Radio label="No" value="no" {...register("attending_preschool")} />
          </div>
          <fieldset
            disabled={!isOn(attendingPreschool)}
            className={clsx(
              "mt-3 space-y-0",
              !isOn(attendingPreschool) && "pointer-events-none opacity-60"
            )}
          >
            <Input
              className={compact}
              label={<LabelWithIcon icon={BuildingOfficeIcon}>If yes, name of pre-school</LabelWithIcon>}
              {...register("preschool_name")}
              error={errors?.preschool_name?.message}
            />
          </fieldset>
        </div>

        {/* ---------- Previously Registered for KG ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={AcademicCapIcon}>Previously registered for kindergarten?</LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio label="Yes" value="yes" {...register("previously_registered_kg")} />
            <Radio label="No" value="no" {...register("previously_registered_kg")} />
          </div>
          <fieldset
            disabled={!isOn(previousKG)}
            className={clsx("mt-3", !isOn(previousKG) && "pointer-events-none opacity-60")}
          >
            <Input
              className={compact}
              label={<LabelWithIcon icon={BuildingOfficeIcon}>If yes, name of school</LabelWithIcon>}
              {...register("previous_kg_school_name")}
              error={errors?.previous_kg_school_name?.message}
            />
          </fieldset>
        </div>

        {/* ---------- Siblings in this school ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={UserGroupIcon}>Siblings in this school?</LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio label="Yes" value="yes" {...register("siblings_in_this_school")} />
            <Radio label="No" value="no" {...register("siblings_in_this_school")} />
          </div>
          <fieldset
            disabled={!isOn(hasSiblingsHere)}
            className={clsx("mt-3", !isOn(hasSiblingsHere) && "pointer-events-none opacity-60")}
          >
            <Input
              className={compact}
              label={<LabelWithIcon icon={UserGroupIcon}>If yes, name</LabelWithIcon>}
              {...register("siblings_this_school_name")}
              error={errors?.siblings_this_school_name?.message}
            />
          </fieldset>
        </div>

        {/* ---------- Siblings in other schools ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-100">
            <LabelWithIcon icon={UserGroupIcon}>Siblings in other schools?</LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio label="Yes" value="yes" {...register("siblings_in_other_schools")} />
            <Radio label="No" value="no" {...register("siblings_in_other_schools")} />
          </div>
          <fieldset
            disabled={!isOn(hasSiblingsOther)}
            className={clsx("mt-3", !isOn(hasSiblingsOther) && "pointer-events-none opacity-60")}
          >
            <Input
              className={compact}
              label={<LabelWithIcon icon={UserGroupIcon}>If yes, name</LabelWithIcon>}
              {...register("siblings_other_school_name")}
              error={errors?.siblings_other_school_name?.message}
            />
          </fieldset>
        </div>

        {/* ---------- Note ---------- */}
        <div className="col-span-12">
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            Note: Personal information on registration will be confirmed with parents prior to the start of school in June.
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
