import axios from "axios";



export async function getStudentTest(examTypeId) {
  // if (!courseId) return [];
  // console.log(examTypeId);
  const { data } = await axios.get(`https://localhost:7202/api/Test`,{
    params:{masterId:examTypeId}});
  const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  return list.map(s => ({
    id: s.id ?? s.Id ?? s.id,
    name: s.name ?? s.name,
  }));
}