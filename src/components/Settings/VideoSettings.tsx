import React from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const VideoSettings = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Video Settings
      </Typography>
      
      <Box>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Default Quality</InputLabel>
          <Select
            value="1080p"
            label="Default Quality"
          >
            <MenuItem value="native">Native</MenuItem>
            <MenuItem value="1080p">1080p</MenuItem>
            <MenuItem value="720p">720p</MenuItem>
            <MenuItem value="480p">480p</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Video Player</InputLabel>
          <Select
            value="default"
            label="Video Player"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="html5">HTML5</MenuItem>
            <MenuItem value="vlc">VLC</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default VideoSettings; 