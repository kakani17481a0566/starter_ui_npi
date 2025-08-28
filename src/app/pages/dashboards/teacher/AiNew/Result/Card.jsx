// src/components/Card.jsx
import { useMemo, useState } from "react";
import { driveImageUrl } from "./driveImageUrl";

export default function Card({ name, isCorrect, url,onClick }) {
  const badgeClasses = isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white";
  const { thumb, view } = useMemo(() => driveImageUrl(url, 512), [url]);
  const [src, setSrc] = useState(thumb || url);

  // background + border (doesn't affect layout)
  const bgRing =
    isCorrect
      ? "bg-green-50 ring-1 ring-inset ring-green-300"
      : "bg-red-50 ring-1 ring-inset ring-red-300";

  return (
    
    <div className="relative inline-block rounded-2xl">
        <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 p-4 text-left hover:shadow focus:outline-none focus:ring"
    >
      {/* background layer that doesn't change sizing */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none ${bgRing}`} aria-hidden="true" />
     
      {/* your original row — unchanged */}
      <div className="relative flex items-center gap-4">
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded overflow-hidden bg-slate-200">
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover block"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => { if (src !== view) setSrc(view); }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800 truncate">{name}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full ${badgeClasses}`}>
              {isCorrect ? "Correct" : "Wrong"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            The pronunciation is <strong>{isCorrect ? "correct" : "wrong"}</strong>.
          </p>
        </div>
      </div>
      </button>
    </div>
  );
}
