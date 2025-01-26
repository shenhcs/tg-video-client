import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Movie as MovieIcon,
  Upload as UploadIcon,
  CloudDone as CloudDoneIcon,
  VideoFile as ClipIcon,
} from '@mui/icons-material';
import { videoService } from '../services/api';

const StatCard = ({ title, value, icon, color }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
}) => (
  <Paper sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ color: color, mr: 1 }}>
        {icon}
      </Box>
      <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
    </Box>
    <Typography variant="h4">{value}</Typography>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    unuploadedVideos: 0,
    uploadedVideosWithoutClips: 0,
    uploadedVideosWithClips: 0,
    unuploadedClips: 0,
    uploadedClips: 0,
  });

  const fetchStats = async () => {
    try {
      const data = await videoService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
      <Typography variant="h5" sx={{ mb: 2 }}>Videos</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Unuploaded Videos" 
            value={stats.unuploadedVideos} 
            icon={<VideoIcon />}
            color="#f44336" // red
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Videos Without Clips" 
            value={stats.uploadedVideosWithoutClips} 
            icon={<MovieIcon />}
            color="#ff9800" // orange
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Videos With Clips" 
            value={stats.uploadedVideosWithClips} 
            icon={<CloudDoneIcon />}
            color="#4caf50" // green
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>Clips</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title="Unuploaded Clips" 
            value={stats.unuploadedClips} 
            icon={<UploadIcon />}
            color="#2196f3" // blue
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title="Uploaded Clips" 
            value={stats.uploadedClips} 
            icon={<ClipIcon />}
            color="#9c27b0" // purple
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 