import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ProcessingClips() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Processing Clips
      </Typography>
      <Typography variant="body1">
        Monitor clips that are currently being processed.
      </Typography>
    </Box>
  );
} 