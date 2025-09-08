import { useEffect, useState } from "react";
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
        // Expecting arrays of { id: number, label: string }
        setGenders(Array.isArray(g) ? g : []);
        setGrades(Array.isArray(c) ? c : []);
        setBranches(Array.isArray(b) ? b : []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="col-span-12">
      <SectionCard>
        <div className="flex items-center gap-2">
          <AcademicCapIcon className="size-5 text-primary-600 dark:text-primary-400" />
          <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
            Student Details
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* First Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              {...register("student_first_name")}
              error={errors?.studentFirstName?.message}
            />
          </div>

          {/* Middle Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Middle Name"
              placeholder="Enter middle name"
              {...register("student_middle_name")}
              error={errors?.studentMiddleName?.message}
            />
          </div>

          {/* Last Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...register("student_last_name")}
              error={errors?.studentLastName?.message}
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
                  value={value ?? null}            // RHF holds a Date or null
                  onChange={onChange}              // You convert to ISO in submit
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
                  error={errors?.genderId?.message}
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
                  error={errors?.admissionCourseId?.message}
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
                  error={errors?.branchId?.message}
                />
              )}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
