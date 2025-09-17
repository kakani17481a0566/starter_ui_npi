// src/app/pages/FrontDesk/Transactions.jsx

import clsx from "clsx";
import { Avatar, Card } from "components/ui";

export function Transactions({ data = [] }) {
  // 🔹 Safe date formatter
  const formatDateTime = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleString();
  };

  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 min-w-0 items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Transactions
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>

      {data.length === 0 ? (
        <p className="px-2 py-4 text-sm text-gray-500 dark:text-dark-300">
          No transactions found for this date.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((payment) => (
            <div
              key={payment.uid}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  size={10}
                  src={payment.avatar}
                  name={payment.name}
                  initialColor="auto"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {payment.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-dark-300">
                    {formatDateTime(payment.time)}
                  </span>
                </div>
              </div>
              <span
                className={clsx(
                  payment.amount > 0 ? "text-success-600" : "text-error-600",
                  "text-sm font-medium",
                )}
              >
                ${Math.abs(payment.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
