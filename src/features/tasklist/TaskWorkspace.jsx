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
  Paper,
} from "@mui/material";

import DynamicForm from "../../DynamicForm";
import { formRegistry } from "../../forms";
import { useAuth } from "../../auth/authcontext";
import Topbar from "../topbar/topbar";
import TaskList from "./tasklist";
import FileUpload from "../files/FileUpload";

export default function TaskWorkspace() {
  const { user, logout } = useAuth();

  const [tab, setTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const authHeader = "Basic " + btoa(user.username + ":" + user.password);

  async function loadTasks() {
    let url = "/engine-rest/task";
    if (tab === 0) {
      url += `?candidateUser=${user.username}&includeAssignedTasks=true`;
    }
    const res = await fetch(url, {
      headers: { Authorization: authHeader },
    });
    setTasks(await res.json());
  }

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
  }

  async function unclaimTask(taskId) {
    await fetch(`/engine-rest/task/${taskId}/unclaim`, {
      method: "POST",
      headers: { Authorization: authHeader },
    });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, [tab]);

  return (
    <Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh", minWidth: "100vw", top: 0, left: 0, position: "absolute" }}>
      {/* ✅ TOP BAR ONLY */}
      <Topbar onLogout={logout} />

      {/* ✅ MAIN CONTENT BELOW NAVBAR */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          p: 3,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >

        {/* TASK LIST */}
        <TaskList
  tab={tab}
  setTab={setTab}
  tasks={tasks}
  selectedTask={selectedTask}
  onSelectTask={loadTaskForm}
  onClaim={claimTask}
  onUnclaim={unclaimTask}
/>

        {/* FORM */}
        <Paper
          sx={{
            flex: 1,
            borderRadius: 3,
            p: 4,
            minHeight: "75vh",
          }}
        >
          {!selectedTask && (
            <Typography color="text.secondary">
              Select a task to begin
            </Typography>
          )}

          {loadingForm && <Typography>Loading...</Typography>}

          {selectedTask && !formSchema && (
            <Typography>No form available</Typography>
          )}

          {selectedTask && formSchema && (
            <>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {selectedTask.name}
              </Typography>
        <FileUpload taskId={selectedTask?.id} />

              <DynamicForm
                schema={formSchema}
                taskId={selectedTask.id}
              />
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}