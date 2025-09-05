import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import {
  DocumentPlusIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { schema } from "./schema";
import { initialState } from "./data";
import { getDialFromCountry, normalizeCountry } from "./utils";

// Sections
import StudentDetails from "./sections/StudentDetails";
import PreviousSchoolInfo from "./sections/PreviousSchoolInfo";
import AddressSection from "./sections/AddressSection";
import ParentGuardianDetails from "./sections/ParentGuardianDetails";
import MotherDetails from "./sections/MotherDetails";
import MarketingConsent from "./sections/MarketingConsent";
import PreviewModal from "./components/PreviewModal";

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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewValues, setPreviewValues] = useState(null);

  const selectedCountry = watch("country");
  const isSame = watch("isSameCorrespondenceAddress");
  const studentDial = watch("student_dialCode");
  const parentDial = watch("parent_dialCode");
  const motherDial = watch("mother_dialCode");

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
  }, [
    selectedCountry,
    studentDial,
    parentDial,
    motherDial,
    setValue,
    clearErrors,
  ]);

  useEffect(() => {
    if (!isSame) return;

    const addressFields = [
      "address_line1",
      "address_line2",
      "city",
      "state",
      "postal_code",
      "country",
    ];

    addressFields.forEach((field) => {
      setValue(`correspondence_${field}`, getValues(field) ?? "", {
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

  const onSubmit = async (data) => {
    const payload = { ...data };

    if (payload.isSameCorrespondenceAddress) {
      payload.correspondence_address_line1 = payload.address_line1 ?? "";
      payload.correspondence_address_line2 = payload.address_line2 ?? "";
      payload.correspondence_city = payload.city ?? "";
      payload.correspondence_state = payload.state ?? "";
      payload.correspondence_postal_code = payload.postal_code ?? "";
      payload.correspondence_country = payload.country ?? null;
    }

    payload.country = normalizeCountry(payload.country);
    payload.correspondence_country = normalizeCountry(payload.correspondence_country);

    try {
      await new Promise((r) => setTimeout(r, 600));
      console.log("📤 Submitting Payload:", payload);
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
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              onClick={() => {
                setPreviewValues(getValues());
                setPreviewOpen(true);
              }}
            >
              <span className="inline-flex items-center gap-2">
                <EyeIcon className="size-4" />
                Preview
              </span>
            </Button>

            <Button
              className="min-w-[7rem]"
              color="primary"
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                const isValid = await methods.trigger();
                const errors = methods.formState.errors;

                const fieldLabels = {
                  studentFirstName: "Student First Name",
                  studentMiddleName: "Student Middle Name",
                  studentLastName: "Student Last Name",
                  dob: "Date of Birth",
                  genderId: "Gender",
                  admissionCourseId: "Grade Applying For",
                  prevSchoolName: "Previous School Name",
                  fromCourseId: "From Grade",
                  fromYear: "From Year",
                  toCourseId: "To Grade",
                  toYear: "To Year",
                  address_line1: "Address Line 1",
                  city: "City",
                  state: "State",
                  postal_code: "Postal Code",
                  country: "Country",
                  correspondence_address_line1: "Correspondence Address Line 1",
                  correspondence_city: "Correspondence City",
                  correspondence_state: "Correspondence State",
                  correspondence_postal_code: "Correspondence Postal Code",
                  correspondence_country: "Correspondence Country",
                  parentFirstName: "Parent First Name",
                  parentPhone: "Parent Mobile Number",
                  parentEmail: "Parent Email",
                  parentQualification: "Parent Qualification",
                  parentProfession: "Parent Profession",
                  motherFirstName: "Mother First Name",
                  motherPhone: "Mother Mobile Number",
                  motherEmail: "Mother Email",
                  motherQualification: "Mother Qualification",
                  motherProfession: "Mother Profession",
                  heard_about_us: "Heard About Us",
                  signature: "E-Signature",
                };

                if (!isValid) {
                  const missingFields = Object.entries(errors).map(([key, val]) => ({
                    Field: fieldLabels[key] || key,
                    Reason: val?.message || "Required",
                  }));

                  console.clear();
                  console.warn("🚨 Form submission blocked due to missing fields:");
                  console.table(missingFields);
                  toast.error("Please fill all required fields");

                  scrollToFirstError();
                } else {
                  console.log("✅ All validations passed. Submitting form...");
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
              <StudentDetails />
              <PreviousSchoolInfo />
              <AddressSection />
              <ParentGuardianDetails />
              <MotherDetails />
              <MarketingConsent />
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        values={previewValues}
        onClose={() => setPreviewOpen(false)}
      />
    </Page>
  );
}
