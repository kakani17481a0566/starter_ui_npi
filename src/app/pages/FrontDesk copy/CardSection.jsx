// src/app/pages/FrontDesk/CardSection.jsx
export default function CardSection({ title, icon, children, color = "blue" }) {
  const colorMap = {
    blue: "from-blue-50 to-blue-100 text-blue-600 dark:from-blue-900/40 dark:to-blue-800/30 dark:text-blue-400",
    green: "from-green-50 to-green-100 text-green-600 dark:from-green-900/40 dark:to-green-800/30 dark:text-green-400",
    purple: "from-purple-50 to-purple-100 text-purple-600 dark:from-purple-900/40 dark:to-purple-800/30 dark:text-purple-400",
    amber: "from-amber-50 to-amber-100 text-amber-600 dark:from-amber-900/40 dark:to-amber-800/30 dark:text-amber-400",
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-dark-700">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-700">
        {icon && (
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[color]} shadow-sm`}
          >
            {icon}
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
