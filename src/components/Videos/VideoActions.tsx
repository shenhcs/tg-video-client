import React from 'react';
import { Box, Button } from '@mui/material';

const VideoActions = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button
        variant="contained"
        color="primary"
        component="label"
      >
        Upload Video
        <input
          type="file"
          hidden
          accept="video/*"
          onChange={(e) => {
            // TODO: Implement video upload
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          // TODO: Implement scan for videos
        }}
      >
        Scan for Videos
      </Button>
    </Box>
  );
};

export default VideoActions; 