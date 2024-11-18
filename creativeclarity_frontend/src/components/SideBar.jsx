import React from 'react';
import { useState } from 'react';
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
import { Calendar, BookOpen, Clock, CheckSquare, Bell, User, LogOut } from 'lucide-react';
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

const SideBar = ({onLogout}) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <img
            src="/src/assets/images/logoCreativeClarity.png"
            alt="Logo"
            className="h-12 mb-8"
          />
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              <span>Tasks</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </nav>
        </div>
        
        <button 
          onClick={onLogout}
          className="absolute bottom-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
  );
};

export default SideBar;