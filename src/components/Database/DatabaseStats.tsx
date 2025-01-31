import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';

const DatabaseStats = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Videos"
          value={0}
          subtitle="Videos in database"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Clips"
          value={0}
          subtitle="Clips in database"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Storage Used"
          value={0}
          subtitle="GB used"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Last Updated"
          value={0}
          subtitle="minutes ago"
        />
      </Grid>
    </Grid>
  );
};

export default DatabaseStats; 