import React from 'react';
import { Paper, Typography, Box, FormControl, FormControlLabel, Switch } from '@mui/material';

const GeneralSettings = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        General Settings
      </Typography>
      
      <Box>
        <FormControl component="fieldset">
          <FormControlLabel
            control={<Switch />}
            label="Dark Mode"
          />
          <FormControlLabel
            control={<Switch />}
            label="Auto-refresh"
          />
          <FormControlLabel
            control={<Switch />}
            label="Show notifications"
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default GeneralSettings; 