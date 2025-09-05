import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import SectionCard from "../components/SectionCard";
import {
  AcademicCapIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import {
  fetchGenderOptions,
  fetchBranchOptions,
  fetchCourseOptions,
} from "./StudentDetailsData";

export default function StudentDetails() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const [genders, setGenders] = useState([]);
  const [grades, setGrades] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchGenderOptions().then(setGenders).catch(console.error);
    fetchCourseOptions().then(setGrades).catch(console.error);
    fetchBranchOptions().then(setBranches).catch(console.error);
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
              {...register("studentFirstName")}
              error={errors?.studentFirstName?.message}
            />
          </div>

          {/* Middle Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Middle Name"
              placeholder="Enter middle name"
              {...register("studentMiddleName")}
              error={errors?.studentMiddleName?.message}
            />
          </div>

          {/* Last Name */}
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...register("studentLastName")}
              error={errors?.studentLastName?.message}
            />
          </div>

          {/* Date of Birth */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="dob"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={
                    <span className="inline-flex items-center gap-2">
                      <CalendarDaysIcon className="size-4 text-primary-600 dark:text-primary-400" />
                      <span>DOB</span>
                    </span>
                  }
                  value={value ?? null}
                  onChange={onChange}
                  error={errors?.dob?.message}
                  options={{ disableMobile: true, maxDate: "today" }}
                  placeholder="Choose date..."
                  {...rest}
                />
              )}
            />
          </div>

          {/* Gender */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="genderId"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Gender"
                  data={genders}
                  value={genders.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select Gender"
                  error={errors?.genderId?.message}
                />
              )}
            />
          </div>

          {/* Grade / Course Applying For */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="admissionCourseId"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Grade Applying For"
                  data={grades}
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select Grade"
                  error={errors?.admissionCourseId?.message}
                />
              )}
            />
          </div>

          {/* Branch */}
          <div className="col-span-12 md:col-span-4">
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Branch"
                  data={branches}
                  value={branches.find((b) => b.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
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
