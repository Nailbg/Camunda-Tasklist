import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  List,
  ListItemButton,
  Typography,
  Divider,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import TaskFilterMenu from "./TaskFilterMenu";

export default function TaskList({
  tab,
  setTab,
  tasks,
  selectedTask,
  onSelectTask,
  onClaim,
  onUnclaim,
}) {
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState({});

  // ✅ Apply filters
  const filteredTasks = tasks.filter((task) => {
    if (filters.name && !task.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (
      filters.assignee &&
      !(task.assignee || "").toLowerCase().includes(filters.assignee.toLowerCase())
    ) {
      return false;
    }

    if (filters.priority) {
      if (filters.priority === "low" && task.priority >= 30) return false;
      if (filters.priority === "medium" && (task.priority < 30 || task.priority > 70))
        return false;
      if (filters.priority === "high" && task.priority <= 70) return false;
    }

    if (filters.dueBefore && task.due) {
      const taskDue = new Date(task.due);
      const filterDue = new Date(filters.dueBefore);
      if (taskDue > filterDue) return false;
    }

    return true;
  });

  return (
    <Paper sx={{ width: 320, borderRadius: 3, overflow: "hidden" }}>
      {/* HEADER: Tabs + Filter */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: "#c6e46c" } }}
          sx={{ flex: 1 }}
        >
          <Tab label="My Tasks" />
          <Tab label="All Tasks" />
        </Tabs>

        <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* FILTER MENU */}
      <TaskFilterMenu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({})}
      />

      {/* TASK LIST */}
      <List sx={{ maxHeight: "75vh", overflowY: "auto" }}>
        {filteredTasks.length === 0 && <Typography sx={{ p: 2 }}>No tasks found</Typography>}

        {filteredTasks.map((task) => (
          <Box key={task.id}>
            <ListItemButton
              onClick={() => onSelectTask(task.id)}
              selected={selectedTask?.id === task.id}
              sx={{
                alignItems: "flex-start",
                "&.Mui-selected": { bgcolor: "#eef7d1" },
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography fontWeight={600}>{task.name}</Typography>

                <Typography variant="caption" color="text.secondary">
                  {task.assignee || "Unassigned"}
                </Typography>

                <Typography variant="caption" display="block">
                  {task.due ? new Date(task.due).toLocaleDateString() : "No due date"}
                </Typography>

                {/* ACTIONS */}
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  {!task.assignee && (
                    <Button
                      size="small"
                      sx={{
                        bgcolor: "#c6e46c",
                        color: "#000",
                        borderRadius: "20px",
                        textTransform: "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClaim(task.id);
                      }}
                    >
                      Claim
                    </Button>
                  )}

                  {task.assignee && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnclaim(task.id);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Box>
            </ListItemButton>

            <Divider />
          </Box>
        ))}
      </List>
    </Paper>
  );
}