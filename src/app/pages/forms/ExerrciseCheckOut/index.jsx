// Import Dependencies
import { useDropzone } from "react-dropzone";
import {
  CloudArrowUpIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";

import { Button, Upload } from "components/ui";

export default function ExerciseCheckOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setUploadResult(null);
    setUploadError(null);

    const formData = new FormData();
    
    formData.append("video", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/uploadVideo", {
        method: "POST",
        headers: {
          Accept: "application/json", 
        },
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = `Upload failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg; 
        } catch (e) {
            console.log(e);
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setUploadResult(data.Prediction || data.result || "Upload successful!");
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
    multiple: false,
  });

  return (
    <div>
      <p className="font-medium text-gray-800 dark:text-dark-100">
        Upload The Exercise Video
      </p>
      <p className="mt-1 text-xs">You can upload the Video Here.</p>
      <Upload inputProps={{ ...getInputProps() }} {...getRootProps()}>
        {({ ...props }) => (
          <Button
            {...props}
            unstyled
            className={clsx(
              "mt-3 w-full shrink-0 flex-col rounded-lg border-2 border-dashed py-10",
              isDragActive
                ? "border-primary-600 dark:border-primary-500"
                : "border-gray-300 dark:border-dark-450"
            )}
          >
            <CloudArrowUpIcon className="size-12" />
            <span
              className={clsx(
                "pointer-events-none mt-2",
                isDragActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-dark-200"
              )}
            >
              <span className="text-primary-600 dark:text-primary-400">
                Browse
              </span>
              <span> or drop your files here</span>
            </span>
          </Button>
        )}
      </Upload>
      <div className="mt-4 flex min-h-[3rem] items-center justify-center text-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-dark-200">
            <ArrowPathIcon className="size-6 animate-spin" />
            <span>Analyzing video...</span>
          </div>
        )}
        {uploadResult && (
          <p className="font-medium text-green-600 dark:text-green-400">
            {uploadResult}
          </p>
        )}
        {uploadError && (
          <p className="font-medium text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  );
}