import { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import SignaturePad from "react-signature-canvas";
import { Card } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import CircleStamp from "components/shared/CircleStamp";
import {
  ShieldCheckIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

/**
 * WaiverOfLiabilityForm
 * - School Use Only: Date (left) + Authorized Signatory (right) are side-by-side on sm+ screens.
 * - Authorized Signatory uses a SignaturePad; value saved in `school_authorized_sign` (PNG data URL).
 */
export default function WaiverOfLiabilityForm({ schoolName = "My School ITALY" }) {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const guardianSigRef = useRef(null);
  const officeSigRef = useRef(null);

  // Default guardian sign date if empty
  useEffect(() => {
    const today = new Date();
    const iso = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
    if (!getValues("waiver.date")) {
      setValue("waiver.date", iso, { shouldValidate: true });
    }
  }, [getValues, setValue]);

  // Guardian signature helpers
  const handleGuardianClear = () => {
    guardianSigRef.current?.clear();
    setValue("waiver.signature_data", "");
  };
  const handleGuardianCapture = () => {
    if (!guardianSigRef.current) return;
    if (guardianSigRef.current.isEmpty()) return setValue("waiver.signature_data", "");
    const dataUrl = guardianSigRef.current.getTrimmedCanvas().toDataURL("image/png");
    setValue("waiver.signature_data", dataUrl, { shouldValidate: true });
  };

  // Office (Authorized Signatory) signature helpers
  const handleOfficeClear = () => {
    officeSigRef.current?.clear();
    setValue("school_authorized_sign", "");
  };
  const handleOfficeCapture = () => {
    if (!officeSigRef.current) return;
    if (officeSigRef.current.isEmpty()) return setValue("school_authorized_sign", "");
    const dataUrl = officeSigRef.current.getTrimmedCanvas().toDataURL("image/png");
    setValue("school_authorized_sign", dataUrl, { shouldValidate: true });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-wide text-gray-900">
            WAIVER OF LIABILITY FORM
          </h1>
          <p className="mt-1 text-sm text-gray-500">{schoolName}</p>
        </div>
      </div>

      {/* Notice banner */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-700">
        <ShieldCheckIcon className="size-5 text-primary-600" />
        <span>Please read carefully and sign below.</span>
      </div>

      {/* Legal text */}
      <div className="space-y-3 text-justify text-sm leading-6 text-gray-800">
        <p>
          The undersigned being the lawful parent and/or guardian of the above child(ren) hereby
          consent to the participation by the child(ren) in all activities conducted by {schoolName}
          and to the participation of the child(ren) in all events related to said activities.
        </p>
        <p>
          The children that participate in activities and free play with {schoolName} are consistently
          well supervised; however, accidents can occur. The undersigned assumes all risk of injury or
          harm to the child(ren) associated with participation in {schoolName}&apos;s activities and
          free play and agrees to release, indemnify, defend, and forever discharge {schoolName} and
          its subsidiaries, vendors, staff, employees, and agents from all liability, claims, demands,
          damages, costs, expenses, actions and causes of action arising from the child(ren)&apos;s
          participation.
        </p>
      </div>

      {/* Consent + Guardian details */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-gray-300"
            {...register("waiver.consent", { required: true })}
          />
          <span>
            I am the lawful parent/guardian and I consent to the above terms on behalf of the child(ren).
          </span>
        </label>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">
            Full Name of Custodial Parent(s) / Legal Guardian
          </label>
          <input
            type="text"
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter full name"
            {...register("waiver.guardian_full_name", { required: true })}
          />
          {errors?.waiver?.guardian_full_name && (
            <p className="text-xs text-red-600">Guardian name is required.</p>
          )}
        </div>

        {/* Guardian signing date */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">
            Date (Guardian signing)
          </label>
          <input
            type="date"
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register("waiver.date", { required: true })}
          />
          {errors?.waiver?.date && <p className="text-xs text-red-600">Date is required.</p>}
        </div>
      </div>

      {/* Guardian Signature */}
      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <PencilSquareIcon className="size-5 text-primary-600" />
          <h3 className="text-sm font-medium text-gray-900">
            Signature of Custodial Parent(s) or Legal Guardian
          </h3>
        </div>

        <div className="rounded-2xl border p-3">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="rounded-xl border bg-white">
              <Controller
                name="waiver.signature_data"
                control={control}
                defaultValue=""
                render={() => (
                  <SignaturePad
                    ref={guardianSigRef}
                    onEnd={handleGuardianCapture}
                    canvasProps={{ className: "h-40 w-full rounded-xl" }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2 sm:justify-between">
              <button
                type="button"
                onClick={handleGuardianClear}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Clear
              </button>
              <p className="text-xs text-gray-500">
                You may sign digitally above or provide a wet signature on paper.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== SCHOOL USE ONLY ====== */}
      <Card className="mt-8 p-4 sm:px-5">
        <div className="mb-2 flex items-center gap-2">
          <BuildingOffice2Icon className="size-5 text-primary-600" />
          <h3 className="text-base font-medium text-gray-800">School Use Only</h3>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Stamp */}
          <div className="col-span-12 lg:col-span-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">School Stamp</label>
            <div className="flex items-center gap-4">
              <div className="flex size-32 items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50">
                <CircleStamp
                  size={120}
                  color="#1554c1"
                  topText={`★ ${schoolName} ★`}
                  bottomText="★ MINDSPACE ★"
                  showInnerCircle
                  title="School circular stamp"
                />
              </div>
              <p className="text-xs text-gray-500">Auto-rendered stamp.</p>
            </div>
          </div>

          {/* Right: Date (left) + Authorized Signatory (right) */}
          <div className="col-span-12 lg:col-span-8">
            {/* >>> changed to two columns at sm breakpoint to ensure side-by-side layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date (Office processing) — LEFT col */}
              <div className="min-w-0">
                <Controller
                  name="school_section_date"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <DatePicker
                      label={
                        <span className="inline-flex items-center gap-2">
                          <CalendarDaysIcon className="size-4 text-primary-600" />
                          <span>Date (Office processing)</span>
                        </span>
                      }
                      value={value ?? null}
                      onChange={onChange}
                      options={{ disableMobile: true, dateFormat: "d/m/Y" }}
                      placeholder="dd/mm/yyyy"
                      error={errors?.school_section_date?.message}
                      {...rest}
                    />
                  )}
                />
              </div>

              {/* Authorized Signatory (Signature Pad) — RIGHT col */}
              <div className="min-w-0">
                <div className="rounded-2xl border p-3">
                  <div className="grid gap-3">
                    <div className="rounded-xl border bg-white">
                      <Controller
                        name="school_authorized_sign"
                        control={control}
                        defaultValue=""
                        render={() => (
                          <SignaturePad
                            ref={officeSigRef}
                            onEnd={handleOfficeCapture}
                            canvasProps={{ className: "block h-32 w-full rounded-xl" }}
                          />
                        )}
                      />
                    </div>

                    {/* caption below the line */}
                    <p className="text-center text-xs text-gray-600">
                      Authorized Signatory
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleOfficeClear}
                        className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Clear
                      </button>
                      {errors?.school_authorized_sign?.message && (
                        <p className="text-xs text-red-600">
                          {errors.school_authorized_sign.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* <<< end 2-col sm grid */}
            </div>
          </div>
        </div>
      </Card>

      {/* Contact line */}
      <div className="mt-6 rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
        <div className="inline-flex items-center gap-2">
          <EnvelopeIcon className="size-4 text-primary-600" />
          <span>Questions? Contact</span>
        </div>
        <div className="mt-1 text-gray-800">
          {schoolName} •{" "}
          <a href="mailto:info@myschoolitaly.com" className="text-primary-600 hover:underline">
            info@myschoolitaly.com
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] leading-5 text-gray-500">
        By signing, you acknowledge that you have read, understood, and agree to the terms of this waiver.
      </p>
    </div>
  );
}
