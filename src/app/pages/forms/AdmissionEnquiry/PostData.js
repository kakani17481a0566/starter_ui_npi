import axios from "axios";
import { normalizeCountry } from "./utils";

const API_URL = "https://localhost:7202/api/StudentEnquiry/create";

export async function submitAdmissionEnquiry(data) {
  // Convert any form values into expected payload
  const asInt = (v) => (v === "" || v == null ? null : Number(v));
  const asBool = (v) => Boolean(v);

  const dobIso = data?.dob ? new Date(data.dob).toISOString() : null;

  const payload = {
    studentFirstName: data.studentFirstName?.trim() ?? "",
    studentMiddleName: data.studentMiddleName ?? "",
    studentLastName: data.studentLastName?.trim() ?? "",
    dob: dobIso,
    genderId: asInt(data.genderId),
    admissionCourseId: asInt(data.admissionCourseId),

    prevSchoolName: data.prevSchoolName ?? "",
    fromCourseId: asInt(data.fromCourseId),
    fromYear: asInt(data.fromYear),
    toCourseId: asInt(data.toCourseId),
    toYear: asInt(data.toYear),

    isGuardian: asBool(data.isGuardian),

    parentFirstName: data.parentFirstName?.trim() ?? "",
    parentMiddleName: data.parentMiddleName ?? "",
    parentLastName: data.parentLastName?.trim() ?? "",
    parentPhone: data.parentPhone ?? "",
    parentAlternatePhone: data.parentAlternatePhone ?? "",
    parentEmail: data.parentEmail ?? "",
    parentAddress1: data.parentAddress1 ?? "",
    parentAddress2: data.parentAddress2 ?? "",
    parentCity: data.parentCity ?? "",
    parentState: data.parentState ?? "",
    parentPincode: data.parentPincode ?? "",
    parentQualification: data.parentQualification ?? "", // ✅ add this
    parentProfession: data.parentProfession ?? "", // ✅ add this

    motherFirstName: data.motherFirstName?.trim() ?? "",
    motherMiddleName: data.motherMiddleName ?? "",
    motherLastName: data.motherLastName?.trim() ?? "",
    motherPhone: data.motherPhone ?? "",
    motherEmail: data.motherEmail ?? "",
    motherQualification: data.motherQualification ?? "", // ✅ add this
    motherProfession: data.motherProfession ?? "", // ✅ add this

    hearAboutUsTypeId: asInt(data.hearAboutUsTypeId),
    isAgreedToTerms: asBool(data.isAgreedToTerms),
    signature: data.signature ?? "",

    statusId: asInt(data.statusId),
    tenantId: asInt(data.tenantId),
    branchId: asInt(data.branchId),
    createdBy: asInt(data.createdBy),

    country: normalizeCountry(data.country),
    correspondence_country: normalizeCountry(data.correspondence_country),
  };

  // Normalize countries (if using them later)
  payload.country = normalizeCountry(data.country);
  payload.correspondence_country = normalizeCountry(
    data.correspondence_country,
  );

  // Send to ASP.NET Core API
  const response = await axios.post(API_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  });

  return response.data;
}
