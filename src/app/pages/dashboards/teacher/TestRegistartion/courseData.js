import axios from "axios";
import { getSessionData } from "utils/sessionStorage";


export async function getCoursesByBranch() {
const tenantId=getSessionData();
//   if (!branchId) return [];
  // Try query pattern first:
  const { data } = await axios.get(`https://localhost:7202/api/Course/dropdown-options-course/${tenantId.tenantId}`);
  const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  return list.map(c => ({
    id: c.id ?? c.Id ?? c.id,
    name: c.name ?? c.Name ?? c.name,
  }));
}
