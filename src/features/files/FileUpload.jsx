import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Button } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FileUpload({ taskId, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const getFileExtension = (fileName) => {
    return fileName.split(".").pop()?.toUpperCase() || "FILE";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);

    setFiles((prevFiles) => {
      const combined = [...prevFiles, ...newFiles];

      const unique = combined.filter(
        (file, index, self) =>
          index ===
          self.findIndex((f) => f.name === file.name && f.size === file.size),
      );

      return unique;
    });

    setProgress(0);
  };

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

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
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

        const payload = {
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
        };

        const { data } = await axios.post(
          "http://localhost:5001/api/get-presigned-url",
          payload,
        );

        const { uploadUrl, fileUrl } = data;

        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });

        await axios.post("http://localhost:5001/api/attach-file", {
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
      console.error("Upload error:", err.response?.data || err.message);
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
          dragActive ? "border-[#c6e46c] bg-[#f5fbe8]" : "border-gray-300"
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
        <Box
          sx={{
            bgcolor: "#fafafa",
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {files.map((file, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",

                "&:hover": {
                  bgcolor: "#eef7d1",
                },

                "&:active": {
                  bgcolor: "#dceca3",
                  transform: "scale(0.98)",
                },
              }}
            >
              {/* LEFT */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 18, color: "#8ba04b" }} />

                <Box>
                  <Typography variant="caption" noWrap>
                    {file.name} -{" "}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {getFileExtension(file.name)} • {formatFileSize(file.size)}
                  </Typography>
                </Box>
              </Box>

              {/* REMOVE */}
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(idx)}
                sx={{
                  "&:hover": {
                    bgcolor: "#ffecec",
                  },
                  "&:active": {
                    bgcolor: "#ffd6d6",
                    transform: "scale(0.9)",
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 18, color: "#d32f2f" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          sx={{
            bgcolor: "#c6e46c",
            color: "#000",
            borderRadius: "8px",
            textTransform: "none",

            "&:hover": {
              bgcolor: "#dceca3",
            },

            "&:active": {
              bgcolor: "#b9d85c",
              transform: "scale(0.98)",
            },
          }}
        >
          {uploading
            ? `Uploading... ${progress}%`
            : `Upload ${files.length} file(s)`}
        </Button>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-[#8ba04b] h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
