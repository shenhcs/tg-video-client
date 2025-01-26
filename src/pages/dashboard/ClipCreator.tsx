import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Flag as StartFlag,
  SportsScore as EndFlag,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import axios from 'axios';

interface Video {
  id: number;
  filename: string;
  path: string;
}

export default function ClipCreator() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [outputName, setOutputName] = useState('');
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setPlayed(0);
    setStartTime(0);
    setEndTime(0);
    setOutputName(`${video.filename.split('.')[0]}_clip`);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state: { played: number }) => {
    if (!isPlaying) return;
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    setEndTime(duration);
  };

  const handleSeek = (value: number) => {
    setPlayed(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  };

  const handleSetStartTime = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setStartTime(currentTime);
  };

  const handleSetEndTime = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setEndTime(currentTime);
  };

  const handleCreateClip = async () => {
    if (!selectedVideo) return;

    try {
      const response = await axios.post('http://localhost:5000/api/clips', {
        video_id: selectedVideo.id,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        output_name: outputName,
      });

      if (response.status === 200) {
        alert('Clip creation started successfully!');
      }
    } catch (error) {
      console.error('Error creating clip:', error);
      alert('Error creating clip');
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Video List */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ height: '100%', maxHeight: 600, overflow: 'auto' }}>
          <List>
            <ListItem>
              <Typography variant="h6">Videos</Typography>
            </ListItem>
            {videos.map((video) => (
              <ListItem key={video.id} disablePadding>
                <ListItemButton
                  onClick={() => handleVideoSelect(video)}
                  selected={selectedVideo?.id === video.id}
                >
                  <ListItemText primary={video.filename} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Video Player and Controls */}
      <Grid item xs={12} md={9}>
        <Paper sx={{ p: 2 }}>
          {selectedVideo ? (
            <>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <ReactPlayer
                  ref={playerRef}
                  url={`http://localhost:5000/api/videos/${selectedVideo.id}/stream`}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  playing={isPlaying}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  progressInterval={100}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <IconButton onClick={handlePlayPause}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      value={played}
                      onChange={(_, value) => handleSeek(value as number)}
                      min={0}
                      max={1}
                      step={0.001}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {formatTime(played * duration)} / {formatTime(duration)}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      startIcon={<StartFlag />}
                      onClick={handleSetStartTime}
                      fullWidth
                    >
                      Set Start: {formatTime(startTime)}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      startIcon={<EndFlag />}
                      onClick={handleSetEndTime}
                      fullWidth
                    >
                      Set End: {formatTime(endTime)}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Output Name"
                      value={outputName}
                      onChange={(e) => setOutputName(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateClip}
                    disabled={!outputName || startTime >= endTime}
                  >
                    Create Clip
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1">
                Select a video from the list to start creating clips
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
} 