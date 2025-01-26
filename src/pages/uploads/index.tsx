import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Uploads() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Uploads
      </Typography>
      <Typography variant="body1">
        Here you can upload new videos and monitor upload progress.
      </Typography>
    </Box>
  );
} 