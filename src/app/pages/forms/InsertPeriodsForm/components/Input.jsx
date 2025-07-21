import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      labelSlot, // e.g. <span>*</span>
      error,
      className = "",
      type = "text",
      placeholder = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        {/* Label */}
        <label
          className="mb-1 block text-sm font-medium text-primary-950 dark:text-white"
          htmlFor={props.id || props.name}
        >
          <span className="flex items-center gap-1">
            {label}
            {labelSlot && <span>{labelSlot}</span>}
          </span>
        </label>

        {/* Input field */}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={clsx(
            "block w-full rounded-md border px-3 py-2 text-sm text-primary-950 shadow-sm transition-all placeholder:text-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary-500",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />

        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
