import "./App.css";
import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItemButton, Divider, Button } from "@mui/material";
import { formRegistry } from "./forms/index";
import TaskWorkspace from "./features/tasklist/TaskWorkspace";
import { useAuth } from "./auth/authcontext";
import LoginPage from "./auth/LoginPage";
export default function App() {
  const { user } = useAuth();
  console.log("Current user:", user);

  if (!user) {
    return <LoginPage />;
  }
  return <TaskWorkspace />;

}