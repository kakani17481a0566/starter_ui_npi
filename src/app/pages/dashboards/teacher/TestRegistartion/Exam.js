// src/app/pages/StudentTest/examData.js
import axios from "utils/axios";

export async function getExamTypes(tenantId, masterTypeId = 58) {
  const resp = await axios.get(
    `https://localhost:7202/getByMasterTypeId/${masterTypeId}/${tenantId}?isUtilites=false`,
    { headers: { Accept: "*/*" } }
  );
  return resp.data?.data || [];
}
