import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { useAuth } from "./authcontext";
import vegaLogo from "../assets/vega-logo-black.svg";

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
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#f5f5f5",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {/* LEFT SIDE (illustration placeholder) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#eaeaea",
        }}
      >
        <img
          src={vegaLogo}
          alt="VegaIT Logo"
          width={120}
          height={40}
          style={{ objectFit: "contain" }}
        />
        {/* Replace with your image or SVG */}
        <Typography variant="h6" color="text.secondary"></Typography>
      </Box>

      {/* RIGHT SIDE (login card) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: 360,
            p: 5,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Box sx={{alignContent: 'center', alignSelf: 'center', display: 'flex', justifyContent: 'center', mb: 3}}>
            {/* Logo / Title */}
            <img
              src={vegaLogo}
              alt="VegaIT Logo"
              width={120}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </Box>
      

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Log in to Tasklist
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
              }}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Remember me"
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "25px",
                  px: 4,
                  backgroundColor: "#c6e46c",
                  color: "#000",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#b4d85f",
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
