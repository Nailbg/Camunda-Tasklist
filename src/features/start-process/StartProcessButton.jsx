import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function StartProcessButton({ authHeader }) {
  const [open, setOpen] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = async () => {
    setOpen(true);
    setLoading(true);

    try {
      const res = await fetch(
        "/engine-rest/process-definition?latestVersion=true",
        { headers: { Authorization: authHeader } }
      );

      const data = await res.json();
      setProcesses(data);
    } catch (err) {
      console.error("Error loading processes:", err);
    }

    setLoading(false);
  };

  const startProcess = async (processId) => {
    try {
      await fetch(
        `/engine-rest/process-definition/${processId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ variables: {} }), // optional variables
        }
      );

      alert("Process started!");
      setOpen(false);
    } catch (err) {
      console.error("Start process error:", err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#c6e46c",
          color: "#000",
          borderRadius: "20px",
          textTransform: "none",
        }}
        onClick={openModal}
      >
        Start Process
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Start a Process</DialogTitle>

        {loading ? (
          <CircularProgress sx={{ m: 3 }} />
        ) : (
          <List>
            {processes.length === 0 && (
              <Typography sx={{ p: 2 }}>
                No processes available
              </Typography>
            )}

            {processes.map((proc) => (
              <ListItemButton
                key={proc.id}
                onClick={() => startProcess(proc.id)}
              >
                <Typography>
                  {proc.name || proc.key}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        )}
      </Dialog>
    </>
  );
}