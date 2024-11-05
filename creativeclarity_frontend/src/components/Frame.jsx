import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, IconButton, InputBase, Paper, Modal, Typography } from "@mui/material";
import React, { useState } from "react";

export const Frame = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        width: 1225,
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
        <IconButton aria-label="notifications" onClick={handleOpen}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '19%',
            left: '83%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="notification-modal-title" variant="h6" component="h2">
            Notifications
          </Typography>
          <Typography id="notification-modal-description" sx={{ mt: 3 }}>
            - Task 1: Pending
            <br />
            - Task 2: In Progress
            <br />
            - Task 3: Completed
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Frame;