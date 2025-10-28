import { useState } from "react";
import { Button } from "components/ui";
// import { FileItem } from "components/shared/form/FileItem";
import axios from "axios";
import { toast } from "sonner";
import { documentList } from "./data";
import DocumentUploader from "./DocumentUploader";

export default function DocumentSection() {
  const [files, setFiles] = useState({});

  const handleFileChange = (fieldId, file) => {
    setFiles((prev) => ({ ...prev, [fieldId]: file }));
  };

  const handleRemove = (fieldId) => {
    setFiles((prev) => ({ ...prev, [fieldId]: null }));
  };

  const handleClear = () => {
    setFiles({});
    toast.info("All files cleared");
  };
//Hittinfg the api 
  const handleSave = async () => {
    const formData = new FormData();
    documentList.forEach((item) => {
      if (files[item.id]) formData.append(item.id, files[item.id]);
    });

    try {
      await axios.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Documents uploaded successfully!");
      setFiles({});

    } catch (error) {
      toast.error("Failed to upload documents.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
        Upload Student Documents
      </h3>

      {/* ✅ Grid layout for side-by-side display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documentList.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-gray-200 dark:border-dark-500 p-3 shadow-sm bg-white dark:bg-dark-600"
          >
            <DocumentUploader
              doc={doc}
              file={files[doc.id]}
              onFileChange={handleFileChange}
              onRemove={handleRemove}
            />
          </div>
        ))}
      </div>

      {/* ✅ Action Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button
          className="bg-primary-600 hover:bg-primary-700 text-white"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          className="border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
