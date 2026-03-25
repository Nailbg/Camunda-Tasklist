import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";

export default function TaskFiles({ taskId, refresh }) {
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    if (!taskId) return;

    const { data } = await axios.get("/api/get-task-files", {
      params: { taskId },
    });

    setFiles(data.files || []);
  };

  const getFileExtension = (fileName) => {
    return fileName.split(".").pop()?.toUpperCase() || "FILE";
  };

  const handleDownload = async (file) => {
    try {
      const key = file.fileUrl.split("/").pop();

      const { data } = await axios.get("/api/download-file", {
        params: { key },
      });

      const response = await fetch(data.url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const handleOpenNewTab = async (file) => {
    const key = file.fileUrl.split("/").pop();

    const { data } = await axios.get("/api/download-file", {
      params: { key },
    });

    window.open(data.url, "_blank");
  };

  const handleDelete = async (fileToDelete) => {
    try {
      await axios.post("/api/delete-file", {
        taskId,
        fileName: fileToDelete.fileName,
      });

      loadFiles();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    loadFiles();
  }, [taskId, refresh]);

  if (!taskId) return null;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        Attached Files
      </Typography>

      {files.length === 0 && (
        <Typography variant="caption" color="text.secondary">
          No files uploaded yet
        </Typography>
      )}

      <Grid container spacing={1.2}>
        {files.map((file, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card
              elevation={0}
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
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
              {/* TOP ROW */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" noWrap sx={{ maxWidth: 140 }}>
                  {file.fileName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {getFileExtension(file.fileName)}
                </Typography>
              </Box>

              {/* ACTIONS */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: 0.5,
                }}
              >
                {/* OPEN IN NEW TAB */}
                <IconButton
                  size="small"
                  disableRipple
                  onClick={() => handleOpenNewTab(file)}
                  sx={{
                    color: "#8ba04b",

                    "&:hover": {
                      bgcolor: "#dceca3",
                    },

                    "&:active": {
                      bgcolor: "#c6e46c",
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {/* DOWNLOAD */}
                <IconButton
                  size="small"
                  disableRipple
                  onClick={() => handleDownload(file)}
                  sx={{
                    color: "#8ba04b",

                    "&:hover": {
                      bgcolor: "#dceca3",
                    },

                    "&:active": {
                      bgcolor: "#c6e46c",
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  <DownloadIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {/* DELETE */}
                <IconButton
                  size="small"
                  disableRipple
                  onClick={() => handleDelete(file)}
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}