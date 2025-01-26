import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PendingClips() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Clips
      </Typography>
      <Typography variant="body1">
        View and manage clips that are waiting to be processed.
      </Typography>
    </Box>
  );
} 