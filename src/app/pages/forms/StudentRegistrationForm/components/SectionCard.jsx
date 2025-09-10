// src/app/pages/forms/StudentRegistrationForm/components/SectionCard.jsx
import { forwardRef, useId } from "react";
import { Card } from "components/ui";
import clsx from "clsx";

const elevationToShadow = {
  0: "shadow-none",
  1: "shadow-sm",
  2: "shadow",
  3: "shadow-md",
  4: "shadow-lg",
  5: "shadow-xl",
  6: "shadow-2xl",
};

const radiusMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const paddingMap = {
  sm: "p-3 sm:px-4",
  md: "p-4 sm:px-5",
  lg: "p-6 sm:px-7",
};

const variantClasses = {
  solid: "bg-white dark:bg-dark-800",
  soft: "bg-gray-50 dark:bg-dark-900",
  outlined:
    "bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600",
  ghost: "",
};

const SectionCard = forwardRef(function SectionCard(
  {
    children,
    className,
    elevation = 6,     // default raised look
    hoverLift = true,  // default hovering effect
    // new:
    variant = "solid",
    padding = "md",
    radius = "xl",
    interactive = false,
    title,
    subtitle,
    icon: Icon,
    actions,
    id,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const shadow = elevationToShadow[Math.max(0, Math.min(6, elevation))];
  const radiusCls = radiusMap[radius] || radiusMap.xl;
  const padCls = paddingMap[padding] || paddingMap.md;
  const varCls = variantClasses[variant] || variantClasses.solid;
  const headerId = title ? (id ? `${id}__title` : `${autoId}__title`) : undefined;

  return (
    <Card
      ref={ref}
      {...rest}
      id={id}
      role={title ? "region" : rest.role}
      aria-labelledby={title ? headerId : rest["aria-labelledby"]}
      tabIndex={interactive ? 0 : rest.tabIndex}
      className={clsx(
        padCls,
        radiusCls,
        varCls,
        shadow,
        (hoverLift || interactive) &&
          "transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-xl",
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
        "outline-none",
        className
      )}
    >
      {(title || actions || Icon || subtitle) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && (
              <Icon
                className="size-5 shrink-0 text-primary-600 dark:text-primary-400"
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              {title && (
                <h3
                  id={headerId}
                  className="truncate text-base font-medium text-gray-800 dark:text-dark-100"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="truncate text-xs text-gray-500 dark:text-dark-300">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </Card>
  );
});

export default SectionCard;
