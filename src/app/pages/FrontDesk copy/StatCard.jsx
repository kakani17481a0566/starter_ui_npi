// src/app/pages/FrontDesk/StatCard.jsx
export default function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4
        text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-dark-700
        bg-gradient-to-br ${gradient}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/70 dark:bg-dark-700 shadow">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium opacity-80">{title}</p>
        </div>
      </div>
    </div>
  );
}
