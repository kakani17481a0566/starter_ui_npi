// src/app/components/form/RHFInput.jsx
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "components/ui";

export default function RHFInput({
  name,
  label,
  placeholder,
  disabled,
  inputMode,
  autoComplete,
  onBlur, // optional extra behavior
}) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          autoComplete={autoComplete}
          error={errors?.[name]?.message}
          onBlur={(e) => {
            field.onBlur?.(e);
            onBlur?.(e);
          }}
        />
      )}
    />
  );
}
