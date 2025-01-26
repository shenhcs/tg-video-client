import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Button,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { videoService, Video } from '../../services/api';
import ReactPlayer from 'react-player';

const VideoCard = ({ video, type, onDelete }: { 
  video: Video; 
  type: 'uploaded' | 'unuploaded';
  onDelete: (id: number) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('Video data:', video);
  }, [video]);

  const handleError = (e: any) => {
    console.error('Video player error:', e);
    setError('Error loading video');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleUpload = async () => {
    try {
      await videoService.uploadVideo(video.id);
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      console.error('Failed to upload video:', error);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await videoService.deleteVideo(video.id);
      onDelete(video.id);
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
    handleMenuClose();
  };

  const videoUrl = video.path ? 
    `http://localhost:8000/storage/videos/${video.path.split('/').pop()}` :
    `http://localhost:8000/videos/${video.id}/stream`;

  console.log('Using video URL:', videoUrl);

  return (
    <Card>
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        {error ? (
          <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
        ) : (
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            playing={isPlaying}
            controls={true}
            onError={handleError}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous"
                }
              }
            }}
          />
        )}
      </Box>
      <CardContent sx={{ position: 'relative' }}>
        <IconButton
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Typography variant="h6" noWrap>{video.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Duration: {video.duration}
        </Typography>
        {type === 'unuploaded' ? (
          <Typography variant="body2" color="text.secondary">
            Size: {video.size} • Created: {video.createdAt}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Views: {video.views} • Uploaded: {video.uploadedAt}
          </Typography>
        )}
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {type === 'unuploaded' ? (
          [
            <MenuItem key="upload" onClick={handleUpload}>Upload</MenuItem>,
            <MenuItem key="clip" onClick={handleMenuClose}>Create Clip</MenuItem>,
            <MenuItem key="delete" onClick={handleDelete}>Delete</MenuItem>,
          ]
        ) : (
          [
            <MenuItem key="clip" onClick={handleMenuClose}>Create Clip</MenuItem>,
            <MenuItem key="download" onClick={handleMenuClose}>Download</MenuItem>,
            <MenuItem key="delete" onClick={handleDelete}>Delete</MenuItem>,
          ]
        )}
      </Menu>
    </Card>
  );
};

const Videos = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [videos, setVideos] = React.useState<{
    uploaded: Video[];
    unuploaded: Video[];
  }>({
    uploaded: [],
    unuploaded: [],
  });
  const [error, setError] = React.useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      console.log('Fetching videos...');
      const response = await fetch('http://localhost:8000/videos');
      console.log('Raw response:', response);
      const data = await response.json();
      console.log('Videos data:', data);
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch videos');
    }
  };

  React.useEffect(() => {
    fetchVideos();
  }, []);

  React.useEffect(() => {
    console.log('Current videos state:', videos);
  }, [videos]);

  const handleDelete = (id: number) => {
    setVideos(prev => ({
      uploaded: prev.uploaded.filter(v => v.id !== id),
      unuploaded: prev.unuploaded.filter(v => v.id !== id),
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (error) {
    return (
      <Box>
        <Typography color="error">Error: {error}</Typography>
        <Button onClick={fetchVideos}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Videos</Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label={`Unuploaded Videos (${videos.unuploaded?.length || 0})`} />
        <Tab label={`Uploaded Videos (${videos.uploaded?.length || 0})`} />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Unuploaded Videos</Typography>
          {!videos.unuploaded?.length ? (
            <Typography>No unuploaded videos found.</Typography>
          ) : (
            <Grid container spacing={3}>
              {videos.unuploaded.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard video={video} type="unuploaded" onDelete={handleDelete} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Uploaded Videos</Typography>
          {videos.uploaded.length === 0 ? (
            <Typography>No uploaded videos found.</Typography>
          ) : (
            <Grid container spacing={3}>
              {videos.uploaded.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard video={video} type="uploaded" onDelete={handleDelete} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default Videos; 