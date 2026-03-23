import React, { useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

function FileUpload({ taskId }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

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
      });

      // 3️⃣ Attach file metadata to Camunda task
      await axios.post("/api/attach-file", {
        taskId,
        fileUrl,
        fileName: file.name,
      });

      alert("File uploaded and attached!");
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed");
    }
  };

  return (
    <div sx={{ bgcolor: "#f5f6f8", color: "black" }}>
      <label className="bg-white px-4 py-2 rounded cursor-pointer">
        Select File
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
/////////////working