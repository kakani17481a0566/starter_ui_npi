import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import {
  DocumentPlusIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { initialState } from "./data";
import { getDialFromCountry, normalizeCountry } from "./utils";
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
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
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
  }, [selectedCountry, studentDial, parentDial, motherDial, setValue, clearErrors]);

  useEffect(() => {
    if (!isSame) return;
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

    await new Promise((r) => setTimeout(r, 600));
    console.log(payload);
    toast("Enquiry saved.", { invert: true });
    reset(initialState);
  };

  return (
    <Page title="Student Enquiry Form">
      {/* Sticky Button Bar */}
      <footer className="sticky bottom-0 z-10 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-600 px-4 sm:px-6 lg:px-8 py-4 shadow-[0_-4px_8px_-2px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6 text-primary-600 dark:text-primary-400" />
            <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">
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
      </footer>

      {/* Main Form */}
      <div className="transition-content px-4 sm:px-6 lg:px-8 pb-36">
        <FormProvider {...methods}>
          <form id="enquiry-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
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
