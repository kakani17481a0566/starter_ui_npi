// src/app/pages/forms/StudentRegistrationForm/index.jsx

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  DocumentPlusIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  HomeIcon,
  UserGroupIcon,
  MegaphoneIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  HashtagIcon,
  PencilSquareIcon,
  BriefcaseIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { toast } from "sonner";

import { initialState } from "./data";
import { schema } from "./schema";

import { Page } from "components/shared/Page";
import { Button, Card, Input, Radio, Collapse, Textarea } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";

// ---- Helpers -----------------------------------------------------------
const LabelWithIcon = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2">
    <Icon className="text-primary-600 dark:text-primary-400 size-4" />
    <span>{children}</span>
  </span>
);

// Pull dial code from your CountrySelect value (defensive)
const getDialFromCountry = (countryVal) =>
  countryVal && typeof countryVal === "object"
    ? countryVal.dialCode || countryVal.phone || countryVal.callingCode || null
    : null;

// Normalize country to a primitive for API payloads
const normalizeCountry = (c) => c?.value || c?.code || c?.iso2 || c || null;

// Reusable contact row (adds subtle icons in labels)
function ContactRow({ title, prefix, register, errors }) {
  return (
    <div className="col-span-12">
      <div className="mt-4 flex items-center gap-2">
        <UserGroupIcon className="text-primary-600 dark:text-primary-400 size-5" />
        <h4 className="dark:text-dark-100 text-sm font-medium text-gray-800">
          {title}
        </h4>
      </div>
      <div className="mt-3 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <Input
            label={
              <LabelWithIcon icon={UserGroupIcon}>First Name</LabelWithIcon>
            }
            {...register(`${prefix}_first_name`)}
            error={errors?.[`${prefix}_first_name`]?.message}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <Input
            label={
              <LabelWithIcon icon={UserGroupIcon}>Last Name</LabelWithIcon>
            }
            {...register(`${prefix}_last_name`)}
            error={errors?.[`${prefix}_last_name`]?.message}
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Input
            label={<LabelWithIcon icon={HomeIcon}>Home Phone</LabelWithIcon>}
            inputMode="tel"
            {...register(`${prefix}_home_phone`)}
            error={errors?.[`${prefix}_home_phone`]?.message}
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Input
            label={
              <LabelWithIcon icon={PhoneIconFallback}>Cell Phone</LabelWithIcon>
            }
            inputMode="tel"
            {...register(`${prefix}_cell_phone`)}
            error={errors?.[`${prefix}_cell_phone`]?.message}
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Input
            label={
              <LabelWithIcon icon={BriefcaseIcon}>Business Phone</LabelWithIcon>
            }
            inputMode="tel"
            {...register(`${prefix}_business_phone`)}
            error={errors?.[`${prefix}_business_phone`]?.message}
          />
        </div>
      </div>
    </div>
  );
}

// Fallback tiny phone icon using HashtagIcon shape (if you don't have a PhoneIcon)
function PhoneIconFallback(props) {
  return <HashtagIcon {...props} />;
}

