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
        gap: 3,
        bgcolor: "#1e1e1e",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        color: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Login
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={{ style: { color: "#bbb" } }}
        InputProps={{ style: { color: "#fff" } }}
        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
        variant="filled"
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ style: { color: "#bbb" } }}
        InputProps={{ style: { color: "#fff" } }}
        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
        variant="filled"
      />

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}