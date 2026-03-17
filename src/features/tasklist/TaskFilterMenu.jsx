import React, { useState, useEffect } from "react";
import {
  Menu,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// MUI DatePicker
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function TaskFilterMenu({ anchorEl, open, onClose, filters, onApply, onReset }) {
  // Store dueBefore as a Date object for the picker
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    dueBefore: filters.dueBefore ? new Date(filters.dueBefore) : null,
  });

  useEffect(() => {
    setLocalFilters({
      ...filters,
      dueBefore: filters.dueBefore ? new Date(filters.dueBefore) : null,
    });
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Convert dueBefore back to string before applying
    const appliedFilters = {
      ...localFilters,
      dueBefore: localFilters.dueBefore
        ? localFilters.dueBefore.toISOString().split("T")[0]
        : "",
    };
    onApply(appliedFilters);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 280, borderRadius: 3, mt: 1, p: 2 } }}
    >
      <Typography fontWeight={600} sx={{ mb: 1 }}>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* TASK NAME */}
      <TextField
        label="Task name"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={localFilters.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* ASSIGNEE */}
      <TextField
        label="Assignee"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={localFilters.assignee || ""}
        onChange={(e) => handleChange("assignee", e.target.value)}
      />

      {/* PRIORITY */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={localFilters.priority || ""}
          label="Priority"
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="low">Low (&lt; 30)</MenuItem>
          <MenuItem value="medium">Medium (30-70)</MenuItem>
          <MenuItem value="high">High (&gt; 70)</MenuItem>
        </Select>
      </FormControl>

      {/* DUE DATE */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Due before"
          value={localFilters.dueBefore}
          onChange={(newValue) => handleChange("dueBefore", newValue)}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth sx={{ mb: 2 }} />
          )}
        />
      </LocalizationProvider>

      <Divider sx={{ my: 2 }} />

      {/* ACTIONS */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onReset}
          sx={{ borderRadius: "20px", textTransform: "none" }}
        >
          Reset
        </Button>

        <Button
          fullWidth
          onClick={handleApply}
          sx={{
            borderRadius: "20px",
            bgcolor: "#c6e46c",
            color: "#000",
            textTransform: "none",
            "&:hover": { bgcolor: "#b4d85f" },
          }}
        >
          Apply
        </Button>
      </Box>
    </Menu>
  );
}