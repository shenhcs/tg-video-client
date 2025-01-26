import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { videoService, Video } from '../../services/api';

const CreateClip = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedVideo: '',
    startTime: '',
    endTime: '',
    quality: '720p',
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videoService.getVideos();
        setVideos([...data.uploaded, ...data.unuploaded]);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await videoService.createClip({
        videoId: parseInt(formData.selectedVideo),
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        quality: formData.quality,
      });
      // Redirect or show success message
    } catch (error) {
      console.error('Failed to create clip:', error);
    }
  };

  const selectedVideo = videos.find(v => v.id.toString() === formData.selectedVideo);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Create New Clip</Typography>
      
      {/* Video Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Select Video</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Video</InputLabel>
          <Select
            value={formData.selectedVideo}
            label="Video"
            onChange={(e) => setFormData({ ...formData, selectedVideo: e.target.value })}
          >
            {videos.map((video) => (
              <MenuItem key={video.id} value={video.id}>
                {video.title} ({video.duration})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedVideo && (
          <Card sx={{ maxWidth: 345, mx: 'auto' }}>
            <CardMedia
              component="img"
              height="194"
              image={selectedVideo.thumbnail}
              alt={selectedVideo.title}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Duration: {selectedVideo.duration}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Paper>

      {/* Clip Details Form */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Clip Details</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time (HH:MM:SS)"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time (HH:MM:SS)"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Quality</InputLabel>
                <Select
                  value={formData.quality}
                  label="Quality"
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                >
                  <MenuItem value="480p">480p</MenuItem>
                  <MenuItem value="720p">720p</MenuItem>
                  <MenuItem value="1080p">1080p</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={!formData.selectedVideo}
              >
                Create Clip
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateClip; 