import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  BarChart as BarChartIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  HelpOutline as HelpOutlineIcon,
  ExitToApp as ExitToAppIcon,
  Padding
} from '@mui/icons-material';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: '1px solid ${theme.palette.divider}',
    padding: '20px',
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const SideBar = () => {
  return (
    <StyledDrawer variant="permanent" anchor="left">
      <Logo variant="h6">
        CreativeClarity
      </Logo>
      <List>
        {[
          { text: 'Overview', icon: <DashboardIcon /> },
          { text: 'Courses', icon: <MenuBookIcon />, active: true },
          { text: 'Assignments', icon: <AssignmentIcon /> },
          { text: 'Tasks', icon: <CheckIcon />},
          { text: 'My Schedule', icon: <ScheduleIcon /> },
          { text: 'Progress', icon: <BarChartIcon />, hasArrow: true },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={item.active ? {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              } : {}}
            >
              <ListItemIcon sx={item.active ? { color: 'inherit' } : {}}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.hasArrow && <ArrowForwardIosIcon fontSize="small" />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <List>
          {[
            { text: 'Help', icon: <HelpOutlineIcon /> },
            { text: 'Logout', icon: <ExitToAppIcon /> },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default SideBar;