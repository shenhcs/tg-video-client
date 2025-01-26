import React from 'react';
import { Box, Typography } from '@mui/material';

export default function CompletedClips() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Completed Clips
      </Typography>
      <Typography variant="body1">
        View and download your completed video clips.
      </Typography>
    </Box>
  );
} 