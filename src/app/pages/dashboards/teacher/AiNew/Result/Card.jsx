// src/components/Card.jsx
export default function Card({ name, isCorrect }) {
  const color = isCorrect ? "green" : "red";

  const classes = isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300";
  const badgeClasses = isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white";

  return (
    <div className={`rounded-2xl border shadow-sm p-4 sm:p-5 flex flex-col ${classes}`}>
      <div className="flex items-start gap-3">
        <AppleIcon className="w-10 h-10 shrink-0" tint={color} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">{name}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full ${badgeClasses}`}>
              {isCorrect ? "Correct" : "Wrong"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            This card is marked <strong>{isCorrect ? "correct" : "wrong"}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline Apple SVG so you don't need external assets
function AppleIcon({ className = "w-8 h-8", tint = "green" }) {
  const fill = tint === "red" ? "#dc2626" : "#16a34a";
  const leaf = tint === "red" ? "#991b1b" : "#166534";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M40.5 10.5c-2.7 0-5.5 1.8-7.2 4.5-1.7 2.7-2.4 5.4-1.8 5.7.6.2 3.2-1.2 5.3-3.5 2.3-2.6 3.9-6.7 3.7-6.7z" fill={leaf}/>
      <path d="M47 24c-2.7-2.1-6.2-3.4-9.5-3.4-3 0-4.2 1-7.5 1-3.3 0-4.7-1-7.7-1-3.2 0-6.6 1.8-9.3 4.9C9.5 29.9 8 34.9 8 40c0 5.2 1.7 10.4 4.7 14.1 2.3 2.9 5 4.4 7.9 4.4 3 0 4.8-1 7.8-1 3.1 0 4.6 1 7.7 1 3 0 5.8-1.6 8-4.5C49 50.8 50.5 45.7 50.5 40c0-5.8-1.8-10.1-3.5-12z" fill={fill}/>
    </svg>
  );
}
