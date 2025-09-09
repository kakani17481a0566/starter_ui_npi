import axios from "axios";
import { getSessionData } from "utils/sessionStorage";


export async function getTest() {
    const tenantId=getSessionData();
  const { data } = await axios.get(`https://localhost:7202/api/Branch/dropdown-options/${tenantId.tenantId}`);
  // Accept both {data:[...]} or direct array
  const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  // Normalize to { id, name }
  return list.map(b => ({
    id: b.id ?? b.Id ?? b.branchId,
    name: b.name ?? b.Name ?? b.branchName,
  }));
}
