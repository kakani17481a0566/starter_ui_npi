import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputErrorMsg } from "components/ui";
import { PhoneDialCode } from "./PhoneDialCode";

export default function PhoneField({ dialName, numberName, label = "Mobile Number" }) {
  const { control, register, formState: { errors } } = useFormContext();

  return (
    <div className="col-span-12">
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
        {label}
      </label>
      <div className="mt-1.5 flex -space-x-px">
        <Controller
          name={dialName}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <PhoneDialCode
              onChange={onChange}
              value={value}
              name={name}
              error={Boolean(errors?.[dialName])}
            />
          )}
        />
        <Input
          {...register(numberName)}
          classNames={{
            root: "flex-1",
            input: "hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
          }}
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone number"
          error={Boolean(errors?.[numberName])}
        />
      </div>
      <InputErrorMsg when={errors?.[dialName] || errors?.[numberName]}>
        {errors?.[dialName]?.message ?? errors?.[numberName]?.message}
      </InputErrorMsg>
    </div>
  );
}

PhoneField.propTypes = {
  dialName: PropTypes.string.isRequired,
  numberName: PropTypes.string.isRequired,
  label: PropTypes.node,
};
