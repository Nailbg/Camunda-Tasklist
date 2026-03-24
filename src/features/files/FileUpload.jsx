import React, { useState } from "react";
import axios from "axios";

export default function FileUpload({ taskId, onUploadSuccess }) {
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
      if (onUploadSuccess) {
        onUploadSuccess();
      }
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
    <div className="flex flex-col gap-3">
      {/* File picker */}
      {!file && (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition">
          <div className="text-sm text-gray-600">Click to select a file</div>
          <input key={file ? file.name : "empty"} type="file" className="hidden" onChange={handleFileSelect} />
        </label>
      )}

      {/* Selected file */}
      {file && !uploading && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
          <span className="text-sm truncate">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? `Uploading ${progress}%` : "Upload File"}
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
