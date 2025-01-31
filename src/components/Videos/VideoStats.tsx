import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';

const VideoStats = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Videos"
          value={0}
          description="Videos in library"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Duration"
          value={0}
          description="Hours of content"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Storage Used"
          value={0}
          description="GB used"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Average Length"
          value={0}
          description="Minutes per video"
        />
      </Grid>
    </Grid>
  );
};

export default VideoStats; 