// src/app/pages/forms/StudentRegistrationForm/components/SectionCard.jsx
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

export default function SectionCard({
  children,
  className,
  elevation = 6,     // default raised look
  hoverLift = true,  // default hovering effect
}) {
  const shadow = elevationToShadow[Math.max(0, Math.min(6, elevation))];

  return (
    <Card
      className={clsx(
        "p-4 sm:px-5 rounded-xl",
        "bg-white dark:bg-dark-800",
        shadow,
        hoverLift &&
          " duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
        className
      )}
    >
      {children}
    </Card>
  );
}
