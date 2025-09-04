export default function LabelWithIcon({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="size-4 text-primary-600 dark:text-primary-400" />
      <span>{children}</span>
    </span>
  );
}
