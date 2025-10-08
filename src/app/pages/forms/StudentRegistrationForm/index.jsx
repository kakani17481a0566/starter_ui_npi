// src/app/pages/forms/StudentRegistrationForm/StudentRegistrationForm.jsx

import { useState, useMemo, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import clsx from "clsx";
import { toast } from "sonner";

import { initialState } from "./data";
import { schema } from "./schema";

import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import {
  CheckCircleIcon,
  DocumentPlusIcon,
  UserIcon,
  HomeIcon,
  TruckIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { submitStudentRegistrationForm } from "./PostData";

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
import FeeStructure from "./sections/FeeStructure";
import { FeePackageDropdown } from "./components/FeePackageDropdown";
import { CorporateSelect } from "./components/CorporateSelect";

/* ---------- Validation fields ---------- */
const stepFieldPaths = {
  intro: ["registration_channel", "registration_date"],
  addressContacts: [],
  feeStructure: [],
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
  docsSignature: ["waiver.consent", "waiver.guardian_full_name", "waiver.date"],
};

/* ---------- Footer actions ---------- */
function StepActions({
  currentStep,
  onBack,
  onNext,
  isSubmitting,
  isValid,
  isLast,
}) {
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

/* ---------- Error helper ---------- */
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
    formState,
  } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCorporate, setSelectedCorporate] = useState(null);

  // ✅ FIX: Memoize stepsConfig to prevent component re-creation
  const stepsConfig = useCallback((
    setSelectedPackage,
    selectedPackage,
    setSelectedCorporate,
    selectedCorporate,
  ) => {
    return [
      {
        key: "intro",
        label: "Overview & Student",
        description: "Summary, intake info, and student profile.",
        icon: UserIcon,
        Component: function Step() {
          return (
            <div className="space-y-4 sm:space-y-5">
              <RegistrationOverview />
              <StudentDetailsSection />
            </div>
          );
        },
      },
      {
        key: "addressContacts",
        label: "Address & Contacts",
        description: "Home/alternate address and contacts.",
        icon: HomeIcon,
        Component: function Step() {
          return (
            <div className="space-y-4 sm:space-y-5">
              <AddressSection />
              <ContactSection />
            </div>
          );
        },
      },
     {
  key: "feeStructure",
  label: "Fee Structure",
  // description: "Select package and corporate discounts.",
  icon: CurrencyDollarIcon,
  Component: function Step() {
    return (
      <div className="space-y-6">
        {/* Section: Package & Corporate - MOVED TO HEADER AREA */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {/* Header with dropdowns inline */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Fee Details
              </h3>
              <p className="text-sm text-gray-500">
                Select package and corporate discounts
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <div className="min-w-[200px]">
                <FeePackageDropdown
                  onSelect={setSelectedPackage}
                  value={selectedPackage}
                />
              </div>
              <div className="min-w-[200px]">
                <CorporateSelect
                  onCorporateSelect={setSelectedCorporate}
                  value={selectedCorporate}
                />
              </div>
            </div>
          </div>

          {/* Fee Table */}
          <FeeStructure
            selectedPackage={selectedPackage}
            selectedCorporate={selectedCorporate}
          />
        </div>
      </div>
    );
  },
},
      {
        key: "transportMedical",
        label: "Transport & Medical",
        description: "Pickup/drop, transport, allergies & doctor details.",
        icon: TruckIcon,
        Component: function Step() {
          return (
            <div className="space-y-4 sm:space-y-5">
              <TransportationSection />
              <MedicalInfoSection />
            </div>
          );
        },
      },
      {
        key: "otherPrivacy",
        label: "Other & Privacy",
        description: "Additional details, consents, and school-only notes.",
        icon: ShieldCheckIcon,
        Component: function Step() {
          return (
            <div className="space-y-4 sm:space-y-5">
              <OtherInfoSection />
            </div>
          );
        },
      },
      {
        key: "docsSignature",
        label: "Documents & Signature",
        description: "Waiver, upload required documents, sign, and finish.",
        icon: PencilSquareIcon,
        Component: function Step() {
          return (
            <div className="space-y-4 sm:space-y-5">
              <DocumentUploadSection
                title="Upload Documents"
                uploadUrl="/api/uploads/student-docs"
                extraData={{ category: "admission" }}
                documents={[
                  {
                    name: "student_photo",
                    label: "Student Photo",
                    accept: ".jpg,.jpeg,.png",
                  },
                  {
                    name: "student_birth_certificate",
                    label: "Birth Certificate",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "student_transfer_certificate",
                    label: "Transfer Certificate (if applicable)",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "student_previous_marksheet",
                    label: "Previous School Marksheet",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "student_medical_certificate",
                    label: "Medical Certificate",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "parent_photo",
                    label: "Parent Photo",
                    accept: ".jpg,.jpeg,.png",
                  },
                  {
                    name: "parent_id_front",
                    label: "Parent ID (Front)",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "parent_id_back",
                    label: "Parent ID (Back)",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "guardian_photo",
                    label: "Guardian Photo",
                    accept: ".jpg,.jpeg,.png",
                  },
                  {
                    name: "guardian_id_front",
                    label: "Guardian ID (Front)",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                  {
                    name: "guardian_id_back",
                    label: "Guardian ID (Back)",
                    accept: ".jpg,.jpeg,.png,.pdf",
                  },
                ]}
              />
              <SignatureSection />
            </div>
          );
        },
      },
    ];
  }, []);

  // ✅ FIX: Memoize steps array
  const steps = useMemo(() =>
    stepsConfig(
      setSelectedPackage,
      selectedPackage,
      setSelectedCorporate,
      selectedCorporate,
    ),
    [stepsConfig, selectedPackage, selectedCorporate]
  );

  const totalSteps = steps.length;
  const isLast = currentStep === totalSteps - 1;
  const Active = steps[currentStep].Component;
  const StepIcon = steps[currentStep].icon || DocumentPlusIcon;

  // ---------- FULL mapFormToApi ----------
  const mapFormToApi = useCallback((values) => {
    const formData = new FormData();

    const asInt = (v) => (v === "" || v == null ? null : Number(v));
    const toISO = (v) => (v ? new Date(v).toISOString() : null);
    const yesNo = (v) => v === "yes";
    const notNone = (v) => v && v !== "none";

    const primaryAddress = {
      homeApt: values.home_apt ?? "",
      homeStreet: values.home_street?.trim() ?? "",
      mailingCity: values.mailing_city ?? "",
      mailingPostal: values.mailing_postal ?? "",
      civicCity: values.civic_city ?? "",
      civicPostal: values.civic_postal ?? "",
    };

    const makeContact = (prefix, relationshipId, address = primaryAddress) => ({
      Name: [
        values[`${prefix}_first_name`] ?? "",
        values[`${prefix}_last_name`] ?? "",
      ]
        .join(" ")
        .trim(),
      PriNumber: values[`${prefix}_phone`] ?? "",
      SecNumber: values[`${prefix}_alt_phone`] ?? "",
      Email: values[`${prefix}_email`] ?? "",
      Address1: address.homeStreet,
      Address2: address.homeApt,
      City: address.mailingCity,
      state: "",
      Pincode: address.mailingPostal,
      Qualification: values[`${prefix}_qualification`] ?? "",
      Profession: values[`${prefix}_profession`] ?? "",
      RelationshipId: relationshipId,
    });

    const contacts = [];
    if (
      values.father_first_name ||
      values.father_phone ||
      values.father_email
    ) {
      contacts.push(makeContact("father", 209));
    }
    if (
      values.mother_first_name ||
      values.mother_phone ||
      values.mother_email
    ) {
      contacts.push(makeContact("mother", 210));
    }
    if (
      values.guardian_first_name ||
      values.guardian_phone ||
      values.guardian_email
    ) {
      contacts.push(makeContact("guardian", 211));
    }
    if (
      values.emergency_first_name ||
      values.emergency_phone ||
      values.emergency_email
    ) {
      contacts.push(makeContact("emergency", 212));
    }

    const parentFirst =
      values.parent_first_name ||
      values.father_first_name ||
      values.mother_first_name ||
      "";
    const parentLast =
      values.parent_last_name ||
      values.father_last_name ||
      values.mother_last_name ||
      "";
    const parentEmail =
      values.parent_email || values.father_email || values.mother_email || "";
    const parentPhone =
      values.parent_phone || values.father_phone || values.mother_phone || "";

    return {
      tenantId: 1,
      User: {
        Username: parentFirst,
        FirstName: parentFirst,
        LastName: parentLast,
        Email: parentEmail,
        Password: values.parent_password || "Temp@123",
        MobileNumber: parentPhone,
        RoleTypeId: 192,
        UserImageUrl: formData.append("UserImageUrl", values.userImageUrl),
        Dob: toISO(values.dob),
      },
      Student: {
        FirstName: values.student_first_name,
        LastName: values.student_last_name,
        MiddleName: values.student_middle_name ?? "",
        Dob: toISO(values.dob),
        Gender: String(values.gender_id ?? ""),
        BloodGroup: values.blood_group ?? "",
        AdmissionGrade: values.admission_grade ?? "",
        DateOfJoining: toISO(values.registration_date),
        CourseId: values.course_id ? Number(values.course_id) : null,
        BranchId: values.branch_id ? Number(values.branch_id) : null,
        RegistrationChannel: values.registration_channel ?? "",
        StudentImageUrl:
          formData.append("StudentImageUrl", values.student_photo) || "",
        StudentImage:
          formData.append("StudentImageUrl", values.student_photo) || "",
        MotherPhoto:
          formData.append("StudentImageUrl", values.mother_photo) || "",
        FatherPhoto:
          formData.append("StudentImageUrl", values.father_photo) || "",
        JointPhoto:
          formData.append("StudentImageUrl", values.joint_photo) || "",
        Transport: {
          Regular: {
            IsEnabled: notNone(values.regular_transport),
            TransportId: asInt(values.regular_transport_id) || 0,
            FreeText: values.regular_transport_other || "",
          },
          Alternate: {
            IsEnabled: notNone(values.alternate_transport),
            TransportId: asInt(values.alternate_transport_id) || 0,
            FreeText: values.alternate_transport_other || "",
          },
          OtherTransportText: values.transport_other_info || "",
        },
        CustodyFamily: {
          SpeechTherapy: yesNo(values.speech_therapy),
          Custody: yesNo(values.custody),
          CustodyOfId: asInt(values.custody_of_id) || 0,
          LivesWithId: asInt(values.lives_with_id) || 0,
          SiblingsInThisSchool: yesNo(values.siblings_this_school),
          SiblingsThisNames: values.siblings_this_names || "",
          SiblingsInOtherSchool: yesNo(values.siblings_other_school),
          SiblingsOtherNames: values.siblings_other_names || "",
        },
        MedicalInfo: {
          AnyAllergy: yesNo(values.life_threat_allergy),
          WhatAllergyId: asInt(values.allergy_id) || 0,
          OtherAllergyText: values.allergy_substances || "",
          MedicalKit: yesNo(values.emergency_kit_recommended),
          SeriousMedicalConditions: values.serious_medical_conditions || "",
          SeriousConditionsInfo: values.serious_medical_info || "",
          OtherMedicalInfo: values.other_medical_info || "",
        },
        Languages: {
          LanguageAdultsHome: values.lang_adults_home,
          LanguageMostUsedWithChild: values.lang_with_child,
          LanguageFirstLearned: values.lang_first_learned,
        },
        EnglishSkills: {
          CanReadEnglish: notNone(values.read_english),
          ReadSkillId: asInt(values.read_english_id) || 0,
          CanWriteEnglish: notNone(values.write_english),
          WriteSkillId: asInt(values.write_english_id) || 0,
        },
        Documents: {
          Signature:
            formData.append("StudentImageUrl", values.signature_data) || "",
          BirthCertificate:
            formData.append("StudentImageUrl", values.birth_certificate) || "",
          KidPassport:
            formData.append("StudentImageUrl", values.kid_passport) || "",
          Adhar: formData.append("StudentImageUrl", values.student_adhar) || "",
          ParentAdhar:
            formData.append("StudentImageUrl", values.parent_adhar) || "",
          MotherAdhar:
            formData.append("StudentImageUrl", values.mother_adhar) || "",
          HealthForm:
            formData.append("StudentImageUrl", values.health_form) || "",
          PrivacyForm:
            formData.append("StudentImageUrl", values.privacy_form) || "",
          LiabilityForm:
            formData.append("StudentImageUrl", values.liability_form) || "",
        },
      },
      contacts,
      SelectedFeePackage: selectedPackage || null,
      SelectedCorporate: selectedCorporate || null,
    };
  }, [selectedPackage, selectedCorporate]);

  const onSubmit = useCallback(async (data) => {
    try {
      const apiPayload = mapFormToApi(data);
      const result = await submitStudentRegistrationForm(apiPayload);
      console.log("✅ API Response:", result);
      toast.success("Registration saved successfully");
      reset(initialState);
      setSelectedPackage(null);
      setSelectedCorporate(null);
    } catch (error) {
      console.error("❌ Submission error:", error);
      toast.error("Failed to submit registration");
    }
  }, [mapFormToApi, reset]);

  const validateAndNext = useCallback(async () => {
    const key = steps[currentStep].key;
    const fields = stepFieldPaths[key];
    let ok = true;
    if (Array.isArray(fields) && fields.length > 0) {
      ok = await trigger(fields, { shouldFocus: true });
    }
    if (ok) setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [currentStep, steps, trigger, totalSteps]);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleSaveClick = useCallback(async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields");
      scrollToFirstError(methods.formState.errors);
    } else {
      handleSubmit(onSubmit)();
    }
  }, [methods, handleSubmit, onSubmit]);

  return (
    <Page title="Registration Form">
      {/* Sticky Footer */}
      <footer className="dark:bg-dark-900 dark:border-dark-600 sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_8px_-2px_rgba(0,0,0,0.1)] sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-6" />
            <h2 className="dark:text-dark-50 text-xl font-medium text-gray-700">
              Registration Form
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveClick}
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
          <form
            id="registration-form"
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={clsx("grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6")}>
              {/* Left: Stepper */}
              <div className="col-span-12 sm:order-last sm:col-span-4 lg:col-span-3">
                <div className="sticky top-24 sm:mt-3">
                  <Stepper
                    steps={steps.map(({ key, label, description }) => ({
                      key,
                      label,
                      description,
                    }))}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                  />
                </div>
              </div>

              {/* Right: Active step card */}
              <div className="col-span-12 sm:col-span-8 lg:col-span-9">
                <Card className="h-full p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <StepIcon className="text-primary-600 dark:text-primary-400 size-6" />
                    <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">
                      {steps[currentStep].label}
                    </h2>
                  </div>
                  {steps[currentStep].description && (
                    <p className="dark:text-dark-200 mb-4 text-sm text-gray-500">
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
    </Page>
  );
}

export default StudentRegistrationForm;