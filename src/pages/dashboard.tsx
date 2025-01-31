import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Movie as MovieIcon,
  Upload as UploadIcon,
  CloudDone as CloudDoneIcon,
  VideoFile as ClipIcon,
  PlaylistAdd as UntrackedIcon,
} from '@mui/icons-material';
import { videoService } from '../services/api';
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
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
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
  );
};

export default Dashboard; 