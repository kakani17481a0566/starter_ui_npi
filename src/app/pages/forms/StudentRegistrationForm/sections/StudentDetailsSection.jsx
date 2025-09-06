// src/app/pages/forms/StudentRegistrationForm/sections/StudentDetailsSection.jsx

import { useFormContext, Controller } from "react-hook-form";
import { Card, Input, Radio, Collapse } from "components/ui";
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "components/shared/form/Datepicker";
import LabelWithIcon from "../components/LabelWithIcon";

export default function StudentDetailsSection() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const attendingPreschool = watch("attending_preschool");
  const previousKG = watch("previously_registered_kg");
  const hasSiblingsHere = watch("siblings_in_this_school");
  const hasSiblingsOther = watch("siblings_in_other_schools");

  return (
    <Card className="p-4 sm:px-5">
      <div className="grid grid-cols-12 gap-4">
        {/* ---------- Student Name ---------- */}
        <div className="col-span-12 md:col-span-4">
          <Input
            label={
              <LabelWithIcon icon={UserGroupIcon}>Student First Name</LabelWithIcon>
            }
            {...register("student_first_name")}
            error={errors?.student_first_name?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input
            label={
              <LabelWithIcon icon={UserGroupIcon}>Student Middle Name</LabelWithIcon>
            }
            {...register("student_middle_name")}
            error={errors?.student_middle_name?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <Input
            label={
              <LabelWithIcon icon={UserGroupIcon}>Student Last Name</LabelWithIcon>
            }
            {...register("student_last_name")}
            error={errors?.student_last_name?.message}
          />
        </div>

        {/* ---------- DOB ---------- */}
        <div className="col-span-12 md:col-span-4">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={CalendarDaysIcon}>Date of Birth</LabelWithIcon>
          </label>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <>
                <DatePicker value={field.value ?? null} onChange={field.onChange} />
                {errors?.dob?.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.dob.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* ---------- Gender ---------- */}
        <div className="col-span-12 md:col-span-4">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={AcademicCapIcon}>Gender</LabelWithIcon>
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio
              label="Male"
              value="204" // replace with your actual Master ID if different
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
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={AcademicCapIcon}>Attending Pre-school?</LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio label="Yes" value="yes" {...register("attending_preschool")} />
            <Radio label="No" value="no" {...register("attending_preschool")} />
          </div>
          <Collapse in={attendingPreschool === "yes"}>
            <div className="mt-3">
              <Input
                label={
                  <LabelWithIcon icon={BuildingOfficeIcon}>
                    If yes, name of pre-school
                  </LabelWithIcon>
                }
                {...register("preschool_name")}
                error={errors?.preschool_name?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* ---------- Previously registered for KG ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={AcademicCapIcon}>
              Previously registered for kindergarten?
            </LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              value="yes"
              {...register("previously_registered_kg")}
            />
            <Radio
              label="No"
              value="no"
              {...register("previously_registered_kg")}
            />
          </div>
          <Collapse in={previousKG === "yes"}>
            <div className="mt-3">
              <Input
                label={
                  <LabelWithIcon icon={BuildingOfficeIcon}>
                    If yes, name of school
                  </LabelWithIcon>
                }
                {...register("previous_kg_school_name")}
                error={errors?.previous_kg_school_name?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* ---------- Siblings in this school ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={UserGroupIcon}>Siblings in this school?</LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              value="yes"
              {...register("siblings_in_this_school")}
            />
            <Radio label="No" value="no" {...register("siblings_in_this_school")} />
          </div>
          <Collapse in={hasSiblingsHere === "yes"}>
            <div className="mt-3">
              <Input
                label={<LabelWithIcon icon={UserGroupIcon}>If yes, name</LabelWithIcon>}
                {...register("siblings_this_school_name")}
                error={errors?.siblings_this_school_name?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* ---------- Siblings in other schools ---------- */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={UserGroupIcon}>
              Siblings in other schools?
            </LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              value="yes"
              {...register("siblings_in_other_schools")}
            />
            <Radio
              label="No"
              value="no"
              {...register("siblings_in_other_schools")}
            />
          </div>
          <Collapse in={hasSiblingsOther === "yes"}>
            <div className="mt-3">
              <Input
                label={<LabelWithIcon icon={UserGroupIcon}>If yes, name</LabelWithIcon>}
                {...register("siblings_other_school_name")}
                error={errors?.siblings_other_school_name?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* ---------- Note ---------- */}
        <div className="col-span-12">
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            Note: Personal information on registration will be confirmed with
            parents prior to the start of school in June.
          </div>
        </div>
      </div>
    </Card>
  );
}
