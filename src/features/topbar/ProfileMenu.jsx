import React from "react";
import {
  Menu,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";

export default function ProfileMenu({
  anchorEl,
  open,
  onClose,
  onLogout,
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 260,
          borderRadius: 3,
          mt: 1,
          p: 1,
        },
      }}
    >
      {/* USER HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#8b1e1e",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          N
        </Box>
        <Typography fontWeight={500}>Nail Garba</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* MENU ITEMS */}
      <Box sx={{ px: 1 }}>
        <Typography sx={{ py: 1, cursor: "pointer" }}>
          Change password
        </Typography>
        <Typography sx={{ py: 1, cursor: "pointer" }}>
          Non-working days
        </Typography>
        <Typography sx={{ py: 1, cursor: "pointer" }}>
          My profile
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* LOGOUT BUTTON */}
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          onClick={onLogout}
          sx={{
            borderRadius: "25px",
            bgcolor: "#c6e46c",
            color: "#000",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#b4d85f",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Menu>
  );
}