function StudentRegistrationForm() {
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

  // --- Country ↔ Dial-code syncing (kept for compatibility with watchers) ---
  const selectedCountry = watch("country");
  const isSameCorr = watch("isSameCorrespondenceAddress");

  const studentDial = watch("student_dialCode");
  const parentDial = watch("parent_dialCode");
  const motherDial = watch("mother_dialCode");

  useEffect(() => {
    const dial = getDialFromCountry(selectedCountry);
    if (!dial) return;

    if (dial !== studentDial) {
      setValue("student_dialCode", dial, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("student_dialCode");
    }
    if (!parentDial) {
      setValue("parent_dialCode", dial, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("parent_dialCode");
    }
    if (!motherDial) {
      setValue("mother_dialCode", dial, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("mother_dialCode");
    }
  }, [
    selectedCountry,
    studentDial,
    parentDial,
    motherDial,
    setValue,
    clearErrors,
  ]);

  // Mirror permanent -> correspondence when "same" is checked
  useEffect(() => {
    if (isSameCorr) {
      const {
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
      } = getValues();
      setValue("correspondence_address_line1", address_line1 ?? "", {
        shouldValidate: false,
      });
      setValue("correspondence_address_line2", address_line2 ?? "", {
        shouldValidate: false,
      });
      setValue("correspondence_city", city ?? "", { shouldValidate: false });
      setValue("correspondence_state", state ?? "", { shouldValidate: false });
      setValue("correspondence_postal_code", postal_code ?? "", {
        shouldValidate: false,
      });
      setValue("correspondence_country", country ?? null, {
        shouldValidate: false,
      });
      clearErrors([
        "correspondence_address_line1",
        "correspondence_address_line2",
        "correspondence_city",
        "correspondence_state",
        "correspondence_postal_code",
        "correspondence_country",
      ]);
    }
  }, [isSameCorr, getValues, setValue, clearErrors]);

  // convenience watchers for conditional UI
  const attendingPreschool = watch("attending_preschool");
  const previousKG = watch("previously_registered_kg");
  const hasSiblingsHere = watch("siblings_in_this_school");
  const hasSiblingsOther = watch("siblings_in_other_schools");
  const regOtherTransport = watch("regular_transport");
  const altOtherTransport = watch("alternate_transport");
  const lifeThreatAllergy = watch("life_threat_allergy");
  const emergencyKit = watch("emergency_kit_recommended");

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
    payload.correspondence_country = normalizeCountry(
      payload.correspondence_country,
    );

    // Convert dates
    payload.registration_date = payload.registration_date
      ? new Date(payload.registration_date).toISOString()
      : null;
    payload.birth_date = payload.birth_date
      ? new Date(payload.birth_date).toISOString()
      : null;
    payload.signature_date = payload.signature_date
      ? new Date(payload.signature_date).toISOString()
      : null;

    // demo async so isSubmitting shows; replace with your API call
    await new Promise((r) => setTimeout(r, 600));
    console.log(payload);
    toast("Registration saved.", { invert: true });
    reset(initialState);
  };

  return (
    <Page title="Registration Form">

      <div className="transition-content px-(--margin-x) pb-6">
        {/* Header */}
        <div className="py-6 text-center">
          <h1 className="dark:text-dark-50 text-2xl font-semibold text-gray-800">
            My School ITALY
          </h1>
          <p className="text-sm text-gray-500">
            The Neuroscientific European Preschool
          </p>
          <p className="mt-1 text-base font-medium text-gray-700">
            REGISTRATION FORM
          </p>

        </div>
        <div className="flex items-center justify-between py-2">
{/* ===== Registration Overview (place BEFORE the Student Registration header) ===== */}
<Card className="mb-4 p-4 sm:px-5">
  <div className="mb-3 flex items-center gap-2">
    <DocumentPlusIcon className="size-5 text-primary-600 dark:text-primary-400" />
    <h2 className="text-base font-semibold text-gray-800 dark:text-dark-50">
      Registration Overview — 2024–25
    </h2>
  </div>

  {/* Eligibility */}
  <div className="mt-2">
    <div className="mb-1 flex items-center gap-2">
      <AcademicCapIcon className="size-4 text-primary-600 dark:text-primary-400" />
      <span className="text-sm font-medium text-gray-800 dark:text-dark-100">Eligibility</span>
    </div>
    <ul className="mt-1 space-y-1">
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          A child born on/before <strong>1/4/2021</strong> is eligible for <strong>Nursery</strong> in 2024–25.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          A child born on/before <strong>1/4/2020</strong> is eligible for <strong>K-1</strong> in 2024–25.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          A child born on/before <strong>1/4/2019</strong> is eligible for <strong>K-2</strong> in 2024–25.
        </span>
      </li>
    </ul>
  </div>

  {/* Steps to register */}
  <div className="mt-4">
    <div className="mb-1 flex items-center gap-2">
      <DocumentPlusIcon className="size-4 text-primary-600 dark:text-primary-400" />
      <span className="text-sm font-medium text-gray-800 dark:text-dark-100">To register, you will need to:</span>
    </div>
    <ul className="mt-1 space-y-1">
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Fill out the registration forms.</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Make a registration appointment.</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          Bring all required documents on your assigned appointment date.
        </span>
      </li>
    </ul>
  </div>

  {/* Forms to complete */}
  <div className="mt-4">
    <div className="mb-1 flex items-center gap-2">
      <DocumentPlusIcon className="size-4 text-primary-600 dark:text-primary-400" />
      <span className="text-sm font-medium text-gray-800 dark:text-dark-100">Forms to complete (5):</span>
    </div>
    <ul className="mt-1 space-y-1">
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Registration Form</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Health Form*</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Oral Form*</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Privacy Form</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">Waiver of Liability Form</span>
      </li>
    </ul>
    <div className="mt-2 rounded-md bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
      * The <strong>Health Form</strong> and <strong>Oral Form</strong> must be completed by the child’s doctor and dentist and
      submitted before school starts. Physical exams for 2024–25 registrants must be done after <strong>June 1, 2024</strong>.
    </div>
  </div>

  {/* Documents required */}
  <div className="mt-4">
    <div className="mb-1 flex items-center gap-2">
      <BriefcaseIcon className="size-4 text-primary-600 dark:text-primary-400" />
      <span className="text-sm font-medium text-gray-800 dark:text-dark-100">Documents to bring:</span>
    </div>
    <ul className="mt-1 space-y-1">
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          Original Birth Certificate and a <strong>photocopy</strong> (for office use).
        </span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          Immunisation Record — current to date from your child’s doctor, plus a <strong>photocopy</strong>.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
        <span className="text-sm text-gray-700 dark:text-dark-100">
          Proof of Residence (<strong>Aadhaar Card of parents</strong>) and a <strong>photocopy</strong>.
        </span>
      </li>
    </ul>
  </div>
</Card>

</div>


        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-6" />
            <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">
              Student Registration
            </h2>
          </div>
          <Button
            className="min-w-[7rem]"
            color="primary"
            type="submit"
            form="registration-form"
            disabled={isSubmitting || !isValid}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircleIcon className="size-4" />
              {isSubmitting ? "Saving..." : "Save"}
            </span>
          </Button>
        </div>

        <form
          id="registration-form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
            {/* Registration channel / Date */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-2 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={DocumentPlusIcon}>
                        Student being registered
                      </LabelWithIcon>
                    </label>
                    {/* Radios share the same register name so only one can be checked */}
                    <div className="flex gap-6">
                      <Radio
                        label="By post"
                        value="by_post"
                        {...register("registration_channel")}
                      />
                      <Radio
                        label="In person"
                        value="in_person"
                        {...register("registration_channel")}
                      />
                    </div>
                    {errors?.registration_channel && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.registration_channel.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Controller
                      name="registration_date"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <DatePicker
                          label={
                            <LabelWithIcon icon={CalendarDaysIcon}>
                              Date
                            </LabelWithIcon>
                          }
                          value={value ?? null}
                          onChange={onChange}
                          options={{
                            disableMobile: true,
                            dateFormat: "d/m/Y",
                            maxDate: "today",
                          }}
                          placeholder="dd/mm/yyyy"
                          error={errors?.registration_date?.message}
                          {...rest}
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Pre-school / Kindergarten / Siblings */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="grid grid-cols-12 gap-4">
                  {/* Attending Pre-school */}
                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={AcademicCapIcon}>
                        Attending Pre-school?
                      </LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        label="Yes"
                        value="yes"
                        {...register("attending_preschool")}
                      />
                      <Radio
                        label="No"
                        value="no"
                        {...register("attending_preschool")}
                      />
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

                  {/* Previously registered for kindergarten */}
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

                  {/* Siblings in this school */}
                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={UserGroupIcon}>
                        Siblings in this school?
                      </LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        label="Yes"
                        value="yes"
                        {...register("siblings_in_this_school")}
                      />
                      <Radio
                        label="No"
                        value="no"
                        {...register("siblings_in_this_school")}
                      />
                    </div>
                    <Collapse in={hasSiblingsHere === "yes"}>
                      <div className="mt-3">
                        <Input
                          label={
                            <LabelWithIcon icon={UserGroupIcon}>
                              If yes, name
                            </LabelWithIcon>
                          }
                          {...register("siblings_this_school_name")}
                          error={errors?.siblings_this_school_name?.message}
                        />
                      </div>
                    </Collapse>
                  </div>

                  {/* Siblings in other schools */}
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
                          label={
                            <LabelWithIcon icon={UserGroupIcon}>
                              If yes, name
                            </LabelWithIcon>
                          }
                          {...register("siblings_other_school_name")}
                          error={errors?.siblings_other_school_name?.message}
                        />
                      </div>
                    </Collapse>
                  </div>

                  {/* Note */}
                  <div className="col-span-12">
                    <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                      Note: Personal information on registration will be
                      confirmed with parents prior to the start of school in
                      June.
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Student Identification */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="text-primary-600 dark:text-primary-400 size-5" />
                  <h3 className="text-base font-medium">
                    Student Identification
                  </h3>
                </div>
                <div className="mt-4 grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={UserGroupIcon}>
                          Legal Last Name
                        </LabelWithIcon>
                      }
                      {...register("legal_last_name")}
                      error={errors?.legal_last_name?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={UserGroupIcon}>
                          Legal Middle Name
                        </LabelWithIcon>
                      }
                      {...register("legal_middle_name")}
                      error={errors?.legal_middle_name?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Controller
                      name="birth_date"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <DatePicker
                          label={
                            <LabelWithIcon icon={CalendarDaysIcon}>
                              Birth Date (dd/mm/yyyy)
                            </LabelWithIcon>
                          }
                          value={value ?? null}
                          onChange={onChange}
                          options={{
                            disableMobile: true,
                            dateFormat: "d/m/Y",
                            maxDate: "today",
                          }}
                          placeholder="dd/mm/yyyy"
                          error={errors?.birth_date?.message}
                          {...rest}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={UserGroupIcon}>Gender</LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        label="Male"
                        value="male"
                        {...register("gender")}
                      />
                      <Radio
                        label="Female"
                        value="female"
                        {...register("gender")}
                      />
                    </div>
                    {errors?.gender && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Transportation */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <BuildingOfficeIcon className="text-primary-600 dark:text-primary-400 size-5" />
                  <h3 className="text-base font-medium">Transportation</h3>
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4">
                  {/* Regular */}
                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={BuildingOffice2Icon}>
                        REGULAR Transportation
                      </LabelWithIcon>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        value="bus"
                        label="Bus"
                        {...register("regular_transport")}
                      />
                      <Radio
                        value="walk"
                        label="Walk"
                        {...register("regular_transport")}
                      />
                      <Radio
                        value="other"
                        label="Other"
                        {...register("regular_transport")}
                      />
                    </div>
                    <Collapse in={regOtherTransport === "other"}>
                      <div className="mt-3">
                        <Input
                          label={
                            <LabelWithIcon icon={HashtagIcon}>
                              Other (specify)
                            </LabelWithIcon>
                          }
                          {...register("regular_transport_other")}
                          error={errors?.regular_transport_other?.message}
                        />
                      </div>
                    </Collapse>
                  </div>

                  {/* Alternate */}
                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={BuildingOffice2Icon}>
                        ALTERNATE Transportation
                      </LabelWithIcon>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        value="bus"
                        label="Bus"
                        {...register("alternate_transport")}
                      />
                      <Radio
                        value="walk"
                        label="Walk"
                        {...register("alternate_transport")}
                      />
                      <Radio
                        value="other"
                        label="Other"
                        {...register("alternate_transport")}
                      />
                    </div>
                    <Collapse in={altOtherTransport === "other"}>
                      <div className="mt-3">
                        <Input
                          label={
                            <LabelWithIcon icon={HashtagIcon}>
                              Other (specify)
                            </LabelWithIcon>
                          }
                          {...register("alternate_transport_other")}
                          error={errors?.alternate_transport_other?.message}
                        />
                      </div>
                    </Collapse>
                  </div>

                  <div className="col-span-12">
                    <Textarea
                      label={
                        <LabelWithIcon icon={MapPinIcon}>
                          Other transportation information (if any)
                        </LabelWithIcon>
                      }
                      {...register("transport_other_info")}
                      error={errors?.transport_other_info?.message}
                    />
                  </div>

                  <div className="col-span-12">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={MegaphoneIcon}>
                        Has child received speech therapy?
                      </LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        label="Yes"
                        value="yes"
                        {...register("speech_therapy")}
                      />
                      <Radio
                        label="No"
                        value="no"
                        {...register("speech_therapy")}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Demographics — Home Address (Civic + Mailing) */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <HomeIcon className="text-primary-600 dark:text-primary-400 size-5" />
                  <h3 className="text-base font-medium">
                    Demographics — Home Address (Civic + Mailing)
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <Input
                      label={
                        <LabelWithIcon icon={UserGroupIcon}>
                          Parent/Guardian – Name(s)
                        </LabelWithIcon>
                      }
                      {...register("pg_names")}
                      error={errors?.pg_names?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <Input
                      label={<LabelWithIcon icon={HomeIcon}>Apt</LabelWithIcon>}
                      {...register("home_apt")}
                      error={errors?.home_apt?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <Input
                      label={
                        <LabelWithIcon icon={MapPinIcon}>
                          Street/Road
                        </LabelWithIcon>
                      }
                      {...register("home_street")}
                      error={errors?.home_street?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          City (mailing)
                        </LabelWithIcon>
                      }
                      {...register("mailing_city")}
                      error={errors?.mailing_city?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <Input
                      label={
                        <LabelWithIcon icon={HashtagIcon}>
                          Postal Code (mailing)
                        </LabelWithIcon>
                      }
                      {...register("mailing_postal")}
                      error={errors?.mailing_postal?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          City (civic)
                        </LabelWithIcon>
                      }
                      {...register("civic_city")}
                      error={errors?.civic_city?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <Input
                      label={
                        <LabelWithIcon icon={HashtagIcon}>
                          Postal Code (civic)
                        </LabelWithIcon>
                      }
                      {...register("civic_postal")}
                      error={errors?.civic_postal?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={HomeIcon}>House</LabelWithIcon>
                      }
                      {...register("civic_house")}
                      error={errors?.civic_house?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={HomeIcon}>PO Box</LabelWithIcon>
                      }
                      {...register("civic_po_box")}
                      error={errors?.civic_po_box?.message}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Demographics — Alternate Home Address (Shared Custody) */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="dark:text-dark-100 mb-2 text-sm text-gray-700">
                  Demographics — Alternate Home Address (Shared Custody) — Civic
                  + Mailing
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <Input
                      label={
                        <LabelWithIcon icon={UserGroupIcon}>
                          Parent/Guardian – Name(s)
                        </LabelWithIcon>
                      }
                      {...register("alt_pg_names")}
                      error={errors?.alt_pg_names?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <Input
                      label={<LabelWithIcon icon={HomeIcon}>Apt</LabelWithIcon>}
                      {...register("alt_home_apt")}
                      error={errors?.alt_home_apt?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <Input
                      label={
                        <LabelWithIcon icon={MapPinIcon}>
                          Street/Road
                        </LabelWithIcon>
                      }
                      {...register("alt_home_street")}
                      error={errors?.alt_home_street?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          City (mailing)
                        </LabelWithIcon>
                      }
                      {...register("alt_mailing_city")}
                      error={errors?.alt_mailing_city?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <Input
                      label={
                        <LabelWithIcon icon={HashtagIcon}>
                          Postal Code (mailing)
                        </LabelWithIcon>
                      }
                      {...register("alt_mailing_postal")}
                      error={errors?.alt_mailing_postal?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          City (civic)
                        </LabelWithIcon>
                      }
                      {...register("alt_civic_city")}
                      error={errors?.alt_civic_city?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <Input
                      label={
                        <LabelWithIcon icon={HashtagIcon}>
                          Postal Code (civic)
                        </LabelWithIcon>
                      }
                      {...register("alt_civic_postal")}
                      error={errors?.alt_civic_postal?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={HomeIcon}>House</LabelWithIcon>
                      }
                      {...register("alt_civic_house")}
                      error={errors?.alt_civic_house?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={HomeIcon}>PO Box</LabelWithIcon>
                      }
                      {...register("alt_civic_po_box")}
                      error={errors?.alt_civic_po_box?.message}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Early Closure Destination */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="dark:text-dark-100 mb-2 text-sm text-gray-700">
                  Demographics — Address Information — Early Closure Destination
                  (if different from usual after school destination)
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label={
                        <LabelWithIcon icon={UserGroupIcon}>Name</LabelWithIcon>
                      }
                      {...register("early_closure_name")}
                      error={errors?.early_closure_name?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label={
                        <LabelWithIcon icon={UserGroupIcon}>
                          Relationship
                        </LabelWithIcon>
                      }
                      {...register("early_closure_relationship")}
                      error={errors?.early_closure_relationship?.message}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Contacts */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="text-primary-600 dark:text-primary-400 size-5" />
                  <h3 className="text-base font-medium">
                    Demographics — Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <ContactRow
                    title="Father"
                    prefix="father"
                    register={register}
                    errors={errors}
                  />
                  <ContactRow
                    title="Mother"
                    prefix="mother"
                    register={register}
                    errors={errors}
                  />
                  <ContactRow
                    title="Guardian"
                    prefix="guardian"
                    register={register}
                    errors={errors}
                  />
                  <ContactRow
                    title="After school"
                    prefix="after_school"
                    register={register}
                    errors={errors}
                  />
                  <ContactRow
                    title="Early Closure"
                    prefix="ec"
                    register={register}
                    errors={errors}
                  />
                  <ContactRow
                    title="Emergency"
                    prefix="emergency"
                    register={register}
                    errors={errors}
                  />

                  <div className="col-span-12">
                    <Textarea
                      label={
                        <LabelWithIcon icon={MegaphoneIcon}>
                          Other contact information the school should be aware
                          of (if any)
                        </LabelWithIcon>
                      }
                      {...register("other_contact_info")}
                      error={errors?.other_contact_info?.message}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label={
                        <LabelWithIcon icon={EnvelopeIcon}>
                          Parent E-mail to communicate
                        </LabelWithIcon>
                      }
                      inputMode="email"
                      autoComplete="email"
                      {...register("parent_comm_email")}
                      error={errors?.parent_comm_email?.message}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Custody / Lives With */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={UserGroupIcon}>
                        Custody (check one)
                      </LabelWithIcon>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        value="father"
                        label="Father"
                        {...register("custody")}
                      />
                      <Radio
                        value="mother"
                        label="Mother"
                        {...register("custody")}
                      />
                      <Radio
                        value="legal_guardian"
                        label="Legal Guardian"
                        {...register("custody")}
                      />
                    </div>
                    {errors?.custody && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.custody.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={UserGroupIcon}>
                        Lives With (check one)
                      </LabelWithIcon>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        value="parents_together"
                        label="Parents Together"
                        {...register("lives_with")}
                      />
                      <Radio
                        value="parents_separately"
                        label="Parents Separately"
                        {...register("lives_with")}
                      />
                      <Radio
                        value="father"
                        label="Father"
                        {...register("lives_with")}
                      />
                      <Radio
                        value="mother"
                        label="Mother"
                        {...register("lives_with")}
                      />
                      <Radio
                        value="legal_guardian"
                        label="Legal Guardian"
                        {...register("lives_with")}
                      />
                    </div>
                    {errors?.lives_with && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.lives_with.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Medical Information */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <MegaphoneIcon className="text-primary-600 dark:text-primary-400 size-5" />
                  <h3 className="text-base font-medium">Medical Information</h3>
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4">
                  {/* Allergy -> yes/no */}
                  <div className="col-span-12">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={MegaphoneIcon}>
                        Life-threatening allergy to foods, insect venom,
                        medication, or other material?
                      </LabelWithIcon>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        label="Yes"
                        value="yes"
                        {...register("life_threat_allergy")}
                      />
                      <Radio
                        label="No"
                        value="no"
                        {...register("life_threat_allergy")}
                      />
                    </div>
                  </div>

                  {/* Allergy -> details (full width collapse) */}
                  <div className="col-span-12">
                    <Collapse
                      in={lifeThreatAllergy === "yes"}
                      className="block w-full"
                    >
                      <div className="mt-3">
                        <Textarea
                          label={
                            <LabelWithIcon icon={HashtagIcon}>
                              Indicate the substance(s)
                            </LabelWithIcon>
                          }
                          rows={1} // taller box so it doesn’t look cramped
                          {...register("allergy_substances")}
                          error={errors?.allergy_substances?.message}
                        />
                      </div>
                    </Collapse>
                  </div>

                  {/* Emergency kit -> yes/no */}
                  <div className="col-span-12">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={MegaphoneIcon}>
                        Has a medical doctor recommended an emergency medical
                        kit at school?
                      </LabelWithIcon>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        label="Yes"
                        value="yes"
                        {...register("emergency_kit_recommended")}
                      />
                      <Radio
                        label="No"
                        value="no"
                        {...register("emergency_kit_recommended")}
                      />
                    </div>
                  </div>

                  {/* Emergency kit -> details (full width collapse) */}
                  <div className="col-span-12">
                    <Collapse
                      in={emergencyKit === "yes"}
                      className="block w-full"
                    >
                      <div className="mt-3">
                        <Input
                          label={
                            <LabelWithIcon icon={PencilSquareIcon}>
                              Kit details (if any)
                            </LabelWithIcon>
                          }
                          {...register("emergency_kit_details")}
                          error={errors?.emergency_kit_details?.message}
                        />
                      </div>
                    </Collapse>
                  </div>

                  {/* Serious medical conditions */}
                  <div className="col-span-12 md:col-span-6">
                    <Textarea
                      label={
                        <LabelWithIcon icon={MegaphoneIcon}>
                          Serious medical condition(s)
                        </LabelWithIcon>
                      }
                      rows={1}
                      {...register("serious_medical_conditions")}
                      error={errors?.serious_medical_conditions?.message}
                    />
                  </div>

                  {/* Info pertaining to serious condition(s) */}
                  <div className="col-span-12 md:col-span-6">
                    <Textarea
                      label={
                        <LabelWithIcon icon={MegaphoneIcon}>
                          Information pertaining to serious condition(s)
                        </LabelWithIcon>
                      }
                      rows={1}
                      {...register("serious_medical_info")}
                      error={errors?.serious_medical_info?.message}
                    />
                  </div>

                  {/* Other medical info */}
                  <div className="col-span-12">
                    <Textarea
                      label={
                        <LabelWithIcon icon={MegaphoneIcon}>
                          Other medical information the school should be aware
                          of
                        </LabelWithIcon>
                      }
                      rows={1}
                      {...register("other_medical_info")}
                      error={errors?.other_medical_info?.message}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Emergency kit -> details */}
            <div className="col-span-12">
              <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                <LabelWithIcon icon={MegaphoneIcon}>
                  Has a medical doctor recommended an emergency medical kit at
                  school?
                </LabelWithIcon>
              </label>
              <div className="flex gap-6">
                <Radio
                  label="Yes"
                  value="yes"
                  {...register("emergency_kit_recommended")}
                />
                <Radio
                  label="No"
                  value="no"
                  {...register("emergency_kit_recommended")}
                />
              </div>
            </div>

            <div className="col-span-12">
              <Collapse in={emergencyKit === "yes"}>
                <div className="mt-3">
                  <Input
                    label={
                      <LabelWithIcon icon={PencilSquareIcon}>
                        Kit details (if any)
                      </LabelWithIcon>
                    }
                    {...register("emergency_kit_details")}
                    error={errors?.emergency_kit_details?.message}
                  />
                </div>
              </Collapse>
            </div>

            {/* Other Information (Languages) */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="text-primary-600 dark:text-primary-400 size-5" />
                  <h3 className="text-base font-medium">Other Information</h3>
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          Language most often spoken by adults at home
                        </LabelWithIcon>
                      }
                      {...register("lang_adults_home")}
                      error={errors?.lang_adults_home?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          Language most frequently used with child
                        </LabelWithIcon>
                      }
                      {...register("lang_with_child")}
                      error={errors?.lang_with_child?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input
                      label={
                        <LabelWithIcon icon={GlobeAltIcon}>
                          Language first learned
                        </LabelWithIcon>
                      }
                      {...register("lang_first_learned")}
                      error={errors?.lang_first_learned?.message}
                    />
                  </div>

                  <div className="col-span-12">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={GlobeAltIcon}>
                        Is child able to understand almost everything said in
                        home language?
                      </LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        label="Yes"
                        value="yes"
                        {...register("home_lang_understand")}
                      />
                      <Radio
                        label="No"
                        value="no"
                        {...register("home_lang_understand")}
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={AcademicCapIcon}>
                        Reading ability in English
                      </LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        value="none"
                        label="Does not read it"
                        {...register("read_english")}
                      />
                      <Radio
                        value="little"
                        label="Reads it a little"
                        {...register("read_english")}
                      />
                      <Radio
                        value="well"
                        label="Reads it well"
                        {...register("read_english")}
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
                      <LabelWithIcon icon={AcademicCapIcon}>
                        Writing ability in English
                      </LabelWithIcon>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        value="none"
                        label="Does not write it"
                        {...register("write_english")}
                      />
                      <Radio
                        value="little"
                        label="Writes it a little"
                        {...register("write_english")}
                      />
                      <Radio
                        value="well"
                        label="Writes it well"
                        {...register("write_english")}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Signature */}
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label={
                        <LabelWithIcon icon={PencilSquareIcon}>
                          Signature of Custodial Parent
                        </LabelWithIcon>
                      }
                      {...register("custodial_parent_signature")}
                      error={errors?.custodial_parent_signature?.message}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Controller
                      name="signature_date"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <DatePicker
                          label={
                            <LabelWithIcon icon={CalendarDaysIcon}>
                              Date
                            </LabelWithIcon>
                          }
                          value={value ?? null}
                          onChange={onChange}
                          options={{
                            disableMobile: true,
                            dateFormat: "d/m/Y",
                            maxDate: "today",
                          }}
                          placeholder="dd/mm/yyyy"
                          error={errors?.signature_date?.message}
                          {...rest}
                        />
                      )}
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
}

export default StudentRegistrationForm;
