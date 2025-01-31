import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  VideoLibrary as VideoIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  VideoFile as ClipsIcon,
  Refresh as RefreshIcon,
  Storage as DatabaseIcon,
} from '@mui/icons-material';
import { videoService } from '../services/api';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Clip Creator', path: '/clip-creator', icon: <AddIcon /> },
  { text: 'Videos', path: '/videos', icon: <VideoIcon /> },
  { text: 'Clips', path: '/clips', icon: <ClipsIcon /> },
  { text: 'Database', path: '/database', icon: <DatabaseIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await videoService.refreshFiles();
      console.log('Refresh result:', result);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 1
      }}>
        <Typography variant="h6" noWrap component="div">
          Video Clipper
        </Typography>
        <Tooltip title="Refresh Files">
          <IconButton 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            size="small"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 
