import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, IconButton, InputBase, Paper } from "@mui/material";
import React from "react";

export const Frame = () => {
  return (
    <Box
      sx={{
        width: 1260,
        height: 64,
        backgroundColor: "#0aa5ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          width: 537,
          padding: "2px 4px",
          backgroundColor: "#f8fafb",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        <SearchIcon sx={{ margin: "0 8px" }} />
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
        />
      </Paper>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton aria-label="notifications">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Frame;