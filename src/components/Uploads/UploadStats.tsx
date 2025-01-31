import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';

const UploadStats = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Uploads"
          value={0}
          subtitle="Videos uploaded"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="In Progress"
          value={0}
          subtitle="Currently uploading"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Failed"
          value={0}
          subtitle="Failed uploads"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Success Rate"
          value={100}
          subtitle="Percent successful"
        />
      </Grid>
    </Grid>
  );
};

export default UploadStats; 