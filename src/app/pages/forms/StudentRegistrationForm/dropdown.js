import axios from "axios";

// 🔹 Fetch branch dropdown options
export async function fetchBranchOptions(tenantId = 1) {
  const response = await axios.get(
    `https://localhost:7202/api/Branch/dropdown-options/${tenantId}`
  );
  return (
    response?.data?.data?.map((b) => ({
      value: b.id,
      label: b.name,
    })) ?? []
  );
}

// 🔹 Fetch course dropdown options
export async function fetchCourseOptions(tenantId = 1) {
  const response = await axios.get(
    `https://localhost:7202/api/Course/dropdown-options-course/${tenantId}`
  );
  return (
    response?.data?.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) ?? []
  );
}

// 🔹 Transport options (masters_type_id = 48)
export async function fetchTransportOptions(tenantId) {
  const res = await axios.get(
    `https://localhost:7202/getByMasterTypeId/48/${tenantId}?isUtilites=false`
  );
  return res.data?.data || [];
}

// 🔹 Allergy options (masters_type_id = 50)
export async function fetchAllergyOptions(tenantId) {
  const res = await axios.get(
    `https://localhost:7202/getByMasterTypeId/50/${tenantId}?isUtilites=false`
  );
  return res.data?.data || [];
}

// 🔹 Write ability options (masters_type_id = 53)
export async function fetchWriteAbilityOptions(tenantId) {
  const res = await axios.get(
    `https://localhost:7202/getByMasterTypeId/53/${tenantId}?isUtilites=false`
  );
  return res.data?.data || [];
}

// 🔹 Custody options (masters_type_id = 52)
export async function fetchCustodyOptions(tenantId) {
  const res = await axios.get(
    `https://localhost:7202/getByMasterTypeId/52/${tenantId}?isUtilites=false`
  );
  return res.data?.data || [];
}

// 🔹 Read ability options (masters_type_id = 47)
export async function fetchReadAbilityOptions(tenantId) {
  const res = await axios.get(
    `https://localhost:7202/getByMasterTypeId/47/${tenantId}?isUtilites=false`
  );
  return res.data?.data || [];
}

// 🔹 Lives With options (masters_type_id = 54) ✅ NEW
export async function fetchLivesWithOptions(tenantId) {
  const res = await axios.get(
    `https://localhost:7202/getByMasterTypeId/44/${tenantId}?isUtilites=false`
  );
  return res.data?.data || [];
}
