import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "./authcontext";

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(username, password);
    } catch {
      alert("Login failed");
    }
  }

  return (
    <Box
      sx={{
        width: 400,
        margin: "150px auto",
        display: "flex",
        flexDirection: "column",
        color: "white",
        gap: 3
      }}
      >
      <Typography sx={{
        width: 400,
        margin: "150px auto",
        display: "flex",
        flexDirection: "column",
        color: "white",
        gap: 3
      }} variant="h5">Login</Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button variant="contained" onClick={handleSubmit}>
        Login
      </Button>
    </Box>
  );
}