import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Slider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface Video {
  id: string;
  filename: string;
  path: string;
}

interface ClipCreatorProps {
  onClipCreate?: (clipData: {
    video_id: string;
    start_time: number;
    end_time: number;
    output_name: string;
  }) => void;
}

const ClipCreator: React.FC<ClipCreatorProps> = ({ onClipCreate }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [outputName, setOutputName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previewTime, setPreviewTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  // Fetch videos from database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:8000/videos');
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);

  const handleVideoSelect = (event: any) => {
    setSelectedVideo(event.target.value);
    setStartTime(0);
    setEndTime(0);
    setOutputName('');
    setCurrentTime(0);
    setPreviewTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleSetStartTime = () => {
    if (videoRef.current) {
      setStartTime(videoRef.current.currentTime * 1000);
    }
  };

  const handleSetEndTime = () => {
    if (videoRef.current) {
      setEndTime(videoRef.current.currentTime * 1000);
    }
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setStartTime(value);
      if (videoRef.current) {
        videoRef.current.currentTime = value / 1000;
      }
    }
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setEndTime(value);
      if (videoRef.current) {
        videoRef.current.currentTime = value / 1000;
      }
    }
  };

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    const time = newValue as number;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePreviewSeek = (_event: Event, newValue: number | number[]) => {
    const time = newValue as number;
    if (previewRef.current) {
      previewRef.current.currentTime = time;
      setPreviewTime(time);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const togglePreviewPlay = () => {
    if (previewRef.current) {
      if (isPreviewPlaying) {
        previewRef.current.pause();
      } else {
        previewRef.current.currentTime = startTime / 1000;
        const playPreview = () => {
          if (previewRef.current && previewRef.current.currentTime >= endTime / 1000) {
            previewRef.current.pause();
            setIsPreviewPlaying(false);
            previewRef.current.removeEventListener('timeupdate', playPreview);
          }
          setPreviewTime(previewRef.current?.currentTime || 0);
        };
        previewRef.current.addEventListener('timeupdate', playPreview);
        previewRef.current.play();
      }
      setIsPreviewPlaying(!isPreviewPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onClipCreate && selectedVideo && startTime < endTime) {
      onClipCreate({
        video_id: selectedVideo,
        start_time: startTime,
        end_time: endTime,
        output_name: outputName,
      });
    }
  };

  const selectedVideoData = videos.find(v => v.id === selectedVideo);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Clip
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Video</InputLabel>
          <Select
            value={selectedVideo}
            onChange={handleVideoSelect}
            label="Select Video"
          >
            {videos.map((video) => (
              <MenuItem key={video.id} value={video.id}>
                {video.filename}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Source Video</Typography>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <video
                ref={videoRef}
                src={selectedVideoData ? `http://localhost:8000/videos/${selectedVideoData.id}/stream` : ''}
                style={{ width: '100%' }}
                controls={false}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              <IconButton
                onClick={togglePlay}
                sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.6)' }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Box>
            <Box sx={{ px: 2, mt: 1 }}>
              <Slider
                value={currentTime}
                onChange={handleSeek}
                min={0}
                max={duration}
                step={0.001}
              />
              <Typography variant="body2" align="center">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Preview</Typography>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <video
                ref={previewRef}
                src={selectedVideoData ? `http://localhost:8000/videos/${selectedVideoData.id}/stream` : ''}
                style={{ width: '100%' }}
                controls={false}
              />
              <IconButton
                onClick={togglePreviewPlay}
                sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.6)' }}
              >
                {isPreviewPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Box>
            <Box sx={{ px: 2, mt: 1 }}>
              <Slider
                value={previewTime}
                onChange={handlePreviewSeek}
                min={startTime / 1000}
                max={endTime / 1000}
                step={0.001}
                disabled={startTime >= endTime}
              />
              <Typography variant="body2" align="center">
                {formatTime(previewTime)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Start Time (ms)"
                type="number"
                value={startTime}
                onChange={handleStartTimeChange}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSetStartTime}
                sx={{ minWidth: '120px' }}
              >
                Set Start
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="End Time (ms)"
                type="number"
                value={endTime}
                onChange={handleEndTimeChange}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSetEndTime}
                sx={{ minWidth: '120px' }}
              >
                Set End
              </Button>
            </Box>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Output Name"
          value={outputName}
          onChange={(e) => setOutputName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!selectedVideo || startTime >= endTime || !outputName}
          fullWidth
        >
          Create Clip
        </Button>
      </Box>
    </Paper>
  );
};

export default ClipCreator; 
