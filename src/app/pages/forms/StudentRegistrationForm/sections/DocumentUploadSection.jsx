// DocumentUploadSection.jsx
import { useFormContext } from "react-hook-form";
import { PaperClipIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { FilePond } from "components/shared/form/Filepond";
import { Button } from "components/ui";
import SectionCard from "../components/SectionCard";

export default function DocumentUploadSection({
  title = "Upload Documents",
  documents = [],
}) {
  const { setValue, clearErrors, formState: { errors }, watch } = useFormContext();

  const fileValue = (field) => watch(field);

  const handleSelectFile = (name, file) => {
    setValue(name, file || null, { shouldValidate: true, shouldDirty: true });
    if (!file) clearErrors(name);
  };

  const handleRemove = (name) => {
    setValue(name, null, { shouldValidate: true, shouldDirty: true });
    clearErrors(name);
  };

  return (
    <SectionCard title={title} icon={PaperClipIcon} variant="outlined" elevation={1} padding="md">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map(({ name, label, accept = ".pdf,.jpg,.jpeg,.png" }) => {
          const file = fileValue(name);
          return (
            <div key={name} className="w-full">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {label}
              </label>

              <FilePond
                allowMultiple={false}
                acceptedFileTypes={accept.split(",")}
                onupdatefiles={(files) => handleSelectFile(name, files?.[0]?.file)}
                maxFiles={1}
              />

              {file && (
                <Button
                  size="sm"
                  variant="twoTone"
                  onClick={() => handleRemove(name)}
                  className="mt-2"
                  icon={<XCircleIcon className="size-4" />}
                >
                  Remove
                </Button>
              )}

              {errors?.[name] && (
                <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
