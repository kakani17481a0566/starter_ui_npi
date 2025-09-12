import { useEffect, useState, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import SectionCard from "../components/SectionCard";
import { AcademicCapIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import {
  fetchGenderOptions,
  fetchBranchOptions,
  fetchCourseOptions,
} from "./StudentDetailsData";

export default function StudentDetails() {
  const { register, control, formState: { errors } } = useFormContext();

  const [genders, setGenders] = useState([]);
  const [grades, setGrades] = useState([]);
  const [branches, setBranches] = useState([]);

  const smallInput = useMemo(
    () => "h-8 py-1 text-xs placeholder:text-xs",
    []
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [g, c, b] = await Promise.all([
          fetchGenderOptions(),
          fetchCourseOptions(),
          fetchBranchOptions(),
        ]);
        if (!alive) return;
        setGenders(Array.isArray(g) ? g : []);
        setGrades(Array.isArray(c) ? c : []);
        setBranches(Array.isArray(b) ? b : []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { alive = false; };
  }, []);
  console.log(genders);

  return (
    <div className="col-span-12">
      <SectionCard className="rounded-lg ">
        {/* Title Row */}
        <div className="flex items-center gap-2">
          <AcademicCapIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Student Details
          </h3>
        </div>

        {/* Top Divider */}
        <div className="mt-3 border-t border-gray-200 dark:border-dark-600" />

        {/* Form Grid */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* First Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              className={smallInput}
              {...register("student_first_name")}
              error={errors?.student_first_name?.message}
            />
          </div>

          {/* Middle Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Middle Name"
              placeholder="Enter middle name"
              className={smallInput}
              {...register("student_middle_name")}
              error={errors?.student_middle_name?.message}
            />
          </div>

          {/* Last Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Last Name"
              placeholder="Enter last name"
              className={smallInput}
              {...register("student_last_name")}
              error={errors?.student_last_name?.message}
            />
          </div>

          {/* Date of Birth */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="dob"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <DatePicker
                  label={
                    <span className="inline-flex items-center gap-2">
                      <CalendarDaysIcon className="size-4 text-primary-600 dark:text-primary-400" />
                      <span>DOB</span>
                    </span>
                  }
                  value={value ?? null}
                  onChange={onChange}
                  inputClassName={smallInput}
                  className={smallInput}
                  error={errors?.dob?.message}
                  options={{ disableMobile: true, maxDate: "today" }}
                  placeholder="Choose date..."
                  {...field}
                />
              )}
            />
          </div>

          {/* Gender */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="gender_id"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Gender"
                  data={genders}
                  displayField="label"
                  value={genders.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id != null ? Number(val.id) : null)}
                  placeholder="Select Gender"
                  error={errors?.gender_id?.message}
                  inputProps={{ className: smallInput }}
                />
              )}
            />
          </div>

          {/* Grade / Course Applying For */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="admission_course_id"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Grade Applying For"
                  data={grades}
                  displayField="label"
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id != null ? Number(val.id) : null)}
                  placeholder="Select Grade"
                  error={errors?.admission_course_id?.message}
                  inputProps={{ className: smallInput }}
                />
              )}
            />
          </div>

          {/* Branch */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="branch_id"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Branch"
                  data={branches}
                  displayField="label"
                  value={branches.find((b) => b.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id != null ? Number(val.id) : null)}
                  placeholder="Select Branch"
                  error={errors?.branch_id?.message}
                  inputProps={{ className: smallInput }}
                />
              )}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
