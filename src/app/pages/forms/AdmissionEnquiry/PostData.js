import axios from "axios";
import { normalizeCountry } from "./utils";
import {base64ToBlob} from "components/shared/base64ConversionToBlob.jsx";

const API_URL = "https://localhost:7202/api/StudentEnquiry/create";

export async function submitAdmissionEnquiry(data) {
  const asInt = (v) => (v === "" || v == null ? null : Number(v));
  const asBool = (v) => Boolean(v);
  const byteArray=base64ToBlob(data.signature);

  const dobIso = data?.dob ? new Date(data.dob).toISOString() : null;

  const payload = {
    StudentFirstName: data.studentFirstName?.trim() ?? "",
    StudentMiddleName: data.studentMiddleName ?? "",
    StudentLastName: data.studentLastName?.trim() ?? "",
    Dob: dobIso,
    GenderId: asInt(data.genderId),
    AdmissionCourseId: asInt(data.admissionCourseId),

    PrevSchoolName: data.prevSchoolName ?? "",
    FromCourseId: asInt(data.fromCourseId),
    FromYear: asInt(data.fromYear),
    ToCourseId: asInt(data.toCourseId),
    ToYear: asInt(data.toYear),

    IsGuardian: asBool(data.isGuardian),

    ParentFirstName: data.parentFirstName?.trim() ?? "",
    ParentMiddleName: data.parentMiddleName ?? "",
    ParentLastName: data.parentLastName?.trim() ?? "",
    ParentPhone: data.parentPhone ?? "",
    ParentAlternatePhone: "0",
    parentEmail: data.parentEmail ?? "",
    ParentAddress1: data.parentAddress1 ?? ""+ normalizeCountry(data.country),
    ParentAddress2: data.parentAddress2 ?? "",
    ParentCity: data.parentCity ?? "",
    ParentState: data.parentState ?? "",
    ParentPincode: data.parentPincode ?? "",
    ParentQualification: data.parentQualification ?? "",
    ParentProfession: data.parentProfession ?? "",

    MotherFirstName: data.motherFirstName?.trim() ?? "",
    MotherMiddleName: data.motherMiddleName ?? "",
    MotherLastName: data.motherLastName?.trim() ?? "",
    MotherPhone: data.motherPhone ?? "",
    MotherEmail: data.motherEmail ?? "",
    MotherQualification: data.motherQualification ?? "",
    MotherProfession: data.motherProfession ?? "",

    HearAboutUsTypeId: asInt(data.hearAboutUsTypeId),
    IsAgreedToTerms: asBool(data.isAgreedToTerms),
    Signature: byteArray?? "",

    StatusId: asInt(data.statusId),
    TenantId: asInt(data.tenantId),
    BranchId: asInt(data.branchId),
    CreatedBy: asInt(data.createdBy),

    // country:,
    // correspondence_country: normalizeCountry(data.correspondence_country),
  };

  const response = await axios.post(API_URL, payload, {
    headers: { "Content-Type": "application/json", Accept: "*/*" },
    // withCredentials: true, // uncomment if you need cookies
  });

  return response.data;
}
