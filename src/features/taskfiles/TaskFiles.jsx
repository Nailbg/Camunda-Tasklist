import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import axios from "axios";

export default function TaskFiles({ taskId, refresh }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    if (!taskId) return;

    setLoading(true);
    try {
      const { data } = await axios.get("/api/get-task-files", {
        params: { taskId },
      });
      setFiles(data.files || []);
    } catch (err) {
      console.error("Error loading files:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const key = file.fileUrl.split("/").pop();

      const { data } = await axios.get("/api/download-file", {
        params: { key },
      });

      window.open(data.url, "_blank");
    } catch (err) {
      console.error("Download error:", err.response?.data || err.message);
      alert("Download failed");
    }
  };

  useEffect(() => {
    loadFiles();
  }, [taskId, refresh]);

  if (!taskId) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Attached Files
      </Typography>

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Loading files...
        </Typography>
      )}

      {!loading && files.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No files attached
        </Typography>
      )}

      <List dense>
        {files.map((file, idx) => (
          <Box key={idx}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDownload(file)}
                >
                  <DownloadIcon />
                </IconButton>
              }
            >
              <InsertDriveFileIcon sx={{ mr: 1, color: "gray" }} />
              <ListItemText primary={file.fileName} />
            </ListItem>

            {idx < files.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
}