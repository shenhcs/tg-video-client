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
import { MoreVert as MoreVertIcon, Pause, PlayArrow } from '@mui/icons-material';
import { videoService, Video } from '../../services/api';
import ReactPlayer from 'react-player';

const VideoCard = ({ video, type, onDelete }: { 
  video: Video; 
  type: 'tracked' | 'untracked';
  onDelete: (id: number) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const playerRef = React.useRef<ReactPlayer>(null);

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

  const handleProgress = (state: { playedSeconds: number }) => {
    setProgress(state.playedSeconds);
  };

  const handleSetStartTime = () => {
    setStartTime(progress);
  };

  const handleSetEndTime = () => {
    setEndTime(progress);
  };

  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
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
          <>
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              playing={isPlaying}
              controls={true}
              onProgress={handleProgress}
              onError={handleError}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "anonymous"
                  }
                }
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                background: 'rgba(0,0,0,0.7)',
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <IconButton 
                onClick={handlePlayPause} 
                sx={{ color: 'white' }}
                size="small"
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Box>
          </>
        )}
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>{video.title}</Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Start: {formatTime(startTime)}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSetStartTime}
                  color="primary"
                >
                  Set
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  End: {formatTime(endTime)}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSetEndTime}
                  color="primary"
                >
                  Set
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Current: {formatTime(progress)} • Duration: {video.duration}
        </Typography>
        {type === 'untracked' ? (
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
        {type === 'untracked' ? (
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
    tracked: Video[];
    untracked: Video[];
  }>({
    tracked: [],
    untracked: [],
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
      setError('Failed to load videos');
    }
  };

  React.useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = (id: number) => {
    setVideos(prev => ({
      tracked: prev.tracked.filter(v => v.id !== id),
      untracked: prev.untracked.filter(v => v.id !== id)
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTrackVideo = async (video: Video) => {
    try {
      // Call scan_videos endpoint to add video to database
      await fetch('http://localhost:8000/refresh', {
        method: 'POST'
      });
      // Refresh video list
      fetchVideos();
    } catch (error) {
      console.error('Failed to track video:', error);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Videos</Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Tracked Videos" />
        <Tab label="Untracked Videos" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {videos.tracked.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <VideoCard
                video={video}
                type="tracked"
                onDelete={handleDelete}
              />
            </Grid>
          ))}
          {videos.tracked.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No tracked videos found
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {videos.untracked.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Size: {video.size} • Duration: {video.duration}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleTrackVideo(video)}
                    fullWidth
                  >
                    Track Video
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {videos.untracked.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No untracked videos found
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Videos; 