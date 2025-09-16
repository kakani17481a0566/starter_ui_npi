import { payments } from "./data";

export default function PaymentsTable() {
  return (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-red-50 text-red-600">
          <th className="p-2 text-left">Payer</th>
          <th className="p-2 text-left">Student ID</th>
          <th className="p-2 text-left">Type</th>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Method</th>
          <th className="p-2 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p, idx) => (
          <tr key={idx} className="border-b hover:bg-red-50/30">
            <td className="p-2">{p.payer}</td>
            <td className="p-2">{p.studentId}</td>
            <td className="p-2">{p.type}</td>
            <td className="p-2">${p.amount.toFixed(2)}</td>
            <td className="p-2">{p.method}</td>
            <td className="p-2">{p.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
