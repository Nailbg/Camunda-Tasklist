import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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

  const handleDownload = async (file) => {
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
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Attached Files
      </Typography>

      {files.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No files uploaded yet
        </Typography>
      )}

      <Grid container spacing={2}>
        {files.map((file, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card variant="outlined">
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InsertDriveFileIcon color="action" />
                <Typography variant="body2" noWrap>
                  {file.fileName}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(file)}
                >
                  Download
                </Button>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(file)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}