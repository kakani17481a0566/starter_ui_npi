// src/app/pages/forms/StudentRegistrationForm/sections/DocumentUploadSection.jsx
import { useState, useRef, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  PaperClipIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { Button, Progress } from "components/ui";
import { FilePond } from "components/shared/form/Filepond";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import SectionCard from "../components/SectionCard";
import axios from "utils/axios";

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
    setValue,
    clearErrors,
    setError,
    formState: { errors },
    watch,
  } = useFormContext();

  const { isXs, isMd, lgAndUp } = useBreakpointsContext();

  // Inline grid template to avoid dynamic Tailwind class pitfalls
  const gridStyle = useMemo(() => {
    const cols = (isXs && 1) || (isMd && 2) || (lgAndUp && 3) || 2;
    return { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };
  }, [isXs, isMd, lgAndUp]);

  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadedUrl, setUploadedUrl] = useState({});
  const cancelTokensRef = useRef({});

  const fileValue = (field) => watch(field);
  const urlValue = (field) => watch(`${field}_url`);

  const handleSelectFile = (name, file) => {
    setValue(name, file, { shouldValidate: true, shouldDirty: true });
    setValue(`${name}_url`, "", { shouldDirty: true });
    setUploadedUrl((s) => ({ ...s, [name]: "" }));
    if (autoUpload && file) handleUpload(name);
  };

  const handleCancel = (name) => {
    if (cancelTokensRef.current[name]) {
      try {
        cancelTokensRef.current[name].abort();
      } catch {
        // ignore
      }
      delete cancelTokensRef.current[name];
    }
    setUploading((s) => ({ ...s, [name]: false }));
    setProgress((s) => ({ ...s, [name]: 0 }));
  };

  const handleUpload = async (name) => {
    const file = fileValue(name);
    if (!file || !uploadUrl) {
      setError(name, {
        message: !file ? "Please select a file" : "Upload URL not configured",
      });
      return;
    }

    if (cancelTokensRef.current[name]) {
      try {
        cancelTokensRef.current[name].abort();
      } catch {
        // ignore abort error
      }
    }

    const controller = new AbortController();
    cancelTokensRef.current[name] = controller;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docName", name);
    Object.entries(extraData).forEach(([k, v]) => formData.append(k, `${v}`));

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
        onUploadProgress: ({ loaded, total }) => {
          if (total) {
            setProgress((s) => ({
              ...s,
              [name]: Math.round((loaded * 100) / total),
            }));
          }
        },
      });

      const url = mapResponse(resp);
      if (!url) throw new Error("Upload succeeded but no file URL returned");

      setValue(`${name}_url`, url, { shouldDirty: true, shouldValidate: true });
      setUploadedUrl((s) => ({ ...s, [name]: url }));
    } catch (err) {
      console.error("Upload error:", err);
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        // canceled by user — keep quiet
      } else {
        setError(name, { message: err?.message || "Upload failed" });
      }
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
        // ignore
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
    <SectionCard
      title={title}
      icon={PaperClipIcon}
      variant="outlined"
      elevation={1}
      padding="md"
    >
      <div className="grid gap-4" style={gridStyle}>
        {documents.map(({ name, label, accept = ".pdf,.jpg,.jpeg,.png" }) => {
          const file = fileValue(name);
          const url = urlValue(name);
          const isUploading = !!uploading[name];
          const pct = progress[name] || 0;
          const hasUrl = url || uploadedUrl[name];

          return (
            <div key={name} className="w-full">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {label}
              </label>

              <FilePond
                allowMultiple={false}
                acceptedFileTypes={accept.split(",")}
                onupdatefiles={(files) => handleSelectFile(name, files?.[0]?.file)}
                disabled={isUploading}
                maxFiles={1}
              />

              {/* Manual upload (if autoUpload=false) */}
              {!autoUpload && (
                <Button
                  size="sm"
                  disabled={!file || isUploading}
                  onClick={() => handleUpload(name)}
                  className="mt-2"
                  icon={<ArrowUpTrayIcon className="size-4" />}
                >
                  Upload
                </Button>
              )}

              {/* Remove */}
              {(file || hasUrl || isUploading) && (
                <Button
                  size="sm"
                  variant="twoTone"
                  onClick={() => handleRemove(name)}
                  className="mt-2 ml-2"
                  icon={<XCircleIcon className="size-4" />}
                >
                  Remove
                </Button>
              )}

              {/* Cancel while uploading */}
              {isUploading && (
                <Button
                  size="sm"
                  variant="outlined"
                  className="mt-2 ml-2"
                  onClick={() => handleCancel(name)}
                  icon={<NoSymbolIcon className="size-4" />}
                >
                  Cancel
                </Button>
              )}

              {/* Progress */}
              {isUploading && (
                <div className="mt-2">
                  <Progress value={pct} />
                  <p className="mt-1 text-xs text-gray-500">{pct}%</p>
                </div>
              )}

              {/* Uploaded link */}
              {hasUrl && !isUploading && (
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

              {/* Field error */}
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
