import axios from "axios";



export async function getStudentsByCourse(branchId,courseId) {
  if (!courseId) return [];
  const { data } = await axios.get(`https://localhost:7202/api/Student/dropdown-options-students?tenantId=1&courseId=${courseId}&branchId=${branchId}`);
  const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  return list.map(s => ({
    id: s.id ?? s.Id ?? s.studentId,
    name: s.fullName ?? s.name,
  }));
}
