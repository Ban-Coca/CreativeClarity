import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckIcon from "@mui/icons-material/Check";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

const SideBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 240,
        height: "95vh",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        p: 2,
      }}
    >
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          CreativeClarity
        </Typography>
      </Box>

      <List>
        <ListItem button={true.toString()}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>

        <ListItem
          button={true.toString()}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <MenuBookIcon sx={{ color: "primary.contrastText" }} />
          </ListItemIcon>
          <ListItemText 
            primary="Courses" 
            sx={{ typography: 'h6', fontSize: '1.25rem' }} // Adjust font size here
          />
        </ListItem>

        <ListItem button={true.toString()}>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>

        <ListItem button={true.toString()}>
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="My Schedule" />
        </ListItem>

        <ListItem button={true.toString()}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Progress" />
          <ArrowForwardIosIcon fontSize="small" />
        </ListItem>
      </List>

      <Box sx={{ mt: "auto" }}>
        <Divider />
        <List>
          <ListItem button={true.toString()}>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>

          <ListItem button={true.toString()}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default SideBar;
