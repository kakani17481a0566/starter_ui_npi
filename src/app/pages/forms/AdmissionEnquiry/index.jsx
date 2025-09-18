import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { getSessionData } from "utils/sessionStorage";

import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import {
  DocumentPlusIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { schema } from "./schema";
import { initialState } from "./data";
import { getDialFromCountry, normalizeCountry } from "./utils";
import { submitAdmissionEnquiry } from "./PostData";

// Sections
import StudentDetails from "./sections/StudentDetails";
import PreviousSchoolInfo from "./sections/PreviousSchoolInfo";
import AddressSection from "./sections/AddressSection";
import ParentGuardianDetails from "./sections/ParentGuardianDetails";
import MotherDetails from "./sections/MotherDetails";
import MarketingConsent from "./sections/MarketingConsent";

export default function AdmissionEnquiryForm() {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors,
    getValues,
  } = methods;

  const selectedCountry = watch("country");
  const isSame = watch("isSameCorrespondenceAddress");
  const studentDial = watch("student_dialCode");
  const parentDial = watch("parent_dialCode");
  const motherDial = watch("mother_dialCode");
  const { tenantId, userId } = getSessionData();

  // --- helpers ---
  const asInt = (v) => (v === "" || v == null ? null : Number(v));
  const toYearNum = (v) =>
    v == null ? null : v instanceof Date ? v.getFullYear() : Number(v);
  const getId = (v) => (v && typeof v === "object" ? asInt(v.id) : asInt(v));
  const makeE164 = (dial, number) => {
    const d = (dial ?? "").toString().replace(/\D/g, "");
    const n = (number ?? "").toString().replace(/\D/g, "");
    return d || n ? `+${d}${n}` : "";
  };

  // Map RHF values -> API payload
  function mapFormToApi(values) {
    const dobIso = values?.dob ? new Date(values.dob).toISOString() : null;

    // Mirror correspondence when 'same' is checked
    const corr = values.isSameCorrespondenceAddress
      ? {
          address_line1: values.address_line1 ?? "",
          address_line2: values.address_line2 ?? "",
          city: values.city ?? "",
          state: values.state ?? "",
          postal_code: values.postal_code ?? "",
          country: values.country ?? null,
        }
      : {
          address_line1: values.correspondence_address_line1 ?? "",
          address_line2: values.correspondence_address_line2 ?? "",
          city: values.correspondence_city ?? "",
          state: values.correspondence_state ?? "",
          postal_code: values.correspondence_postal_code ?? "",
          country: values.correspondence_country ?? null,
        };

    return {
      // Student
      studentFirstName: values.student_first_name?.trim() ?? "",
      studentMiddleName: values.student_middle_name ?? "",
      studentLastName: values.student_last_name?.trim() ?? "",
      dob: dobIso,
      genderId: asInt(values.gender_id),
      admissionCourseId: asInt(values.admission_course_id),

      // Previous school
      prevSchoolName: values.prev_school_name ?? "",
      fromCourseId: asInt(values.from_course_id),
      fromYear: toYearNum(values.from_year),
      toCourseId: asInt(values.to_course_id),
      toYear: toYearNum(values.to_year),

      // Guardian/Parent
      isGuardian: Boolean(values.is_guardian),
      parentFirstName: values.parent_first_name?.trim() ?? "",
      parentMiddleName: values.parent_middle_name ?? "",
      parentLastName: values.parent_last_name?.trim() ?? "",
      parentPhone: makeE164(values.parent_dialCode, values.parent_phone),
      parentAlternatePhone: makeE164(
        values.parent_dialCode,
        values.parent_alternate_phone,
      ),
      parentEmail: values.parent_email ?? "",

      // Address
      parentAddress1: values.address_line1 ?? "",
      parentAddress2: values.address_line2 ?? "",
      parentCity: values.city ?? "",
      parentState: values.state ?? "",
      parentPincode: values.postal_code ?? "",
      motherQualification: values.mother_qualification ?? "",
      motherProfession: values.mother_profession ?? "",

      // Mother
      motherFirstName: values.mother_first_name?.trim() ?? "",
      motherMiddleName: values.mother_middle_name ?? "",
      motherLastName: values.mother_last_name?.trim() ?? "",
      motherPhone: makeE164(values.mother_dialCode, values.mother_phone),
      motherEmail: values.mother_email ?? "",
      parentQualification: values.parent_qualification ?? "",
      parentProfession: values.parent_profession ?? "",

      // Marketing & Consent
      hearAboutUsTypeId: getId(
        values.heard_about_us_type_id ?? values.hear_about_us_type_id,
      ),
      isAgreedToTerms: Boolean(values.is_agreed_to_terms),
      signature: values.signature ?? "",
      // Meta
      statusId: 204,
      tenantId: tenantId,
      branchId: asInt(values.branch_id),
      createdBy: userId,

      // Countries
      country: normalizeCountry(values.country),
      correspondence_country: normalizeCountry(corr.country),
    };
  }

  // Autofill dial codes
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
  }, [selectedCountry, studentDial, parentDial, motherDial, setValue, clearErrors]);

  // Mirror correspondence
  useEffect(() => {
    if (!isSame) return;

    const fields = ["address_line1", "address_line2", "city", "state", "postal_code", "country"];
    fields.forEach((f) => {
      setValue(`correspondence_${f}`, getValues(f) ?? "", {
        shouldValidate: false,
      });
    });

    clearErrors([
      "correspondence_address_line1",
      "correspondence_address_line2",
      "correspondence_city",
      "correspondence_state",
      "correspondence_postal_code",
      "correspondence_country",
    ]);
  }, [isSame, getValues, setValue, clearErrors]);

  const onSubmit = async (values) => {
    try {
      const apiPayload = mapFormToApi(values);
      console.log("📦 API Payload:", apiPayload);
      const result = await submitAdmissionEnquiry(apiPayload);
      console.log("✅ API Response:", result);
      toast.success("Enquiry saved successfully");
      reset(initialState);
    } catch (error) {
      console.error("❌ Submission error:", error);
      toast.error("Failed to submit enquiry");
    }
  };

  function scrollToFirstError() {
    const errorField = document.querySelector("[aria-invalid='true']");
    if (errorField) {
      errorField.scrollIntoView({ behavior: "smooth", block: "center" });
      errorField.focus?.();
    }
  }

  return (
    <Page title="Student Enquiry Form">
      {/* Sticky Footer */}
      <footer className="dark:bg-dark-900 dark:border-dark-600 sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_8px_-2px_rgba(0,0,0,0.1)] sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-6" />
            <h2 className="dark:text-dark-50 text-xl font-medium text-gray-700">
              Student Enquiry Form
            </h2>
          </div>
          <div className="flex gap-2">
            {/* Cancel button */}
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              onClick={() => reset(initialState)}
            >
              Cancel
            </Button>

            <Button
              className="min-w-[7rem]"
              color="primary"
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                const isValid = await methods.trigger();
                const errors = methods.formState.errors;
                console.log(errors)

                if (!isValid) {
                  toast.error("Please fill all required fields");
                  scrollToFirstError();
                } else {
                  handleSubmit(onSubmit)();
                }
              }}
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircleIcon className="size-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </span>
            </Button>
          </div>
        </div>
      </footer>

      {/* Main Form Body */}
      <div className="transition-content px-4 pb-36 sm:px-6 lg:px-8">
        <FormProvider {...methods}>
          <form
            id="enquiry-form"
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
              {/* Student (left) + Previous School (right) */}
              <div className="col-span-12">
                <Card className="p-4 sm:px-5">
                  <h3 className="dark:text-dark-100 mb-4 text-base font-medium text-gray-800">
                    Student Details &amp; Previous School
                  </h3>
                  <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
                    <div className="col-span-12 lg:col-span-6">
                      <StudentDetails />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <PreviousSchoolInfo />
                    </div>
                  </div>
                </Card>
              </div>

              <AddressSection />

              <div className="col-span-12">
                <Card className="p-4 sm:px-5 border ">
                  <h3 className="dark:text-dark-100 mb-4 text-base font-medium text-gray-800">
                    Parent / Guardian &amp; Mother Details
                  </h3>
                  <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 ">
                    <div className="col-span-12 lg:col-span-6">
                      <ParentGuardianDetails />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <MotherDetails />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Marketing stays standalone */}
              <MarketingConsent />
            </div>
          </form>
        </FormProvider>
      </div>
    </Page>
  );
}
