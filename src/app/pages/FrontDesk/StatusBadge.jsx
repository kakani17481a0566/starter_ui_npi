export default function StatusBadge({ status }) {
  const colors = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    "On Leave": "bg-blue-100 text-blue-700",
    Late: "bg-yellow-100 text-yellow-700",
    Tardy: "bg-yellow-100 text-yellow-700",
    Excused: "bg-purple-100 text-purple-700",
    "Checked In": "bg-green-100 text-green-700",
    Waiting: "bg-yellow-100 text-yellow-700",
  };

  const fallback = "bg-gray-100 text-gray-700";

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        colors[status] || fallback
      }`}
    >
      {status}
    </span>
  );
}
