import StatusBadge from "./StatusBadge";

export default function AttendanceStatusDisplayTable({ data }) {
  return (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-blue-50 text-blue-600">
          {data.headers.map((header, index) => (
            <th key={index} className="p-2 text-left capitalize">
              {header.replace(/([A-Z])/g, " $1").trim()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.records.map((record, idx) => (
          <tr key={idx} className="border-b hover:bg-blue-50/30">
            <td className="p-2">{record.studentName}</td>
            <td className="p-2">{record.className}</td>
            <td className="p-2">
              <StatusBadge status={record.attendanceStatus} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
