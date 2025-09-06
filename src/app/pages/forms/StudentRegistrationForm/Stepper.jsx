import PropTypes from "prop-types";
import clsx from "clsx";
import { HiCheck } from "react-icons/hi";

export function Stepper({
  steps,
  currentStep,
  setCurrentStep,
  lockFuture = true, // if true, you can only click past/current/next step
}) {
  const isDone = (i) => i < currentStep;
  const isActive = (i) => i === currentStep;
  const canOpen = (i) => {
    if (!lockFuture) return true;
    // allow going back to any past step, and the immediate next step
    return i <= currentStep + 1;
  };

  const onKeyNav = (e, idx) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      setCurrentStep(Math.min(idx + 1, steps.length - 1));
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      setCurrentStep(Math.max(idx - 1, 0));
    }
  };

  return (
    <ol className="relative space-y-6" aria-label="Steps">
      {steps.map((s, idx) => {
        const active = isActive(idx);
        const done = isDone(idx);
        const clickable = canOpen(idx);

        return (
          <li key={s.key} className="relative pl-10">
            {/* vertical connector line (hidden on last item) */}
            {idx !== steps.length - 1 && (
              <span
                aria-hidden
                className={clsx(
                  "absolute left-4 top-8 block w-px",
                  "h-[calc(100%-2rem)]",
                  done ? "bg-primary-500" : "bg-gray-200 dark:bg-dark-500"
                )}
              />
            )}

            <button
              type="button"
              onClick={clickable ? () => setCurrentStep(idx) : undefined}
              onKeyDown={(e) => onKeyNav(e, idx)}
              disabled={!clickable}
              aria-current={active ? "step" : undefined}
              aria-disabled={!clickable}
              className={clsx(
                "group flex w-full items-start gap-3 text-left transition",
                clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              )}
            >
              {/* dot */}
              <span
                className={clsx(
                  "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  "ring-offset-2 ring-offset-white dark:ring-offset-dark-900",
                  done
                    ? "bg-primary-600 text-white ring-2 ring-primary-500"
                    : active
                    ? "bg-primary-50 text-primary-700 ring-2 ring-primary-500 dark:bg-gray-800/40 dark:text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                )}
              >
                {done ? <HiCheck className="h-5 w-5" /> : idx + 1}
              </span>

              {/* text */}
              <span className="mt-0.5">
                <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                  {s.label}
                </div>
                {s.description ? (
                  <div className="text-xs text-gray-500 dark:text-dark-300">
                    {s.description}
                  </div>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  lockFuture: PropTypes.bool,
};
