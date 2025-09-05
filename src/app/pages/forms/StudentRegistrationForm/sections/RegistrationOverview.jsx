import {
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { Card } from "components/ui";

export default function RegistrationOverview() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const academicYearLabel = `${currentYear}–${nextYear.toString().slice(-2)}`; // 2024–25
  const physicalExamDeadline = `June 1, ${currentYear}`;

  const eligibilityList = [
    { date: `1/4/${currentYear - 3}`, grade: "Nursery" },
    { date: `1/4/${currentYear - 4}`, grade: "K-1" },
    { date: `1/4/${currentYear - 5}`, grade: "K-2" },
  ];

  return (
    <Card className="mb-4 p-4 sm:px-5">
      <div className="mb-3 flex items-center gap-2">
        <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-5" />
        <h2 className="dark:text-dark-50 text-base font-semibold text-gray-800">
          Registration Overview — {academicYearLabel}
        </h2>
      </div>

      {/* Eligibility */}
      <div className="mt-2">
        <div className="mb-1 flex items-center gap-2">
          <AcademicCapIcon className="text-primary-600 dark:text-primary-400 size-4" />
          <span className="dark:text-dark-100 text-sm font-medium text-gray-800">
            Eligibility
          </span>
        </div>
        <ul className="mt-1 space-y-1">
          {eligibilityList.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
              <span className="dark:text-dark-100 text-sm text-gray-700">
                A child born on/before <strong>{item.date}</strong> is eligible
                for <strong>{item.grade}</strong> in {academicYearLabel}.
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps to register */}
      <div className="mt-4">
        <div className="mb-1 flex items-center gap-2">
          <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-4" />
          <span className="dark:text-dark-100 text-sm font-medium text-gray-800">
            To register, you will need to:
          </span>
        </div>
        <ul className="mt-1 space-y-1">
          {[
            "Fill out the registration forms.",
            "Make a registration appointment.",
            "Bring all required documents on your assigned appointment date.",
          ].map((step, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
              <span className="dark:text-dark-100 text-sm text-gray-700">
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Forms to complete */}
      <div className="mt-4">
        <div className="mb-1 flex items-center gap-2">
          <DocumentPlusIcon className="text-primary-600 dark:text-primary-400 size-4" />
          <span className="dark:text-dark-100 text-sm font-medium text-gray-800">
            Forms to complete (5):
          </span>
        </div>
        <ul className="mt-1 space-y-1">
          {[
            "Registration Form",
            "Health Form*",
            "Oral Form*",
            "Privacy Form",
            "Waiver of Liability Form",
          ].map((form, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
              <span className="dark:text-dark-100 text-sm text-gray-700">
                {form}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 rounded-md bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
          * The <strong>Health Form</strong> and <strong>Oral Form</strong> must
          be completed by the child’s doctor and dentist and submitted before
          school starts. Physical exams for {academicYearLabel} registrants must
          be done after <strong>{physicalExamDeadline}</strong>.
        </div>
      </div>

      {/* Documents required */}
      <div className="mt-4">
        <div className="mb-1 flex items-center gap-2">
          <BriefcaseIcon className="text-primary-600 dark:text-primary-400 size-4" />
          <span className="dark:text-dark-100 text-sm font-medium text-gray-800">
            Documents to bring:
          </span>
        </div>
        <ul className="mt-1 space-y-1">
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
            <span className="dark:text-dark-100 text-sm text-gray-700">
              Original Birth Certificate and a <strong>photocopy</strong> (for
              office use).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
            <span className="dark:text-dark-100 text-sm text-gray-700">
              Immunisation Record — current to date from your child’s doctor,
              plus a <strong>photocopy</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="mt-0.5 size-4 text-emerald-600" />
            <span className="dark:text-dark-100 text-sm text-gray-700">
              Proof of Residence (<strong>Aadhaar Card of parents</strong>) and
              a <strong>photocopy</strong>.
            </span>
          </li>
        </ul>
      </div>
    </Card>
  );
}
