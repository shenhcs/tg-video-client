import React from 'react';
import { Box, Typography } from '@mui/material';
import VideoStats from '../components/Videos/VideoStats';
import VideoActions from '../components/Videos/VideoActions';
import VideoTable from '../components/Videos/VideoTable';

const Videos = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Videos
      </Typography>
      
      <VideoStats />
      <VideoActions />
      <VideoTable />
    </Box>
  );
};

export default Videos; 