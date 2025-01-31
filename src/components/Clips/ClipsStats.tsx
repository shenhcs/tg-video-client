import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';

const ClipsStats = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Clips"
          value={0}
          description="Total number of clips created"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pending"
          value={0}
          description="Clips waiting to be processed"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Processing"
          value={0}
          description="Clips currently being processed"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Completed"
          value={0}
          description="Clips ready for use"
        />
      </Grid>
    </Grid>
  );
};

export default ClipsStats; 
