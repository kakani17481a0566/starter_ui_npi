import { useFormContext, Controller } from "react-hook-form";
import { Input } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import SectionCard from "../components/SectionCard";
import { genders, grades } from "../data";
import {
  AcademicCapIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
// import PhoneField from "../components/PhoneField";

export default function StudentDetails() {
  const { register, control, formState: { errors } } = useFormContext();

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
          <div className="col-span-12 md:col-span-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              {...register("student_first_name")}
              error={errors?.student_first_name?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Middle Name"
              placeholder="Enter middle name"
              {...register("student_middle_name")}
              error={errors?.student_middle_name?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...register("student_last_name")}
              error={errors?.student_last_name?.message}
            />
          </div>

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

          <div className="col-span-12 md:col-span-4">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Gender"
                  data={genders}
                  value={genders.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select Gender"
                  error={errors?.gender?.message}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Controller
              name="grade_applying_for"
              control={control}
              render={({ field }) => (
                <Listbox
                  label="Grade"
                  data={grades}
                  value={grades.find((g) => g.id === field.value) || null}
                  onChange={(val) => field.onChange(val?.id ?? null)}
                  displayField="label"
                  placeholder="Select Grade"
                  error={errors?.grade_applying_for?.message}
                />
              )}
            />
          </div>

          {/* phone */}
          {/* <PhoneField dialName="student_dialCode" numberName="student_phone" label="Student Phone" /> */}
        </div>
      </SectionCard>
    </div>
  );
}
