import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ClipsTable from '../components/Clips/ClipsTable';
import ClipsStats from '../components/Clips/ClipsStats';
import ClipsActions from '../components/Clips/ClipsActions';

const Clips = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clips
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ClipsStats />
        </Grid>

        <Grid item xs={12}>
          <ClipsActions />
        </Grid>

        <Grid item xs={12}>
          <ClipsTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Clips; 