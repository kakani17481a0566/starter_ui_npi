import { useState, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  PaperClipIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Card, Input, Button, Progress } from "components/ui";
import axios from "utils/axios";

/**
 * DocumentUploadSection
 *
 * Props:
 * - title: string (card title)
 * - documents: Array<{ name: string; label: string; accept?: string }>
 * - uploadUrl: string (API endpoint to upload file)
 * - extraData?: Record<string, any> (additional form fields to send with file)
 * - method?: "POST" | "PUT" (default POST)
 * - autoUpload?: boolean (default true: upload right after selecting a file)
 * - mapResponse?: (resp) => string  // returns the final file URL from API response
 *
 * Behavior:
 * - Stores file object at form key: `${name}` (e.g., "birth_cert")
 * - Stores uploaded URL at form key: `${name}_url` (e.g., "birth_cert_url")
 */
export default function DocumentUploadSection({
  title = "Upload Documents",
  documents = [],
  uploadUrl,
  extraData = {},
  method = "POST",
  autoUpload = true,
  mapResponse = (resp) => resp?.data?.data?.url || resp?.data?.url || "",
}) {
  const {
    control,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
    watch,
  } = useFormContext();

  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadedUrl, setUploadedUrl] = useState({});
  const cancelTokensRef = useRef({}); // { [name]: AbortController }

  const fileValue = (field) => watch(field);
  const urlValue = (field) => watch(`${field}_url`);

  const handleSelectFile = (name, file) => {
    setValue(name, file, { shouldValidate: true, shouldDirty: true });
    setValue(`${name}_url`, "", { shouldDirty: true });
    setUploadedUrl((s) => ({ ...s, [name]: "" }));
    if (autoUpload && file) {
      handleUpload(name);
    }
  };

  const handleUpload = async (name) => {
    const file = fileValue(name);
    if (!file) {
      setError(name, { message: "Please select a file first" });
      return;
    }
    if (!uploadUrl) {
      setError(name, { message: "Upload URL is not configured" });
      return;
    }

    if (cancelTokensRef.current[name]) {
      try {
        cancelTokensRef.current[name].abort();
      } catch {
        // ignore abort errors
      }
    }
    const controller = new AbortController();
    cancelTokensRef.current[name] = controller;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docName", name);
    Object.entries(extraData || {}).forEach(([k, v]) =>
      formData.append(k, `${v}`)
    );

    setUploading((s) => ({ ...s, [name]: true }));
    setProgress((s) => ({ ...s, [name]: 0 }));
    clearErrors(name);

    try {
      const resp = await axios.request({
        url: uploadUrl,
        method,
        data: formData,
        signal: controller.signal,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress((s) => ({ ...s, [name]: pct }));
        },
      });

      const url = mapResponse(resp);
      if (!url) {
        throw new Error("Upload succeeded but no file URL was returned");
      }

      setValue(`${name}_url`, url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setUploadedUrl((s) => ({ ...s, [name]: url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError(name, { message: err?.message || "Upload failed" });
    } finally {
      setUploading((s) => ({ ...s, [name]: false }));
      setProgress((s) => ({ ...s, [name]: 0 }));
      delete cancelTokensRef.current[name];
    }
  };

  const handleRemove = (name) => {
    if (cancelTokensRef.current[name]) {
      try {
        cancelTokensRef.current[name].abort();
      } catch {
        // ignore abort errors
      }
      delete cancelTokensRef.current[name];
    }

    setValue(name, null, { shouldDirty: true, shouldValidate: true });
    setValue(`${name}_url`, "", { shouldDirty: true, shouldValidate: true });
    setUploadedUrl((s) => ({ ...s, [name]: "" }));
    setUploading((s) => ({ ...s, [name]: false }));
    setProgress((s) => ({ ...s, [name]: 0 }));
    clearErrors(name);
  };

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
          const file = fileValue(name);
          const url = urlValue(name);
          const isUploading = !!uploading[name];
          const pct = progress[name] || 0;
          const hasUrl = url || uploadedUrl[name];

          return (
            <div key={name} className="col-span-12 md:col-span-6">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {label}
              </label>

              <Controller
                name={name}
                control={control}
                render={() => (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept={accept}
                      disabled={isUploading}
                      onChange={(e) =>
                        handleSelectFile(name, e.target.files?.[0])
                      }
                      error={errors?.[name]?.message}
                    />
                    {!autoUpload && (
                      <Button
                        size="sm"
                        disabled={!file || isUploading}
                        onClick={() => handleUpload(name)}
                        className="shrink-0"
                        icon={<ArrowUpTrayIcon className="size-4" />}
                      >
                        Upload
                      </Button>
                    )}
                    {(file || hasUrl || isUploading) && (
                      <Button
                        size="sm"
                        variant="twoTone"
                        onClick={() => handleRemove(name)}
                        className="shrink-0"
                        icon={<XCircleIcon className="size-4" />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                )}
              />

              {isUploading && (
                <div className="mt-2">
                  <Progress value={pct} />
                  <p className="mt-1 text-xs text-gray-500">{pct}%</p>
                </div>
              )}

              {file && !isUploading && !hasUrl && (
                <p className="mt-1 text-sm text-gray-600 dark:text-dark-100">
                  Selected: <strong>{file.name}</strong>
                </p>
              )}

              {hasUrl && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="size-4 text-green-600" />
                  <a
                    href={hasUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-primary-600 hover:underline"
                  >
                    View uploaded file
                  </a>
                </div>
              )}

              {errors?.[name] && (
                <p className="mt-1 text-sm text-red-500">
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
