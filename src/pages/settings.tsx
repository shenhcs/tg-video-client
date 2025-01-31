import React from 'react';
import { Box, Typography } from '@mui/material';
import GeneralSettings from '../components/Settings/GeneralSettings';
import VideoSettings from '../components/Settings/VideoSettings';
import StorageSettings from '../components/Settings/StorageSettings';

const Settings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <GeneralSettings />
      <VideoSettings />
      <StorageSettings />
    </Box>
  );
};

export default Settings; 