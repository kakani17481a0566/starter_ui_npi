import { Upload, Button } from "components/ui";
import { FileItem } from "components/shared/form/FileItem";
import { useDropzone } from "react-dropzone";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function DocumentUploader({ doc, file, onFileChange, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileChange(doc.id, acceptedFiles[0] || null),
    accept: doc.accept.reduce((acc, type) => {
      const ext =
        type === "application/pdf" ? [".pdf"] : [".jpeg", ".jpg", ".png"];
      acc[type] = ext;
      return acc;
    }, {}),
    multiple: false,
  });

  return (
    <div>
      <p className="font-medium text-gray-800 dark:text-dark-100 mb-2 text-sm">
        {doc.label}
      </p>

      <Upload inputProps={{ ...getInputProps() }} {...getRootProps()}>
        {({ ...props }) => (
          <Button
            {...props}
            unstyled
            className={clsx(
              "w-full flex-col rounded-lg border-2 border-dashed py-6 transition-colors",
              isDragActive
                ? "border-primary-600 dark:border-primary-500"
                : "border-gray-300 dark:border-dark-450"
            )}
          >
            <CloudArrowUpIcon className="size-8" />
            <span
              className={clsx(
                "pointer-events-none mt-2 text-sm",
                isDragActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-dark-200"
              )}
            >
              <span className="text-primary-600 dark:text-primary-400">
                Browse
              </span>{" "}
              or drop file
            </span>
          </Button>
        )}
      </Upload>

      {file && (
        <div className="mt-3 flex items-center justify-between">
          <FileItem file={file} />
          <Button
            size="sm"
            className="border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onRemove(doc.id)}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
