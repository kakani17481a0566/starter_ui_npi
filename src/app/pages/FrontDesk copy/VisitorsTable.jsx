import StatusBadge from "./StatusBadge";
import { visitors } from "./data";

export default function VisitorsTable() {
  return (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-yellow-50 text-yellow-600">
          <th className="p-2 text-left">Visitor</th>
          <th className="p-2 text-left">Meeting With</th>
          <th className="p-2 text-left">Time</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {visitors.map((v, idx) => (
          <tr key={idx} className="border-b hover:bg-yellow-50/30">
            <td className="p-2">{v.visitor}</td>
            <td className="p-2">{v.person}</td>
            <td className="p-2">{v.time}</td>
            <td className="p-2">
              <StatusBadge status={v.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
