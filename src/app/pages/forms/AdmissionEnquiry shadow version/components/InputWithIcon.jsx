import { Input } from "components/ui";
export default function InputWithIcon({ icon: Icon, error, className = "", ...inputProps }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-[34px] left-3 size-4 text-gray-400" />
      <Input {...inputProps} error={error} className={`pl-10 ${className}`} />
    </div>
  );
}
