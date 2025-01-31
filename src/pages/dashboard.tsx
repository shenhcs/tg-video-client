import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import StatCard from '../components/StatCard';

interface DashboardProps {
  stats: {
    untrackedVideos: number;
    unuploadedVideos: number;
    uploadedVideosWithoutClips: number;
    uploadedVideosWithClips: number;
    unuploadedClips: number;
    uploadedClips: number;
  };
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onRefresh }) => {
  const handleAddAllToDatabase = async () => {
    try {
      console.log('Adding all videos to database...');
      const response = await fetch('http://localhost:8000/videos/track-all', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to add videos to database');
      }
      
      console.log('Successfully added all videos to database');
      onRefresh();
    } catch (error) {
      console.error('Error adding videos to database:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
      <Box sx={{ width: '100%', mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Videos</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard 
              title="Videos Not in Database" 
              value={stats.untrackedVideos} 
              onAction={stats.untrackedVideos > 0 ? handleAddAllToDatabase : undefined}
              actionLabel={stats.untrackedVideos > 0 ? "Add All to Database" : undefined}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard title="Videos Without Clips" value={stats.uploadedVideosWithoutClips} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard title="Videos With Clips" value={stats.uploadedVideosWithClips} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard title="Unuploaded Videos" value={stats.unuploadedVideos} />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 2 }}>Clips</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard title="Unuploaded Clips" value={stats.unuploadedClips} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard title="Uploaded Clips" value={stats.uploadedClips} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 