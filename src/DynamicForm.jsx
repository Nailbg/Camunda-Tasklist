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
  Slider,
} from "@mui/material";
import FileUpload from "./features/forms/FileUpload";
import TaskFiles from "./features/taskfiles/TaskFiles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function DynamicForm({ schema = { components: [] }, taskId }) {
  const [refreshFiles, setRefreshFiles] = useState(0);

  const initialState = {};
  const initialErrors = {};
  schema.components.forEach((c) => {
    if (c.type === "select" || c.type === "radio") {
      initialState[c.key] = c.values?.[0]?.value || "";
    } else if (c.type === "chart") {
      initialState[c.key] = {}; // charts are derived from other fields
    } else if (c.type === "slider") {
      initialState[c.key] = c.min || 0; // default slider value
    } else {
      initialState[c.key] = "";
    }
    initialErrors[c.key] = "";
  });

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (value !== undefined && value !== null) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    schema.components.forEach((c) => {
      if (
        c.validate?.required &&
        (formData[c.key] === "" || formData[c.key] === null)
      ) {
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

  const renderChart = (component) => {
    // Only include numeric values for chart
    const dataPoints =
      component.keys
        ?.filter(
          (key) =>
            typeof formData[key] === "number" || !isNaN(Number(formData[key])),
        )
        .map((key) => ({
          label: schema.components.find((c) => c.key === key)?.label || key,
          value: Number(formData[key] || 0),
        })) || [];

    const chartData = {
      labels: dataPoints.map((d) => d.label),
      datasets: [
        {
          label: component.label,
          data: dataPoints.map((d) => d.value),
          backgroundColor: "#82ca9d",
        },
      ],
    };

    return (
      <Box sx={{ width: "100%", height: "100%", mb: 3 }}>
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false, // 👈 key fix
        plugins: {
          legend: { display: true },
        },
      }}
    />
  </Box>
    );
  };

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

      case "chart":
        return renderChart(component);

      case "slider":
        return (
          <Box sx={{ width: "100%" }}>
            <Typography gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
              {component.label}
            </Typography>
            <Slider
              value={formData[component.key] || component.min || 0}
              onChange={(e, value) => handleChange(component.key, value)}
              min={component.min || 0}
              max={component.max || 100}
              step={component.step || 1}
              valueLabelDisplay="auto"
              sx={{
                color: "#c6e46c",
                height: 8,
                "& .MuiSlider-thumb": {
                  height: 24,
                  width: 24,
                  backgroundColor: "#fff",
                  border: "2px solid #8ba04b",
                  "&:hover": {
                    boxShadow: "0px 0px 0px 8px rgba(198, 228, 108, 0.16)",
                  },
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#8ba04b",
                  color: "#fff",
                  fontWeight: 600,
                },
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  opacity: 0.3,
                  backgroundColor: "#000",
                },
              }}
            />
            {error && (
              <FormHelperText error>{errors[component.key]}</FormHelperText>
            )}
            {component.description && (
              <Typography variant="caption" color="text.secondary">
                {component.description}
              </Typography>
            )}
          </Box>
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
              component.type === "textfield" ||
              component.type === "datetime" ||
              component.type === "chart" ||
              component.type === "slider"
                ? 12
                : 6
            }
            key={component.key}
          >
            {component.type === "chart" ? (
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#fff",
                  height: "20rem",
                }}
              >
                {renderChart(component)}
              </Box>
            ) : (
              renderField(component)
            )}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          type="submit"
          size="large"
          sx={{
            bgcolor: "#c6e46c",
            color: "#000",
            borderRadius: "20px",
            textTransform: "none",
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
