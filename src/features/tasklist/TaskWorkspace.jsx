import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  List,
  ListItemButton,
  Typography,
  Divider,
  Button,
  Toolbar,
} from "@mui/material";

import DynamicForm from "../../DynamicForm";
import { formRegistry } from "../../forms";
import { useAuth } from "../../auth/authcontext";

export default function TaskWorkspace() {
  const { user, logout } = useAuth();

  const [tab, setTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const authHeader = "Basic " + btoa(user.username + ":" + user.password);

  /** Load tasks from Camunda */
  async function loadTasks() {
    let url = "/engine-rest/task";
    if (tab === 0) {
      url += `?candidateUser=${user.username}&includeAssignedTasks=true`;
    }
    const res = await fetch(url, {
      headers: { Authorization: authHeader },
    });
    const data = await res.json();
    setTasks(data);
  }

  /** Load task info and form schema */
  async function loadTaskForm(taskId) {
    setLoadingForm(true);
    const res = await fetch(`/engine-rest/task/${taskId}`, {
      headers: { Authorization: authHeader },
    });
    const task = await res.json();

    const schema = formRegistry[task.taskDefinitionKey];
    setFormSchema(schema || null);
    setSelectedTask(task);
    setLoadingForm(false);
  }

  /** Claim task */
  async function claimTask(taskId) {
    await fetch(`/engine-rest/task/${taskId}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ userId: user.username }),
    });
    loadTasks();
    if (selectedTask?.id === taskId) loadTaskForm(taskId);
  }

  /** Clear claim */
  async function unclaimTask(taskId) {
    await fetch(`/engine-rest/task/${taskId}/unclaim`, {
      method: "POST",
      headers: { Authorization: authHeader },
    });
    loadTasks();
    if (selectedTask?.id === taskId) loadTaskForm(taskId);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("taskId");
    if (taskId) loadTaskForm(taskId);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [tab]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",  // center the main container
        alignItems: "center",
        height: "90vh",
        width: "90vw",
        bgcolor: "#1e1e1e",
        color: "white",
        p: 2, // small margin from edge
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "95%",
          maxWidth: 1200, // limit max width for modern layout
          height: "95%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          bgcolor: "#1e1e1e",
        }}
      >
        {/* HEADER */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #444",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Task Workspace
          </Typography>
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Toolbar>

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* TASK LIST */}
          <Box
            sx={{
              width: 350,
              borderRight: "1px solid #444",
              bgcolor: "#2a2a2a",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v)}
              variant="fullWidth"
              textColor="inherit"
              TabIndicatorProps={{ style: { backgroundColor: "#90caf9" } }}
              sx={{
                "& .MuiTab-root": { color: "#bbb" },
                "& .Mui-selected": { color: "#fff" },
                bgcolor: "#2a2a2a",
              }}
            >
              <Tab label="My Tasks" />
              <Tab label="All Tasks" />
            </Tabs>

            {/* Scrollable task list */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <List>
                {tasks.length === 0 && (
                  <Typography sx={{ p: 2 }}>No tasks found</Typography>
                )}

                {tasks.map((task) => (
                  <div key={task.id}>
                    <ListItemButton
                      onClick={() => loadTaskForm(task.id)}
                      selected={selectedTask?.id === task.id}
                      sx={{
                        "&.Mui-selected": { bgcolor: "#3a3a3a" },
                        "&:hover": { bgcolor: "#3a3a3a" },
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                          {task.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#ccc" }}>
                          {task.assignee || "Unassigned"}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ color: "#999" }}>
                          {new Date(task.created).toLocaleString()}
                        </Typography>

                        {/* Claim / Clear Claim Buttons */}
                        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                          {!task.assignee && (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => claimTask(task.id)}
                            >
                              Claim
                            </Button>
                          )}
                          {task.assignee && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() => unclaimTask(task.id)}
                            >
                              Clear Claim
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </ListItemButton>

                    <Divider sx={{ bgcolor: "#444" }} />
                  </div>
                ))}
              </List>
            </Box>
          </Box>

          {/* FORM AREA */}
          <Box sx={{ flex: 1, p: 4, overflowY: "auto" }}>
            {!selectedTask && <Typography>Select a task</Typography>}
            {loadingForm && <Typography>Loading form...</Typography>}
            {selectedTask && !formSchema && <Typography>No form available.</Typography>}
            {selectedTask && formSchema && (
              <>
                <Typography variant="h5" sx={{ mb: 3, color: "#fff" }}>
                  {selectedTask.name}
                </Typography>

                <DynamicForm schema={formSchema} taskId={selectedTask.id} />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}