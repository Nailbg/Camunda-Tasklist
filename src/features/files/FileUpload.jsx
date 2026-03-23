import React, { useState } from "react";
import axios from "axios";

export default function FileUpload({ taskId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    if (!taskId) {
      alert("No task selected.");
      return;
    }

    setUploading(true);
    try {
      // 1️⃣ Request pre-signed URL from backend
      const { data } = await axios.post("/api/get-presigned-url", {
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadUrl, fileUrl } = data;

      // 2️⃣ Upload file directly to MinIO
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percent);
        },
      });

      // 3️⃣ Attach file metadata to Camunda task
      await axios.post("/api/attach-file", {
        taskId,
        fileUrl,
        fileName: file.name,
      });

      alert("File uploaded and attached successfully!");
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Show file select only if no file is selected */}
      {!file && (
        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-max">
          Select File
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}

      {/* Upload button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded w-max ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white"
          }`}
        >
          {uploading ? `Uploading... ${progress}%` : `Upload ${file.name}`}
        </button>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 h-2 rounded mt-1">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}