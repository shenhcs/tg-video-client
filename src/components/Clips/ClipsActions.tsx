import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ClipsActions = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button
        component={Link}
        to="/clip-creator"
        variant="contained"
        color="primary"
      >
        Create New Clip
      </Button>
    </Box>
  );
};

export default ClipsActions; 