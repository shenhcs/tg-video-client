import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../../components/StatCard';

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
      const response = await fetch('http://localhost:8000/videos/track-all', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to add videos to database');
      }
      
      // Refresh the dashboard stats
      onRefresh();
    } catch (error) {
      console.error('Error adding videos to database:', error);
    }
  };

  return (
    <Grid container spacing={3}>
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
      <Grid item xs={12} md={4}>
        <StatCard title="Unuploaded Clips" value={stats.unuploadedClips} />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard title="Uploaded Clips" value={stats.uploadedClips} />
      </Grid>
    </Grid>
  );
};

export default Dashboard; 