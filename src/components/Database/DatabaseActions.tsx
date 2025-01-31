import React from 'react';
import { Box, Button } from '@mui/material';

const DatabaseActions = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // TODO: Implement refresh database
        }}
      >
        Refresh Database
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          // TODO: Implement clear database
        }}
      >
        Clear Database
      </Button>
    </Box>
  );
};

export default DatabaseActions; 