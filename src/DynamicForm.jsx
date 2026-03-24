import { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
  Box,
  Grid,
  FormHelperText,
} from "@mui/material";
import FileUpload from "./features/files/FileUpload";
import TaskFiles from "./features/taskfiles/TaskFiles";

export default function DynamicForm({ schema = { components: [] }, taskId }) {
  const [refreshFiles, setRefreshFiles] = useState(0);
  const initialState = {};
  const initialErrors = {};
  schema.components.forEach((c) => {
    initialState[c.key] =
      c.type === "select" || c.type === "radio"
        ? c.values?.[0]?.value || ""
        : "";
    initialErrors[c.key] = "";
  });

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (value) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    schema.components.forEach((c) => {
      if (c.validate?.required && !formData[c.key]) {
        newErrors[c.key] = "This field is required";
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const submitTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const variables = {};
    Object.entries(formData).forEach(([key, value]) => {
      variables[key] = { value, type: "String" };
    });

    await fetch(`/engine-rest/task/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variables }),
    });

    alert("Task submitted");
  };
  if (!schema.components || schema.components.length === 0) {
    return <div>No fields to display in this form.</div>;
  }
  const renderField = (component) => {
    const error = Boolean(errors[component.key]);
    const helperText = errors[component.key] || component.description;

    switch (component.type) {
      case "textfield":
        return (
          <TextField
            fullWidth
            label={component.label}
            required={component.validate?.required}
            value={formData[component.key]}
            onChange={(e) => handleChange(component.key, e.target.value)}
            error={error}
            helperText={helperText}
          />
        );

      case "select":
        return (
          <FormControl
            fullWidth
            required={component.validate?.required}
            error={error}
          >
            <InputLabel>{component.label}</InputLabel>
            <Select
              value={formData[component.key] || ""}
              label={component.label}
              onChange={(e) => handleChange(component.key, e.target.value)}
            >
              {component.values?.map((v) => (
                <MenuItem key={v.value} value={v.value}>
                  {v.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case "radio":
        return (
          <FormControl required={component.validate?.required} error={error}>
            <Typography sx={{ mb: 1, color: "text.primary" }}>
              {component.label}
            </Typography>
            <RadioGroup
              sx={{ mb: 1, color: "text.primary" }}
              value={formData[component.key] || ""}
              onChange={(e) => handleChange(component.key, e.target.value)}
              row
            >
              {component.values?.map((v) => (
                <FormControlLabel
                  key={v.value}
                  value={v.value}
                  control={<Radio />}
                  label={v.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );
      case "fileupload":
        return (
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {component.label}
            </Typography>

            {component.description && (
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                {component.description}
              </Typography>
            )}

            <FileUpload
              taskId={taskId}
              onUploadSuccess={() => setRefreshFiles((v) => v + 1)}
            />

            <Box sx={{ mt: 2 }}>
              <TaskFiles taskId={taskId} refresh={refreshFiles} />
            </Box>
          </Box>
        );

      case "datetime":
        return (
          <TextField
            fullWidth
            type="date"
            label={component.dateLabel || component.label}
            InputLabelProps={{ shrink: true }}
            required={component.validate?.required}
            value={formData[component.key]}
            onChange={(e) => handleChange(component.key, e.target.value)}
            error={error}
            helperText={helperText}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submitTask}
      sx={{
        maxWidth: 900,
        margin: "auto",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: "#fafafa",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Grid container spacing={3}>
        {schema.components.map((component) => (
          <Grid
            item
            xs={12}
            sm={
              component.type === "textfield" || component.type === "datetime"
                ? 12
                : 6
            }
            key={component.key}
          >
            {renderField(component)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" type="submit" size="large">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
