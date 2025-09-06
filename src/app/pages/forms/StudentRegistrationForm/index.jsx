// src/app/pages/forms/StudentRegistrationForm/index.jsx

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";
import { toast } from "sonner";

import { initialState } from "./data";
import { schema } from "./schema";

import { Page } from "components/shared/Page";
import { Button, Card, Radio } from "components/ui";
import {
  CheckCircleIcon,
  DocumentPlusIcon,
  CalendarDaysIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "components/shared/form/Datepicker";

import { Stepper } from "./Stepper";

// Sections
import RegistrationOverview from "./sections/RegistrationOverview";
import StudentDetailsSection from "./sections/StudentDetailsSection";
import AddressSection from "./sections/AddressSection";
import TransportationSection from "./sections/TransportationSection";
import ContactSection from "./sections/ContactSection";
import MedicalInfoSection from "./sections/MedicalInfoSection";
import OtherInfoSection from "./sections/OtherInfoSection";
import SignatureSection from "./sections/SignatureSection";
import DocumentUploadSection from "./sections/DocumentUploadSection";
import PrivacyFormSection from "./sections/PrivacyFormSection";

/* ---------- Inline component for overview ---------- */
function ChannelDateFields() {
  const { control, register, formState: { errors } } = useFormContext();
  return (
    <Card className="p-4 sm:px-5">
      <div className="grid grid-cols-12 gap-4">
        {/* Channel */}
        <div className="col-span-12 md:col-span-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">
            Registration Channel
          </label>
          <div className="flex flex-wrap gap-6">
            <Radio label="By post" value="by_post" {...register("registration_channel")} />
            <Radio label="In person" value="in_person" {...register("registration_channel")} />
            <Radio label="Online" value="online" {...register("registration_channel")} />
          </div>
          {errors?.registration_channel && (
            <p className="mt-1 text-xs text-red-500">{errors.registration_channel.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="col-span-12 md:col-span-6">
          <Controller
            name="registration_date"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <DatePicker
                label={
                  <span className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="size-4 text-primary-600 dark:text-primary-400" />
                    <span>Date</span>
                  </span>
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
  );
}

/* ---------- Steps config (5 steps) ---------- */
const steps = [
  {
    key: "intro",
    label: "Overview & Student",
    description: "Summary, intake info, and student profile.",
    Component: function Step() {
      return (
        <>
          <RegistrationOverview />
          <ChannelDateFields />
          <StudentDetailsSection />
        </>
      );
    },
  },
  {
    key: "addressContacts",
    label: "Address & Contacts",
    description: "Home/alternate address and contacts.",
    Component: function Step() {
      return (
        <>
          <AddressSection />
          <ContactSection />
        </>
      );
    },
  },
  {
    key: "transportMedical",
    label: "Transport & Medical",
    description: "Pickup/drop, transport, allergies & doctor details.",
    Component: function Step() {
      return (
        <>
          <TransportationSection />
          <MedicalInfoSection />
        </>
      );
    },
  },
  {
    key: "otherPrivacy",
    label: "Other & Privacy",
    description: "Additional details, consents, and school-only notes.",
    Component: function Step() {
      return (
        <>
          <OtherInfoSection />
          <PrivacyFormSection />
        </>
      );
    },
  },
  {
    key: "docsSignature",
    label: "Documents & Signature",
    description: "Upload required documents, sign, and finish.",
    Component: function Step() {
      return (
        <>
          <DocumentUploadSection
            title="Student Documents"
            documents={[
              { name: "birth_cert", label: "Birth Certificate" },
              { name: "transfer_cert", label: "Transfer Certificate" },
              { name: "parent_id", label: "Parent ID (Front)" },
            ]}
            uploadUrl="/api/Files/upload"
            extraData={{ tenantId: 1 }}
            method="POST"
            autoUpload={true}
            mapResponse={(resp) => resp?.data?.data?.fileUrl}
          />
          <SignatureSection />
        </>
      );
    },
  },
];

/* ---------- Fields per step for validation ---------- */
const stepFieldPaths = {
  intro: ["registration_channel", "registration_date"],
  addressContacts: [],
  transportMedical: [],
  otherPrivacy: [
    "privacy_media_consent",
    "privacy_signature_name",
    "privacy_signature_date",
    "school_stamp_notes",
    "school_proof_of_age",
    "school_data_entry_completed",
    "school_section_date",
    "school_authorized_sign",
  ],
  docsSignature: [],
};

/* ---------- Footer actions (inside card) ---------- */
function StepActions({ currentStep, onBack, onNext, isSubmitting, isValid, isLast }) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <Button
        type="button"
        color="primary"
        onClick={onBack}
        disabled={currentStep === 0 || isSubmitting}
      >
        Back
      </Button>

      {!isLast ? (
        <Button
          type="button"
          color="primary"
          onClick={onNext}
          disabled={isSubmitting}
        >
          Next
        </Button>
      ) : (
        <Button
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
      )}
    </div>
  );
}

/* ---------- Small helpers ---------- */
function scrollToFirstError(errors) {
  const first = Object.keys(errors || {})[0];
  if (!first) return;
  const el =
    document.querySelector(`[name="${first}"]`) ||
    document.querySelector(`[aria-invalid="true"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus?.();
  }
}

/* ---------- Lightweight Preview Modal ---------- */
function PreviewModal({ open, values, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-dark-800">
        <div className="flex items-center justify-between border-b p-4 dark:border-dark-600">
          <h3 className="text-lg font-medium">Preview</h3>
          <Button size="sm" variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4 text-sm">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(values ?? {}, null, 2)}
          </pre>
        </div>
        <div className="border-t p-3 text-right dark:border-dark-600">
          <Button color="primary" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main ---------- */
function StudentRegistrationForm() {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
    mode: "onChange",
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    trigger,
    getValues,
    formState,
  } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const isLast = currentStep === totalSteps - 1;
  const Active = steps[currentStep].Component;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewValues, setPreviewValues] = useState(null);

  const onSubmit = async (data) => {
    const payload = { ...data };

    // Normalize dates
    payload.registration_date = payload.registration_date ? new Date(payload.registration_date).toISOString() : null;
    payload.birth_date = payload.birth_date ? new Date(payload.birth_date).toISOString() : null;
    payload.signature_date = payload.signature_date ? new Date(payload.signature_date).toISOString() : null;

    // Privacy dates
    payload.privacy_signature_date = payload.privacy_signature_date
      ? new Date(payload.privacy_signature_date).toISOString()
      : null;
    payload.school_section_date = payload.school_section_date
      ? new Date(payload.school_section_date).toISOString()
      : null;

    await new Promise((r) => setTimeout(r, 600));
    console.log("Submitting payload:", payload);

    toast("Registration saved.", { invert: true });
    reset(initialState);
    setCurrentStep(0);
  };

  const validateAndNext = async () => {
    const key = steps[currentStep].key;
    const fields = stepFieldPaths[key];

    let ok = true;
    if (Array.isArray(fields) && fields.length > 0) {
      ok = await trigger(fields, { shouldFocus: true });
    }

    if (ok) setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <Page title="Registration Form">
      {/* Sticky Footer */}
      <footer className="dark:bg-dark-900 dark:border-dark-600 sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_8px_-2px_rgba(0,0,0,0.1)] sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-dark-50">
              Registration Form
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
                const valid = await methods.trigger(undefined, { shouldFocus: false });
                if (!valid) {
                  const errs = methods.formState.errors;
                  console.warn("Form blocked by validation errors:", errs);
                  toast.error("Please fix the highlighted fields");
                  scrollToFirstError(errs);
                  return;
                }
                await handleSubmit(onSubmit)();
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

      {/* Body */}
      <div className="transition-content px-4 pb-36 sm:px-6 lg:px-8">
        <FormProvider {...methods}>
          <form id="registration-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={clsx("grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6")}>
              {/* Left: Stepper */}
              <div className="col-span-12 sm:order-last sm:col-span-4 lg:col-span-3">
                <div className="sticky top-24 sm:mt-3">
                  <Stepper
                    steps={steps.map(({ key, label, description }) => ({ key, label, description }))}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                  />
                </div>
              </div>

              {/* Right: Active step card */}
              <div className="col-span-12 sm:col-span-8 lg:col-span-9">
                <Card className="h-full p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <DocumentPlusIcon className="size-6 text-primary-600 dark:text-primary-400" />
                    <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
                      {steps[currentStep].label}
                    </h2>
                  </div>
                  {steps[currentStep].description && (
                    <p className="mb-4 text-sm text-gray-500 dark:text-dark-200">
                      {steps[currentStep].description}
                    </p>
                  )}

                  <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
                    <div className="col-span-12">
                      <Active />
                    </div>
                  </div>

                  <StepActions
                    currentStep={currentStep}
                    onBack={goBack}
                    onNext={validateAndNext}
                    isSubmitting={isSubmitting}
                    isValid={formState.isValid}
                    isLast={isLast}
                  />
                </Card>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Preview */}
      <PreviewModal
        open={previewOpen}
        values={previewValues}
        onClose={() => setPreviewOpen(false)}
      />
    </Page>
  );
}

export default StudentRegistrationForm;
