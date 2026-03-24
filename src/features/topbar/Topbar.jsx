import React, { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProfileMenu from "./ProfileMenu";
import vegaLogo from "../../assets/vega-logo-black.svg";
import FileUpload from "../files/FileUpload";
export default function Topbar({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        bgcolor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* LEFT SIDE */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Logo */}
        <img
          src={vegaLogo}
          alt="VegaIT Logo"
          width={120}
          height={40}
          style={{ objectFit: "contain" }}
        />
        {/* <Typography variant="h6" sx={{ fontWeight: 500 , color: 'black' }}>
          vega<span style={{ fontWeight: 300 }}>IT</span>
        </Typography> */}

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 3 , color: 'black' }}>
          <Typography sx={{ cursor: "pointer", fontWeight: 500}}>
            Tasklist
          </Typography>

          
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton>
          <AppsIcon />
        </IconButton>

        {/* Profile Avatar */}
        <Box
          onClick={handleOpenProfile}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#8b1e1e",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          N
        </Box>

        <ProfileMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseProfile}
          onLogout={onLogout}
        />
      </Box>
    </Box>
  );
}
