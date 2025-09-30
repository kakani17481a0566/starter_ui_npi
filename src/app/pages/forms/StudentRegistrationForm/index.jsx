import { useState } from "react";
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
  EyeIcon,
  UserIcon,
  HomeIcon,
  TruckIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {submitStudentRegistrationForm} from "./PostData";

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
import FeeStructure from "./sections/FeeStructure"

/* ---------- Steps config ---------- */
const steps = [
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
    key: "FeeStructure",
    label: "Fee Structure",
    description: "Details about the fee structure.",
    icon: DocumentPlusIcon,
    Component: function Step() {
      return (
        <div className="space-y-4 sm:space-y-5">
          <FeeStructure />
          {/* <ContactSection /> */}
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

              {
                name: "heir_photo",
                label: "Heir Photo",
                accept: ".jpg,.jpeg,.png",
              },
              {
                name: "heir_birth_certificate",
                label: "Heir Birth Certificate",
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

/* ---------- Validation fields ---------- */
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

/* ---------- Preview Modal ---------- */
function PreviewModal({ open, values, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="dark:bg-dark-800 relative z-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="dark:border-dark-600 flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">Preview</h3>
          <Button size="sm" variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4 text-sm">
          <pre className="break-words whitespace-pre-wrap">
            {JSON.stringify(values ?? {}, null, 2)}
          </pre>
        </div>
        <div className="dark:border-dark-600 border-t p-3 text-right">
          <Button color="primary" onClick={onClose}>
            Done
          </Button>
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
  const StepIcon = steps[currentStep].icon || DocumentPlusIcon;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewValues, setPreviewValues] = useState(null);


// Put this in StudentRegistrationForm/index.jsx (or move into PostData.js if you prefer)
function mapFormToApi(values) {
    const formData = new FormData();

  const asInt = (v) => (v === "" || v == null ? null : Number(v));
  const toISO = (v) => (v ? new Date(v).toISOString() : null);
  const yesNo = (v) => v === "yes";
  const notNone = (v) => v && v !== "none";
  console.log("vslues",values.allergy_id);

  // ----- Primary address (used for default contact address) -----
  const primaryAddress = {
    homeApt: values.home_apt ?? "",
    homeStreet: values.home_street?.trim() ?? "",
    mailingCity: values.mailing_city ?? "",
    mailingPostal: values.mailing_postal ?? "",
    civicCity: values.civic_city ?? "",
    civicPostal: values.civic_postal ?? "",
  };

  // Helper to build a contact from contactGroupSchema prefixes
  const makeContact = (prefix, relationshipId, address = primaryAddress) => ({
    Name: [values[`${prefix}_first_name`] ?? "", values[`${prefix}_last_name`] ?? ""]
      .join(" ")
      .trim(),
    PriNumber: values[`${prefix}_phone`] ?? "",
    SecNumber: values[`${prefix}_alt_phone`] ?? "",
    Email: values[`${prefix}_email`] ?? "",
    Address1: address.homeStreet,
    Address2: address.homeApt,
    City: address.mailingCity,
    state: "", // not in current AddressSection; keep empty or add if you introduce it
    Pincode: address.mailingPostal,
    Qualification: values[`${prefix}_qualification`] ?? "", // if present in your form
    Profession: values[`${prefix}_profession`] ?? "",       // if present in your form
    RelationshipId:relationshipId, // 1=father, 2=mother, 3=guardian, 4=emergency (example ids)
  });

  // Build contacts array from the groups you actually collect
  const contacts = [];
  if (values.father_first_name || values.father_phone || values.father_email) {
    contacts.push(makeContact("father", 209));
  }
  if (values.mother_first_name || values.mother_phone || values.mother_email) {
    contacts.push(makeContact("mother", 210));
  }
  if (values.guardian_first_name || values.guardian_phone || values.guardian_email) {
    contacts.push(makeContact("guardian", 211));
  }
  if (values.emergency_first_name || values.emergency_phone || values.emergency_email) {
    contacts.push(makeContact("emergency", 212));
  }

  // Choose a “parent login” user source (prefer father_*, then mother_*)
  const parentFirst = values.parent_first_name || values.father_first_name || values.mother_first_name || "";
  const parentLast  = values.parent_last_name  || values.father_last_name  || values.mother_last_name  || "";
  const parentEmail = values.parent_email      || values.father_email      || values.mother_email      || "";
  const parentPhone = values.parent_phone      || values.father_phone      || values.mother_phone      || "";

  return {
    tenantId: 1,

    // ----- User (Parent Login) -----
    User: {
      Username: parentFirst,
      FirstName: parentFirst,
      LastName: parentLast,
      Email: parentEmail,
      Password: values.parent_password || "Temp@123",
      MobileNumber: parentPhone,
      RoleTypeId: 192,
      UserImageUrl: formData.append("UserImageUrl", values.userImageUrl),
      Dob: toISO(values.dob), // if you want parent's DOB, replace with a parent_dob field
    },

    // ----- Student -----
    Student: {
      FirstName: values.student_first_name,
      LastName: values.student_last_name,
      MiddleName: values.student_middle_name ?? "",
      Dob: toISO(values.dob),
      // schema has gender_id (number); backend expects string. Send id as string or map via your dictionary.
      Gender: String(values.gender_id ?? ""),
      BloodGroup: values.blood_group ?? "",
      AdmissionGrade: values.admission_grade ?? "",
      DateOfJoining: toISO(values.registration_date),
      CourseId:values.course_id ? Number(values.course_id) : null,
      BranchId:values.branch_id ? Number(values.branch_id) : null,
      RegistrationChannel: values.registration_channel ?? "",

      StudentImageUrl: formData.append("StudentImageUrl", values.student_photo) || "",
      StudentImage: formData.append("StudentImageUrl", values.student_photo) || "",
      MotherPhoto:formData.append("StudentImageUrl", values.mother_photo ) || "",
      FatherPhoto: formData.append("StudentImageUrl", values.father_photo)  || "",
      JointPhoto: formData.append("StudentImageUrl", values.joint_photo) || "",

      // ----- Transport -----
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

      // ----- Custody/Family (only what exists now) -----
      CustodyFamily: {
        SpeechTherapy: yesNo(values.speech_therapy),
        // The following exist only if you have these fields in your form:
        Custody: yesNo(values.custody),
        CustodyOfId: asInt(values.custody_of_id) || 0,
        LivesWithId: asInt(values.lives_with_id) || 0,
        SiblingsInThisSchool: yesNo(values.siblings_this_school),
        SiblingsThisNames: values.siblings_this_names || "",
        SiblingsInOtherSchool: yesNo(values.siblings_other_school),
        SiblingsOtherNames: values.siblings_other_names || "",
      },

      // ----- Medical -----
      MedicalInfo: {
        AnyAllergy: yesNo(values.life_threat_allergy),
        WhatAllergyId: asInt(values.allergy_id) || 0,
        OtherAllergyText: values.allergy_substances || "",
        MedicalKit: yesNo(values.emergency_kit_recommended),
        SeriousMedicalConditions: values.serious_medical_conditions || "",
        SeriousConditionsInfo: values.serious_medical_info || "",
        OtherMedicalInfo: values.other_medical_info || "",
      },

      // ----- Languages -----
      Languages: {
        LanguageAdultsHome: values.lang_adults_home,
        LanguageMostUsedWithChild: values.lang_with_child,
        LanguageFirstLearned: values.lang_first_learned,
      },

      // ----- English Skills -----
      EnglishSkills: {
        CanReadEnglish: notNone(values.read_english),  // schema: "none" | "little" | "well"
        ReadSkillId: asInt(values.read_english_id) || 0,
        CanWriteEnglish: notNone(values.write_english),
        WriteSkillId: asInt(values.write_english_id) || 0,
      },

      // ----- Documents (matches your schema: student_photo + birth_certificate + signature_data) -----
      Documents: {
        Signature: formData.append("StudentImageUrl", values.signature_data) || "" ,
        BirthCertificate:  formData.append("StudentImageUrl", values.birth_certificate) || "",
        KidPassport: formData.append("StudentImageUrl", values.kid_passport)  || "",
        Adhar:  formData.append("StudentImageUrl", values.student_adhar) || "",
        ParentAdhar: formData.append("StudentImageUrl", values.parent_adhar) || "",
        MotherAdhar: formData.append("StudentImageUrl", values.mother_adhar) || "",
        HealthForm: formData.append("StudentImageUrl", values.health_form ) || "",
        PrivacyForm: formData.append("StudentImageUrl",values.privacy_form ) || "",
        LiabilityForm:  formData.append("StudentImageUrl", values.liability_form) || "",
      },
    },

    // ----- Contacts (use primary address by default) -----
    contacts,
  };
}
// index.jsx
const onSubmit = async (data) => {
  try {
    const apiPayload = mapFormToApi(data);
    // console.log("📦 Final API Payload:", apiPayload);

    const result = await submitStudentRegistrationForm(apiPayload);
    console.log("✅ API Response:", result);

    toast.success("Registration saved successfully");
    reset(initialState);
  } catch (error) {
    console.error("❌ Submission error:", error);
    toast.error("Failed to submit registration");
  }
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
            <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-6" />
            <h2 className="dark:text-dark-50 text-xl font-medium text-gray-700">
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
                           const isValid = await methods.trigger();
                           const errors = methods.formState.errors;

                           const fieldLabels = {
                             pg_names: "Student First Name",
                             student_middle_name: "Student Middle Name",
                             student_last_name: "Student Last Name",
                             dob: "Date of Birth",
                             gender_id: "Gender",
                             admission_course_id: "Grade Applying For",
                             prev_school_name: "Previous School Name",
                             from_course_id: "From Grade",
                             from_year: "From Year",
                             to_course_id: "To Grade",
                             to_year: "To Year",
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
                             parent_first_name: "Parent First Name",
                             parent_phone: "Parent Mobile Number",
                             parent_email: "Parent Email",
                             parent_qualification: "Parent Qualification",
                             parent_profession: "Parent Profession",
                             mother_first_name: "Mother First Name",
                             mother_phone: "Mother Mobile Number",
                             mother_email: "Mother Email",
                             mother_qualification: "Mother Qualification",
                             mother_profession: "Mother Profession",
                             heard_about_us_type_id: "Heard About Us",
                             signature: "E-Signature",
                           };

                           if (!isValid) {
                             const missingFields = Object.entries(errors).map(
                               ([key, val]) => ({
                                 Field: fieldLabels[key] || key,
                                 Reason: val?.message || "Required",
                               }),
                             );
                             console.clear();
                             console.warn(
                               "🚨 Form submission blocked due to missing fields:",
                             );
                             console.table(missingFields);
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
