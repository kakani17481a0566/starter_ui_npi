import StatusBadge from "./StatusBadge";
import { teachers } from "./data";

export default function TeacherAttendanceTable() {
  return (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-blue-50 text-blue-600">
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Dept.</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((t, idx) => (
          <tr key={idx} className="border-b hover:bg-blue-50/30">
            <td className="p-2">{t.name}</td>
            <td className="p-2">{t.department}</td>
            <td className="p-2">
              <StatusBadge status={t.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
