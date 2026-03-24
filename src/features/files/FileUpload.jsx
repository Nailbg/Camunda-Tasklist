import React, { useState } from "react";
import axios from "axios";

export default function FileUpload({ taskId, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (selectedFiles) => {
    setFiles(Array.from(selectedFiles));
    setProgress(0);
  };

  // --- Drag handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select files first!");
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Get presigned URL
        const { data } = await axios.post("/api/get-presigned-url", {
          fileName: file.name,
          fileType: file.type,
        });

        const { uploadUrl, fileUrl } = data;

        // 2. Upload to MinIO
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });

        // 3. Attach to Camunda
        await axios.post("/api/attach-file", {
          taskId,
          fileUrl,
          fileName: file.name,
        });

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setFiles([]);
      setProgress(0);

      if (onUploadSuccess) onUploadSuccess();

      alert("Files uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <div className="text-sm text-gray-600">
          Drag & drop files here or click to select
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="bg-gray-50 p-3 rounded border">
          {files.map((file, idx) => (
            <div key={idx} className="text-sm flex justify-between">
              <span>{file.name}</span>
              <span className="text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading
            ? `Uploading... ${progress}%`
            : `Upload ${files.length} file(s)`}
        </button>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}