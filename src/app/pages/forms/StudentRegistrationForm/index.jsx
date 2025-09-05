import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";

import { initialState } from "./data";
import { schema } from "./schema";

import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import { CheckCircleIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";

// Section components
import RegistrationOverview from "./sections/RegistrationOverview";
import PreSchoolKindergartenSection from "./sections/PreSchoolKindergartenSection";
import StudentDetailsSection from "./sections/StudentDetailsSection";
import AddressSection from "./sections/AddressSection";
import TransportationSection from "./sections/TransportationSection";
import ContactSection from "./sections/ContactSection";
import MedicalInfoSection from "./sections/MedicalInfoSection";
import OtherInfoSection from "./sections/OtherInfoSection";
import SignatureSection from "./sections/SignatureSection";

function StudentRegistrationForm() {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data) => {
    const payload = { ...data };
    payload.registration_date = payload.registration_date ? new Date(payload.registration_date).toISOString() : null;
    payload.birth_date = payload.birth_date ? new Date(payload.birth_date).toISOString() : null;
    payload.signature_date = payload.signature_date ? new Date(payload.signature_date).toISOString() : null;

    await new Promise((r) => setTimeout(r, 600));
    console.log(payload);
    toast("Registration saved.", { invert: true });
    reset(initialState);
  };

  return (
    <Page title="Registration Form">
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="py-6 text-center">
          <h1 className="dark:text-dark-50 text-2xl font-semibold text-gray-800">My School ITALY</h1>
          <p className="text-sm text-gray-500">The Neuroscientific European Preschool</p>
          <p className="mt-1 text-base font-medium text-gray-700">REGISTRATION FORM</p>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-6" />
            <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">Student Registration</h2>
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

        <FormProvider {...methods}>
          <form
            id="registration-form"
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
              <div className="col-span-12">
                <RegistrationOverview />
              </div>

              {/* Inline section for registration_channel & registration_date */}
              <div className="col-span-12">
                <Card className="p-4 sm:px-5">
                  {/* TODO: Add radio group and date picker for registration_channel and registration_date */}
                </Card>
              </div>

              <div className="col-span-12">
                <PreSchoolKindergartenSection />
              </div>

              <div className="col-span-12">
                <StudentDetailsSection />
              </div>

              <div className="col-span-12">
                <TransportationSection />
              </div>

              <div className="col-span-12">
                <AddressSection />
              </div>

              <div className="col-span-12">
                <ContactSection />
              </div>

              <div className="col-span-12">
                <MedicalInfoSection />
              </div>

              <div className="col-span-12">
                <OtherInfoSection />
              </div>

              <div className="col-span-12">
                <SignatureSection />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Page>
  );
}

export default StudentRegistrationForm;
