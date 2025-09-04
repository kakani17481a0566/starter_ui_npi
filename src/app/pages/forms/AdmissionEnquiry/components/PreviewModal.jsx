import { useMemo } from "react";
import PropTypes from "prop-types";
import { genders, grades, heardAboutUs } from "../data";

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-dark-100">{title}</h4>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-dark-300">{label}</span>
      <span className="text-sm text-gray-900 dark:text-dark-100 break-words">{value || "—"}</span>
    </div>
  );
}

const labelOf = (list, id) => list.find((x) => x.id === id)?.label ?? id ?? "—";
const fmtDate = (val) => {
  if (!val) return "—";
  const d = val instanceof Date ? val : new Date(val);
  return isNaN(d) ? "—" : d.toLocaleDateString();
};
const fmtCountry = (c) =>
  typeof c === "string"
    ? c
    : c?.label || c?.name || c?.value || c?.code || c?.iso2 || "—";
const fmtPhone = (dial, num) => [dial || "", num || ""].filter(Boolean).join(" ");

export default function PreviewModal({ open, values, onClose }) {
  const data = useMemo(() => {
    if (!values) return null;
    const d = values;
    return {
      student: {
        name: [d.student_first_name, d.student_middle_name, d.student_last_name].filter(Boolean).join(" "),
        dob: fmtDate(d.dob),
        gender: labelOf(genders, d.gender),
        grade: labelOf(grades, d.grade_applying_for),
        phone: fmtPhone(d.student_dialCode, d.student_phone),
      },
      previousSchool: {
        school: d.prev_school_name || "—",
        from: { grade: labelOf(grades, d.from_grade), year: d.from_year ?? "—" },
        to:   { grade: labelOf(grades, d.to_grade),   year: d.to_year ?? "—" },
      },
      address: {
        permanent: {
          line1: d.address_line1 || "—",
          line2: d.address_line2 || "—",
          city: d.city || "—",
          state: d.state || "—",
          postal: d.postal_code || "—",
          country: fmtCountry(d.country),
        },
        sameAsPermanent: !!d.isSameCorrespondenceAddress,
        correspondence: {
          line1: d.correspondence_address_line1 || "—",
          line2: d.correspondence_address_line2 || "—",
          city: d.correspondence_city || "—",
          state: d.correspondence_state || "—",
          postal: d.correspondence_postal_code || "—",
          country: fmtCountry(d.correspondence_country),
        },
      },
      parent: {
        relation: d.relation_type === "guardian" ? "Guardian" : "Parent",
        name: [d.parent_first_name, d.parent_middle_name, d.parent_last_name].filter(Boolean).join(" "),
        qualification: d.parent_qualification || "—",
        profession: d.parent_profession || "—",
        phone: fmtPhone(d.parent_dialCode, d.parent_phone),
        email: d.parent_email || "—",
      },
      mother: {
        name: [d.mother_first_name, d.mother_middle_name, d.mother_last_name].filter(Boolean).join(" "),
        qualification: d.mother_qualification || "—",
        profession: d.mother_profession || "—",
        phone: fmtPhone(d.mother_dialCode, d.mother_phone),
        email: d.mother_email || "—",
      },
      marketing: {
        heard: labelOf(heardAboutUs, d.heard_about_us),
        consent: d.consent_agree ? "Agreed" : "Not agreed",
        signature: d.e_signature || "—",
      },
    };
  }, [values]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-20 top-10 bottom-10 bg-white dark:bg-dark-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-dark-500 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900 dark:text-dark-100">
            Preview — Student Enquiry
          </h3>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-dark-400 dark:hover:bg-dark-600"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto px-5 pb-6">
          {!data ? (
            <p className="text-sm text-gray-500 dark:text-dark-300 mt-6">Nothing to preview.</p>
          ) : (
            <>
              <Section title="Student Details">
                <Row label="Name" value={data.student.name} />
                <Row label="DOB" value={data.student.dob} />
                <Row label="Gender" value={data.student.gender} />
                <Row label="Grade Applying For" value={data.student.grade} />
                <Row label="Student Phone" value={data.student.phone} />
              </Section>

              <Section title="Previous School">
                <Row label="School Name" value={data.previousSchool.school} />
                <Row label="From Grade" value={data.previousSchool.from.grade} />
                <Row label="From Year" value={String(data.previousSchool.from.year)} />
                <Row label="To Grade" value={data.previousSchool.to.grade} />
                <Row label="To Year" value={String(data.previousSchool.to.year)} />
              </Section>

              <Section title="Permanent Address">
                <Row label="Address Line 1" value={data.address.permanent.line1} />
                <Row label="Address Line 2" value={data.address.permanent.line2} />
                <Row label="City" value={data.address.permanent.city} />
                <Row label="State/Province" value={data.address.permanent.state} />
                <Row label="Postal Code" value={data.address.permanent.postal} />
                <Row label="Country" value={data.address.permanent.country} />
              </Section>

              <Section title="Correspondence Address">
                <Row label="Same as Permanent" value={data.address.sameAsPermanent ? "Yes" : "No"} />
                {!data.address.sameAsPermanent && (
                  <>
                    <Row label="Address Line 1" value={data.address.correspondence.line1} />
                    <Row label="Address Line 2" value={data.address.correspondence.line2} />
                    <Row label="City" value={data.address.correspondence.city} />
                    <Row label="State/Province" value={data.address.correspondence.state} />
                    <Row label="Postal Code" value={data.address.correspondence.postal} />
                    <Row label="Country" value={data.address.correspondence.country} />
                  </>
                )}
              </Section>

              <Section title="Father / Guardian">
                <Row label="Relation" value={data.parent.relation} />
                <Row label="Name" value={data.parent.name} />
                <Row label="Qualification" value={data.parent.qualification} />
                <Row label="Profession" value={data.parent.profession} />
                <Row label="Mobile Number" value={data.parent.phone} />
                <Row label="Email" value={data.parent.email} />
              </Section>

              <Section title="Mother">
                <Row label="Name" value={data.mother.name} />
                <Row label="Qualification" value={data.mother.qualification} />
                <Row label="Profession" value={data.mother.profession} />
                <Row label="Mobile Number" value={data.mother.phone} />
                <Row label="Email" value={data.mother.email} />
              </Section>

              <Section title="Marketing & Consent">
                <Row label="How did you hear about us?" value={data.marketing.heard} />
                <Row label="Consent" value={data.marketing.consent} />
                <Row label="E-Signature" value={data.marketing.signature} />
              </Section>
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 dark:border-dark-500 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-dark-400 dark:hover:bg-dark-600"
          >
            Edit
          </button>
          {/* Optional: add a Save action via prop and show a primary button */}
        </div>
      </div>
    </div>
  );
}

PreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  values: PropTypes.object,   // raw form values snapshot
  onClose: PropTypes.func.isRequired,
};

Section.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
};

Row.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node,
};
