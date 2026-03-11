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
      // Only tasks assigned to or candidate for current user
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

  // Preserve old URL logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("taskId");
    if (taskId) loadTaskForm(taskId);
  }, []);

  // Reload tasks when tab changes
  useEffect(() => {
    loadTasks();
  }, [tab]);

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* HEADER */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6">Task Workspace</Typography>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Toolbar>

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* TASK LIST */}
        <Box sx={{ width: 350, borderRight: "1px solid #ddd" }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="fullWidth"
          >
            <Tab label="My Tasks" />
            <Tab label="All Tasks" />
          </Tabs>

          <List>
            {tasks.length === 0 && (
              <Typography sx={{ p: 2 }}>No tasks found</Typography>
            )}

            {tasks.map((task) => (
              <div key={task.id}>
                <ListItemButton
                  onClick={() => loadTaskForm(task.id)}
                  selected={selectedTask?.id === task.id}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography fontWeight="bold">{task.name}</Typography>
                    <Typography variant="caption">
                      {task.assignee || "Unassigned"}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {new Date(task.created).toLocaleString()}
                    </Typography>

                    {/* Claim / Clear Claim Buttons */}
                    <Box sx={{ mt: 1 }}>
                      {!task.assignee && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => claimTask(task.id)}
                        >
                          Claim
                        </Button>
                      )}

                      {task.assignee && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => unclaimTask(task.id)}
                        >
                          Clear Claim
                        </Button>
                      )}
                    </Box>
                  </Box>
                </ListItemButton>

                <Divider />
              </div>
            ))}
          </List>
        </Box>

        {/* FORM AREA */}
        <Box sx={{ flex: 1, p: 4 }}>
          {!selectedTask && <Typography>Select a task</Typography>}
          {loadingForm && <Typography>Loading form...</Typography>}
          {selectedTask && !formSchema && <Typography>No form available.</Typography>}
          {selectedTask && formSchema && (
            <>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {selectedTask.name}
              </Typography>

              <DynamicForm schema={formSchema} taskId={selectedTask.id} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}