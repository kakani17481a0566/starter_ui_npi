import { useMemo, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Card, Input, Radio, Textarea } from "components/ui";
import {
  ShieldCheckIcon,
  PhotoIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "components/shared/form/Datepicker";

export default function PrivacyFormSection() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // watch the selected stamp file
  const stampFile = watch("school_stamp_file");

  // stable preview URL + cleanup
  const previewUrl = useMemo(
    () => (stampFile ? URL.createObjectURL(stampFile) : ""),
    [stampFile]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleStampSelect = (file) => {
    setValue("school_stamp_file", file ?? null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeStamp = () => {
    setValue("school_stamp_file", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      {/* Notice & Contact */}
      <Card className="p-4 sm:px-5">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheckIcon className="text-primary-600 dark:text-primary-400 size-5" />
          <h3 className="dark:text-dark-50 text-base font-medium text-gray-800">
            Privacy Form — Notice
          </h3>
        </div>

        <div className="dark:text-dark-100 space-y-3 text-sm leading-6 text-gray-700">
          <p>
            Personal information on this form is collected under the Data
            Protection Act 1998 as it relates directly to and is necessary for
            providing services to students and will also be used for school
            board operations and the administration of health services offered
            through the school.
          </p>
          <p>
            If you have any questions about this collection of personal
            information, you may contact the coordinator at:
          </p>
          <div className="dark:bg-dark-600 dark:text-dark-100 rounded-md bg-gray-50 p-3 text-gray-800">
            <div className="font-medium">My School ITALY</div>
            <div className="mt-1 inline-flex items-center gap-2">
              <EnvelopeIcon className="text-primary-600 dark:text-primary-400 size-4" />
              <a
                href="mailto:info@myschoolitaly.com"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                info@myschoolitaly.com
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Media Consent */}
      <Card className="p-4 sm:px-5">
        <div className="mb-2 flex items-center gap-2">
          <PhotoIcon className="text-primary-600 dark:text-primary-400 size-5" />
          <h3 className="dark:text-dark-50 text-base font-medium text-gray-800">
            Permission for Media Photos / Videos
          </h3>
        </div>

        <p className="dark:text-dark-100 text-sm text-gray-700">
          In accordance with the Freedom of Information and Protection of
          Privacy Act, any identifying picture or story involving your child may
          only be published with your consent. Please choose one:
        </p>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="flex flex-wrap gap-6">
              <Radio
                label="I consent"
                value="consent"
                {...register("privacy_media_consent")}
              />
              <Radio
                label="I do not consent"
                value="no_consent"
                {...register("privacy_media_consent")}
              />
            </div>
            {errors?.privacy_media_consent && (
              <p className="mt-1 text-xs text-red-500">
                {errors.privacy_media_consent.message}
              </p>
            )}
          </div>

          <div className="col-span-12">
            <p className="dark:text-dark-100 text-sm text-gray-700">
              This consent covers your child being photographed or videotaped,
              and his or her name, image, and/or school work being used in media
              coverage of school-related events, in school or board
              publications, or on the school or board website.
            </p>
          </div>

          <div className="col-span-12 md:col-span-8">
            <Input
              label={
                <span className="inline-flex items-center gap-2">
                  <PencilSquareIcon className="text-primary-600 dark:text-primary-400 size-4" />
                  <span>Signature of Custodial Parent(s) / Legal Guardian</span>
                </span>
              }
              placeholder="Type full name as signature"
              {...register("privacy_signature_name")}
              error={errors?.privacy_signature_name?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Controller
              name="privacy_signature_date"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={
                    <span className="inline-flex items-center gap-2">
                      <CalendarDaysIcon className="text-primary-600 dark:text-primary-400 size-4" />
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
                  error={errors?.privacy_signature_date?.message}
                  {...rest}
                />
              )}
            />
          </div>
        </div>
      </Card>

      {/* School Use Only */}
      <Card className="p-4 sm:px-5">
        <div className="mb-2 flex items-center gap-2">
          <BuildingOffice2Icon className="text-primary-600 dark:text-primary-400 size-5" />
          <h3 className="dark:text-dark-50 text-base font-medium text-gray-800">
            School Use Only
          </h3>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* School Stamp: square preview */}
          <div className="col-span-12 md:col-span-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">
              School Stamp (image)
            </label>

            <div className="flex items-center gap-4">
              {/* Square preview area */}
              <div className="relative size-32 overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50 dark:border-dark-500 dark:bg-dark-700">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="School stamp preview"
                    className="size-32 object-cover"
                  />
                ) : (
                  <div className="flex size-32 items-center justify-center text-xs text-gray-500 dark:text-dark-300">
                    1:1 preview
                  </div>
                )}
              </div>

              {/* File input + remove */}
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleStampSelect(e.target.files?.[0])}
                  error={errors?.school_stamp_file?.message}
                />
                {stampFile && (
                  <button
                    type="button"
                    onClick={removeStamp}
                    className="text-left text-sm text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Remove image
                  </button>
                )}
                {!stampFile && (
                  <p className="text-xs text-gray-500 dark:text-dark-300">
                    PNG or JPG. Shown as a square.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stamp applied? */}
          <div className="col-span-12 md:col-span-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">
              Stamp applied?
            </label>
            <div className="flex flex-wrap gap-6">
              <Radio label="Yes" value="yes" {...register("school_stamp_applied")} />
              <Radio label="No" value="no" {...register("school_stamp_applied")} />
            </div>
            {errors?.school_stamp_applied && (
              <p className="mt-1 text-xs text-red-500">
                {errors.school_stamp_applied.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="col-span-12">
            <Textarea
              label="School Stamp / Notes"
              placeholder="(For office use) e.g., stamp applied, file reference, remarks"
              {...register("school_stamp_notes")}
              error={errors?.school_stamp_notes?.message}
            />
          </div>

          {/* Proof of age provided */}
          <div className="col-span-12 md:col-span-6">
            <label className="dark:text-dark-100 mb-2 block text-sm font-medium text-gray-700">
              Proof of age provided
            </label>
            <div className="flex flex-wrap gap-6">
              <Radio label="Yes" value="yes" {...register("school_proof_of_age")} />
              <Radio label="No" value="no" {...register("school_proof_of_age")} />
            </div>
            {errors?.school_proof_of_age && (
              <p className="mt-1 text-xs text-red-500">
                {errors.school_proof_of_age.message}
              </p>
            )}
          </div>

          {/* Data entry completed */}
          <div className="col-span-12 md:col-span-6">
            <label className="dark:text-dark-100 mb-2 block text-sm font-medium text-gray-700">
              Data entry completed
            </label>
            <div className="flex flex-wrap gap-6">
              <Radio label="Yes" value="yes" {...register("school_data_entry_completed")} />
              <Radio label="No" value="no" {...register("school_data_entry_completed")} />
            </div>
            {errors?.school_data_entry_completed && (
              <p className="mt-1 text-xs text-red-500">
                {errors.school_data_entry_completed.message}
              </p>
            )}
          </div>

          {/* School date */}
          <div className="col-span-12 md:col-span-6">
            <Controller
              name="school_section_date"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  label={
                    <span className="inline-flex items-center gap-2">
                      <CalendarDaysIcon className="text-primary-600 dark:text-primary-400 size-4" />
                      <span>Date</span>
                    </span>
                  }
                  value={value ?? null}
                  onChange={onChange}
                  options={{
                    disableMobile: true,
                    dateFormat: "d/m/Y",
                  }}
                  placeholder="dd/mm/yyyy"
                  error={errors?.school_section_date?.message}
                  {...rest}
                />
              )}
            />
          </div>

          {/* Authorized signatory */}
          <div className="col-span-12 md:col-span-6">
            <Input
              label="Authorized Signatory"
              placeholder="Name / Initials"
              {...register("school_authorized_sign")}
              error={errors?.school_authorized_sign?.message}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
