import React from 'react';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

const StorageSettings = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Storage Settings
      </Typography>
      
      <Box>
        <TextField
          fullWidth
          label="Storage Path"
          defaultValue="C:/Videos"
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Max Storage Size (GB)"
          type="number"
          defaultValue={500}
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // TODO: Implement save storage settings
          }}
        >
          Save Settings
        </Button>
      </Box>
    </Paper>
  );
};

export default StorageSettings; 