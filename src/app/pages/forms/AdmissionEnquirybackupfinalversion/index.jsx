// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  DocumentPlusIcon,
  EyeIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  HomeIcon,
  UserGroupIcon,
  MegaphoneIcon,
  // NEW: field icons
  UserIcon,
  // IdentificationIcon,
  // PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  HashtagIcon,
  PencilSquareIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { toast } from "sonner";
import { genders, grades, heardAboutUs, initialState } from "./data";

// Local Imports (keep your existing schema file)
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { Button, Card, Input, Radio, Checkbox, Collapse, InputErrorMsg } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { CountrySelect } from "./components/CountrySelect";      // NEW
import { PhoneDialCode } from "./components/PhoneDialCode";      // NEW

// ---- Helpers -----------------------------------------------------------
const LabelWithIcon = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2">
    <Icon className="size-4 text-primary-600 dark:text-primary-400" />
    <span>{children}</span>
  </span>
);

// Generic input adornment wrapper
const InputWithIcon = ({
  icon: Icon,
  error,
  className = "",
  ...inputProps
}) => (
  <div className="relative">
    <Icon className="pointer-events-none absolute top-[34px] left-3 size-4 text-gray-400" />
    <Input
      {...inputProps}
      error={error}
      className={`pl-10 ${className}`}
    />
  </div>
);

// Pull dial code from your CountrySelect value (adjust keys to your data)
const getDialFromCountry = (countryVal) =>
  countryVal?.dialCode || countryVal?.phone || countryVal?.callingCode || null;

// Normalize country to a primitive for API payloads (adjust as needed)
const normalizeCountry = (c) => c?.value || c?.code || c?.iso2 || c || null;

const AdmissionEnquiryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    reset,
    watch,
    setValue,
    clearErrors,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
    mode: "onChange",
  });

  // --- Country ↔ Dial-code syncing ------------------------------------
  const selectedCountry = watch("country");
  const isSame = watch("isSameCorrespondenceAddress");

  const studentDial = watch("student_dialCode");
  const parentDial = watch("parent_dialCode");
  const motherDial = watch("mother_dialCode");

  // When main country changes: set student dial; fill parent/mother if empty
  useEffect(() => {
    const dial = getDialFromCountry(selectedCountry);
    if (!dial) return;

    if (dial !== studentDial) {
      setValue("student_dialCode", dial, { shouldDirty: true, shouldValidate: true });
      clearErrors("student_dialCode");
    }
    if (!parentDial) {
      setValue("parent_dialCode", dial, { shouldDirty: true, shouldValidate: true });
      clearErrors("parent_dialCode");
    }
    if (!motherDial) {
      setValue("mother_dialCode", dial, { shouldDirty: true, shouldValidate: true });
      clearErrors("mother_dialCode");
    }
  }, [selectedCountry, studentDial, parentDial, motherDial, setValue, clearErrors]);

  // Mirror permanent -> correspondence when "same" is checked
  useEffect(() => {
    if (isSame) {
      const {
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
      } = getValues();

      setValue("correspondence_address_line1", address_line1 ?? "", { shouldValidate: false });
      setValue("correspondence_address_line2", address_line2 ?? "", { shouldValidate: false });
      setValue("correspondence_city", city ?? "", { shouldValidate: false });
      setValue("correspondence_state", state ?? "", { shouldValidate: false });
      setValue("correspondence_postal_code", postal_code ?? "", { shouldValidate: false });
      setValue("correspondence_country", country ?? null, { shouldValidate: false });

      clearErrors([
        "correspondence_address_line1",
        "correspondence_address_line2",
        "correspondence_city",
        "correspondence_state",
        "correspondence_postal_code",
        "correspondence_country",
      ]);
    }
  }, [isSame, getValues, setValue, clearErrors]);

  const onSubmit = async (data) => {
    const payload = { ...data };

    // Keep correspondence in sync if "same"
    if (payload.isSameCorrespondenceAddress) {
      payload.correspondence_address_line1 = payload.address_line1 ?? "";
      payload.correspondence_address_line2 = payload.address_line2 ?? "";
      payload.correspondence_city = payload.city ?? "";
      payload.correspondence_state = payload.state ?? "";
      payload.correspondence_postal_code = payload.postal_code ?? "";
      payload.correspondence_country = payload.country ?? null;
    }

    // Normalize countries for API
    payload.country = normalizeCountry(payload.country);
    payload.correspondence_country = normalizeCountry(payload.correspondence_country);

    // demo async so isSubmitting shows; replace with your API call
    await new Promise((r) => setTimeout(r, 600));
    console.log(payload);
    toast("Enquiry saved.", { invert: true });
    reset(initialState);
  };

  return (
    <Page title="Student Enquiry Form">
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6 text-primary-600 dark:text-primary-400" />
            <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">
              Student Enquiry Form
            </h2>
          </div>
          <div className="flex gap-2">
            <Button className="min-w-[7rem]" variant="outlined">
              <span className="inline-flex items-center gap-2">
                <EyeIcon className="size-4" />
                Preview
              </span>
            </Button>
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="enquiry-form"
              disabled={isSubmitting || !isValid}
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircleIcon className="size-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </span>
            </Button>
          </div>
        </div>

        <form
          id="enquiry-form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
            {/* STUDENT DETAILS */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
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

                  {/* STUDENT PHONE (Dial + Number) */}
                  {/* <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                      Student Phone
                    </label>
                    <div className="mt-1.5 flex -space-x-px">
                      <Controller
                        name="student_dialCode"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <PhoneDialCode
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={Boolean(errors?.student_dialCode)}
                          />
                        )}
                      />
                      <Input
                        {...register("student_phone")}
                        classNames={{
                          root: "flex-1",
                          input: "hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
                        }}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="Phone number"
                        error={Boolean(errors?.student_phone)}
                      />
                    </div>
                    <InputErrorMsg when={errors?.student_dialCode || errors?.student_phone}>
                      {errors?.student_dialCode?.message ?? errors?.student_phone?.message}
                    </InputErrorMsg>
                  </div> */}
                </div>
              </Card>
            </div>

            {/* PREVIOUS SCHOOL INFO */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
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
              </Card>
            </div>

            {/* ADDRESS (Permanent + Correspondence merge) */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <HomeIcon className="size-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
                    Address
                  </h3>
                </div>

                {/* Permanent Address */}
                <div className="mt-5 grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <Input
                      label={
                        <span className="inline-flex items-center gap-2">
                          <MapPinIcon className="size-4 text-primary-600 dark:text-primary-400" />
                          Address Line 1
                        </span>
                      }
                      placeholder="House/Flat, Street/Road"
                      autoComplete="address-line1"
                      {...register("address_line1")}
                      error={errors?.address_line1?.message}
                    />
                  </div>

                  <div className="col-span-12">
                    <Input
                      label={
                        <span className="inline-flex items-center gap-2">
                          <MapPinIcon className="size-4 text-primary-600 dark:text-primary-400" />
                          Address Line 2
                          <span className="text-xs text-gray-400 dark:text-dark-300 ml-1">(Optional)</span>
                        </span>
                      }
                      placeholder="Area, Landmark (optional)"
                      autoComplete="address-line2"
                      {...register("address_line2")}
                      error={errors?.address_line2?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <span className="inline-flex items-center gap-2">
                          <BuildingOffice2Icon className="size-4 text-primary-600 dark:text-primary-400" />
                          City
                        </span>
                      }
                      autoComplete="address-level2"
                      {...register("city")}
                      error={errors?.city?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <span className="inline-flex items-center gap-2">
                          <GlobeAltIcon className="size-4 text-primary-600 dark:text-primary-400" />
                          State/Province
                        </span>
                      }
                      autoComplete="address-level1"
                      {...register("state")}
                      error={errors?.state?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <span className="inline-flex items-center gap-2">
                          <HashtagIcon className="size-4 text-primary-600 dark:text-primary-400" />
                          Postal Code
                        </span>
                      }
                      inputMode="numeric"
                      autoComplete="postal-code"
                      {...register("postal_code")}
                      error={errors?.postal_code?.message}
                    />
                  </div>

                  {/* Country replaced by CountrySelect */}
                  <div className="col-span-12 md:col-span-4">
                    <Controller
                      name="country"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <CountrySelect
                          onChange={onChange}
                          value={value ?? null}
                          error={errors?.country?.message}
                          {...rest}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <Checkbox
                      {...register("isSameCorrespondenceAddress")}
                      label="Correspondence address is the same as permanent address."
                    />
                  </div>
                </div>

                {/* Correspondence Address (collapsible) */}
                <Collapse in={!isSame}>
                  <hr className="mt-4 border-gray-200 dark:border-dark-500" />
                  <div className="flex items-center gap-2 mt-4">
                    <HomeIcon className="size-5 text-primary-600 dark:text-primary-400" />
                    <h4 className="dark:text-dark-100 text-sm font-medium text-gray-800">
                      Correspondence Address
                    </h4>
                  </div>

                  <div className="mt-4 grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <MapPinIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Address Line 1
                          </span>
                        }
                        placeholder="House/Flat, Street/Road"
                        autoComplete="address-line1"
                        disabled={isSame}
                        {...register("correspondence_address_line1")}
                        error={errors?.correspondence_address_line1?.message}
                      />
                    </div>

                    <div className="col-span-12">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <MapPinIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Address Line 2
                            <span className="text-xs text-gray-400 dark:text-dark-300 ml-1">(Optional)</span>
                          </span>
                        }
                        placeholder="Area, Landmark (optional)"
                        autoComplete="address-line2"
                        disabled={isSame}
                        {...register("correspondence_address_line2")}
                        error={errors?.correspondence_address_line2?.message}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <BuildingOffice2Icon className="size-4 text-primary-600 dark:text-primary-400" />
                            City
                          </span>
                        }
                        autoComplete="address-level2"
                        disabled={isSame}
                        {...register("correspondence_city")}
                        error={errors?.correspondence_city?.message}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <GlobeAltIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            State/Province
                          </span>
                        }
                        autoComplete="address-level1"
                        disabled={isSame}
                        {...register("correspondence_state")}
                        error={errors?.correspondence_state?.message}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <HashtagIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Postal Code
                          </span>
                        }
                        inputMode="numeric"
                        autoComplete="postal-code"
                        disabled={isSame}
                        {...register("correspondence_postal_code")}
                        error={errors?.correspondence_postal_code?.message}
                      />
                    </div>

                    {/* Correspondence Country */}
                    <div className="col-span-12 md:col-span-4">
                      <Controller
                        name="correspondence_country"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <CountrySelect
                            onChange={onChange}
                            value={value ?? null}
                            error={errors?.correspondence_country?.message}
                            disabled={isSame}
                            {...rest}
                          />
                        )}
                      />
                    </div>
                  </div>
                </Collapse>
              </Card>
            </div>

            {/* PARENT / GUARDIAN + MOTHER DETAILS */}
            <div className="col-span-12 grid grid-cols-12 gap-6">
              {/* Father / Guardian */}
              <div className="col-span-12 lg:col-span-6">
                <Card className="p-4 sm:px-5">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
                      Father / Guardian Details
                    </h3>
                  </div>

                  <div className="mt-4 space-y-4">
                    <Controller
                      name="relation_type"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label
                            id="relation_type_label"
                            className="dark:text-dark-100 mb-2 inline-flex items-center gap-2 text-sm font-medium text-gray-700"
                          >
                            <UserGroupIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Parent/Guardian
                          </label>

                          <div
                            className="flex flex-wrap gap-5"
                            role="radiogroup"
                            aria-labelledby="relation_type_label"
                          >
                            <Radio
                              {...field}
                              label="Parent"
                              name={field.name}
                              value="parent"
                              variant="outlined"
                              color="primary"
                              checked={field.value === "parent"}
                              onChange={() => field.onChange("parent")}
                            />
                            <Radio
                              {...field}
                              label="Guardian"
                              name={field.name}
                              value="guardian"
                              variant="outlined"
                              color="primary"
                              checked={field.value === "guardian"}
                              onChange={() => field.onChange("guardian")}
                            />
                          </div>

                          {errors?.relation_type && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.relation_type.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-4">
                        <Input
                          label={
                            <span className="inline-flex items-center gap-2">
                              <UserIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              First Name
                            </span>
                          }
                          {...register("parent_first_name")}
                          error={errors?.parent_first_name?.message}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <Input
                          label={
                            <span className="inline-flex items-center gap-2">
                              <UserIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              Middle Name
                            </span>
                          }
                          {...register("parent_middle_name")}
                          error={errors?.parent_middle_name?.message}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <Input
                          label={
                            <span className="inline-flex items-center gap-2">
                              <UserIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              Last Name
                            </span>
                          }
                          {...register("parent_last_name")}
                          error={errors?.parent_last_name?.message}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <Input
                          label={
                            <span className="inline-flex items-center gap-2">
                              <PencilSquareIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              Qualification
                            </span>
                          }
                          {...register("parent_qualification")}
                          error={errors?.parent_qualification?.message}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <Input
                          label={
                            <span className="inline-flex items-center gap-2">
                              <BriefcaseIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              Profession
                            </span>
                          }
                          {...register("parent_profession")}
                          error={errors?.parent_profession?.message}
                        />
                      </div>

                      {/* PARENT PHONE (Dial + Number) */}
                      <div className="col-span-12">
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                          Mobile Number
                        </label>
                        <div className="mt-1.5 flex -space-x-px">
                          <Controller
                            name="parent_dialCode"
                            control={control}
                            render={({ field: { onChange, value, name } }) => (
                              <PhoneDialCode
                                onChange={onChange}
                                value={value}
                                name={name}
                                error={Boolean(errors?.parent_dialCode)}
                              />
                            )}
                          />
                          <Input
                            {...register("parent_phone")}
                            classNames={{
                              root: "flex-1",
                              input: "hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
                            }}
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="Phone number"
                            error={Boolean(errors?.parent_phone)}
                          />
                        </div>
                        <InputErrorMsg when={errors?.parent_dialCode || errors?.parent_phone}>
                          {errors?.parent_dialCode?.message ?? errors?.parent_phone?.message}
                        </InputErrorMsg>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <Input
                          label={
                            <span className="inline-flex items-center gap-2">
                              <EnvelopeIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              Email
                            </span>
                          }
                          inputMode="email"
                          autoComplete="email"
                          {...register("parent_email")}
                          error={errors?.parent_email?.message}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Mother */}
              <div className="col-span-12 lg:col-span-6">
                <Card className="p-4 sm:px-5">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="size-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
                      Mother Details
                    </h3>
                  </div>

                  <div className="mt-4 grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <UserIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Mother First Name
                          </span>
                        }
                        {...register("mother_first_name")}
                        error={errors?.mother_first_name?.message}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <UserIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Mother Middle Name
                          </span>
                        }
                        {...register("mother_middle_name")}
                        error={errors?.mother_middle_name?.message}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <UserIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Mother Last Name
                          </span>
                        }
                        {...register("mother_last_name")}
                        error={errors?.mother_last_name?.message}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <PencilSquareIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Qualification
                          </span>
                        }
                        {...register("mother_qualification")}
                        error={errors?.mother_qualification?.message}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <BriefcaseIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Profession
                          </span>
                        }
                        {...register("mother_profession")}
                        error={errors?.mother_profession?.message}
                      />
                    </div>

                    {/* MOTHER PHONE (Dial + Number) */}
                    <div className="col-span-12">
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                        Mobile Number
                      </label>
                      <div className="mt-1.5 flex -space-x-px">
                        <Controller
                          name="mother_dialCode"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <PhoneDialCode
                              onChange={onChange}
                              value={value}
                              name={name}
                              error={Boolean(errors?.mother_dialCode)}
                            />
                          )}
                        />
                        <Input
                          {...register("mother_phone")}
                          classNames={{
                            root: "flex-1",
                            input: "hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
                          }}
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="Phone number"
                          error={Boolean(errors?.mother_phone)}
                        />
                      </div>
                      <InputErrorMsg when={errors?.mother_dialCode || errors?.mother_phone}>
                        {errors?.mother_dialCode?.message ?? errors?.mother_phone?.message}
                      </InputErrorMsg>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <Input
                        label={
                          <span className="inline-flex items-center gap-2">
                            <EnvelopeIcon className="size-4 text-primary-600 dark:text-primary-400" />
                            Email
                          </span>
                        }
                        inputMode="email"
                        autoComplete="email"
                        {...register("mother_email")}
                        error={errors?.mother_email?.message}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* MARKETING / CONSENT / SIGNATURE */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <MegaphoneIcon className="size-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="dark:text-dark-100 text-base font-medium text-gray-800">
                    Marketing & Consent
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-6">
                    <Controller
                      name="heard_about_us"
                      control={control}
                      render={({ field }) => (
                        <Listbox
                          label={
                            <span className="inline-flex items-center gap-2">
                              <MegaphoneIcon className="size-4 text-primary-600 dark:text-primary-400" />
                              Where did you hear about us?
                            </span>
                          }
                          data={heardAboutUs}
                          value={heardAboutUs.find((h) => h.id === field.value) || null}
                          onChange={(val) => field.onChange(val?.id ?? null)}
                          displayField="label"
                          placeholder="Select option"
                          error={errors?.heard_about_us?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Classic "I agree" consent */}
                  <div className="col-span-12">
                    <label className="dark:text-dark-100 flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        {...register("consent_agree")}
                        className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-gray-300"
                      />
                      <span>
                        I hereby acknowledge to receive promotion and transaction
                        updates through Email/SMS from My School Italy.
                      </span>
                    </label>
                    {errors?.consent_agree && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.consent_agree.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      label="E-Signature"
                      {...register("e_signature")}
                      error={errors?.e_signature?.message}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default AdmissionEnquiryForm;
