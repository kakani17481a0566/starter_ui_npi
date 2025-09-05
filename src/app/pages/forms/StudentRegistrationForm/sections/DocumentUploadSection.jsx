import { useFormContext, Controller } from "react-hook-form";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { Card, Input } from "components/ui";

/**
 * DocumentUploadSection renders a set of file upload fields for documents.
 *
 * @param {string} title - Title of the card
 * @param {Array} documents - Array of { name, label, accept? }
 */
export default function DocumentUploadSection({ title = "Upload Documents", documents = [] }) {
  const {
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <Card className="mt-4 p-4 sm:px-5">
      <div className="mb-3 flex items-center gap-2">
        <PaperClipIcon className="text-primary-600 dark:text-primary-400 size-5" />
        <h3 className="text-base font-medium dark:text-dark-50 text-gray-800">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {documents.map(({ name, label, accept = ".pdf,.jpg,.jpeg,.png" }) => {
          const file = watch(name);

          return (
            <div key={name} className="col-span-12 md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {label}
              </label>

              <Controller
                name={name}
                control={control}
                render={() => (
                  <Input
                    type="file"
                    accept={accept}
                    onChange={(e) => {
                      setValue(name, e.target.files[0], { shouldValidate: true });
                    }}
                    error={errors?.[name]?.message}
                  />
                )}
              />

              {file && (
                <p className="mt-1 text-sm text-gray-600 dark:text-dark-100">
                  Selected: <strong>{file.name}</strong>
                </p>
              )}

              {errors?.[name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[name].message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
