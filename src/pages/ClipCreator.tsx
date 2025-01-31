import React, { useState, useEffect, useRef } from 'react';
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
  FormHelperText,
} from '@mui/material';
import { videoService, Video } from '../services/api';
import { formatTime, timeToSeconds, validateTimeFormat } from '../utils/time';
import ReactPlayer from 'react-player';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';

const ClipCreator = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const previewPlayerRef = useRef<ReactPlayer>(null);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '00:00:00.000',
    endTime: '00:00:00.000',
    quality: 'native',
  });
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [nextClipNumber, setNextClipNumber] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [timeErrors, setTimeErrors] = useState({
    startTime: '',
    endTime: ''
  });

  const fetchVideos = async () => {
    setIsLoadingVideos(true);
    setError(null);
    try {
      console.log('Fetching videos...');
      const data = await videoService.getVideos();
      console.log('Fetched videos data:', data);
      const allVideos = [...data.uploaded, ...data.unuploaded];
      if (allVideos.length === 0) {
        setError('No videos found. Please upload some videos first.');
      }
      setVideos(allVideos);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError('Failed to load videos. Please try again.');
    } finally {
      setIsLoadingVideos(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchNextClipNumber = async () => {
      if (selectedVideo) {
        try {
          const clipCount = await videoService.getVideoClipCount(selectedVideo.id);
          setNextClipNumber(clipCount + 1);
          // Generate automatic title when video is selected
          const baseTitle = selectedVideo.title || 
            (selectedVideo.path ? selectedVideo.path.split('/').pop() : 'video');
          const newTitle = `${baseTitle}_clip_${clipCount + 1}`;
          setFormData(prev => ({
            ...prev,
            title: newTitle
          }));
        } catch (error) {
          console.error('Failed to fetch clip count:', error);
          setNextClipNumber(1);
        }
      }
    };

    fetchNextClipNumber();
  }, [selectedVideo]);

  const generatePreview = async () => {
    if (!selectedVideo) return;
    
    setIsGenerating(true);
    try {
      console.log('Generating preview with times:', {
        startTime: formData.startTime,
        endTime: formData.endTime,
        startSeconds: videoService.timeToSeconds(formData.startTime),
        endSeconds: videoService.timeToSeconds(formData.endTime)
      });

      const response = await videoService.createClip({
        videoId: selectedVideo.id,
        title: `preview_${Date.now()}`,  // Temporary title for preview
        description: 'Preview clip',
        startTime: formData.startTime,
        endTime: formData.endTime,
        quality: formData.quality,
      });
      
      console.log('Preview response:', response);
      if (response.url) {
        setPreviewUrl(response.url);
        setPreviewPlaying(true);
      } else {
        throw new Error('No preview URL in response');
      }
    } catch (error) {
      console.error('Failed to generate preview:', error);
      if (error instanceof Error) {
        alert(`Failed to generate preview: ${error.message}`);
      } else if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Detailed preview error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage
        });
        alert(`Failed to generate preview: ${errorMessage}`);
      } else {
        alert('Failed to generate preview. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const validateTimes = (startTime: string, endTime: string): boolean => {
    const newErrors = {
      startTime: '',
      endTime: ''
    };

    if (!validateTimeFormat(startTime)) {
      newErrors.startTime = 'Invalid time format. Use HH:MM:SS.mmm';
    }
    if (!validateTimeFormat(endTime)) {
      newErrors.endTime = 'Invalid time format. Use HH:MM:SS.mmm';
    }

    if (validateTimeFormat(startTime) && validateTimeFormat(endTime)) {
      const startSeconds = timeToSeconds(startTime);
      const endSeconds = timeToSeconds(endTime);
      
      if (endSeconds <= startSeconds) {
        newErrors.endTime = 'End time must be after start time';
      }
      if (startSeconds >= duration) {
        newErrors.startTime = 'Start time cannot be after video duration';
      }
      if (endSeconds > duration) {
        newErrors.endTime = 'End time cannot exceed video duration';
      }
    }

    setTimeErrors(newErrors);
    return !newErrors.startTime && !newErrors.endTime;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    validateTimes(
      field === 'startTime' ? newValue : formData.startTime,
      field === 'endTime' ? newValue : formData.endTime
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo || isCreating) return;
    
    if (!validateTimes(formData.startTime, formData.endTime)) {
      return;
    }
    
    setIsCreating(true);
    try {
      const clipTitle = `${selectedVideo.title || 
        (selectedVideo.path ? selectedVideo.path.split('/').pop() : 'video')}_clip_${nextClipNumber}`;
      
      console.log('Creating clip with data:', {
        title: clipTitle,
        startTime: formData.startTime,
        endTime: formData.endTime,
        startSeconds: videoService.timeToSeconds(formData.startTime),
        endSeconds: videoService.timeToSeconds(formData.endTime)
      });

      const response = await videoService.createClip({
        videoId: selectedVideo.id,
        title: clipTitle,
        description: formData.description || undefined,
        startTime: formData.startTime,
        endTime: formData.endTime,
        quality: formData.quality,
      });
      
      console.log('Create clip response:', response);
      
      // Reset form and show success
      setFormData(prev => ({
        ...prev,
        description: '',
        startTime: '00:00:00.000',
        endTime: '00:00:00.000'
      }));
      setPreviewUrl('');
      setNextClipNumber(prev => prev + 1);
      alert('Clip created successfully!');
    } catch (error) {
      console.error('Failed to create clip:', error);
      if (error instanceof Error) {
        alert(`Failed to create clip: ${error.message}`);
      } else if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Detailed error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage
        });
        alert(`Failed to create clip: ${errorMessage}`);
      } else {
        alert('Failed to create clip. Please try again.');
    }
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      const url = videoService.getStreamUrl(selectedVideo.id);
      console.log('Selected video:', selectedVideo);
      console.log('Video ID:', selectedVideo.id);
      console.log('Video URL:', url);
      setVideoUrl(url);
    }
  }, [selectedVideo]);

  const handleProgress = (state: { playedSeconds: number }) => {
    setProgress(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    // Validate times when duration changes
    if (formData.startTime || formData.endTime) {
      validateTimes(formData.startTime, formData.endTime);
    }
  };

  const handlePlayPause = () => {
    console.log('Play/Pause clicked. Current playing state:', playing);
    console.log('Player ref:', playerRef.current);
    console.log('Video URL:', videoUrl);
    console.log('Selected video:', selectedVideo);
    setPlaying(!playing);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    if (playerRef.current) {
      playerRef.current.seekTo(value, 'seconds');
      setProgress(value);
    }
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      startTime: '00:00:00.000',
      endTime: '00:00:00.000',
    }));
    if (playerRef.current) {
      playerRef.current.seekTo(0, 'seconds');
    }
    setPlaying(false);
    setProgress(0);
  };

  const handlePreviewPlayPause = () => {
    setPreviewPlaying(!previewPlaying);
  };

  const handlePreview = () => {
    if (!playerRef.current || !validateTimes(formData.startTime, formData.endTime)) {
      return;
    }
    
    const startSeconds = timeToSeconds(formData.startTime);
    playerRef.current.seekTo(startSeconds, 'seconds');
    setPlaying(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clip Creator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth error={!!error}>
                <InputLabel>Select Video</InputLabel>
                <Select
                  value={selectedVideo?.id?.toString() || ''}
                  onChange={(e) => {
                    const video = videos.find(v => v.id === Number(e.target.value));
                    setSelectedVideo(video || null);
                  }}
                  disabled={isLoadingVideos}
                >
                  {videos.length === 0 && !isLoadingVideos && (
                    <MenuItem disabled value="">
                      No videos available
                    </MenuItem>
                  )}
                  {isLoadingVideos && (
                    <MenuItem disabled value="">
                      Loading videos...
                    </MenuItem>
                  )}
                  {videos.map((video) => (
                    <MenuItem key={video.id} value={video.id.toString()}>
                      {video.title || video.path?.split('/').pop() || `Video ${video.id}`}
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <FormHelperText error>{error}</FormHelperText>
                )}
              </FormControl>
              <Button
                variant="outlined"
                onClick={fetchVideos}
                disabled={isLoadingVideos}
                sx={{ minWidth: 'auto', alignSelf: 'flex-start', mt: 1 }}
              >
                <RefreshIcon />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Time (HH:MM:SS.mmm)"
              value={formData.startTime}
              onChange={handleTimeChange('startTime')}
              error={!!timeErrors.startTime}
              helperText={timeErrors.startTime}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Time (HH:MM:SS.mmm)"
              value={formData.endTime}
              onChange={handleTimeChange('endTime')}
              error={!!timeErrors.endTime}
              helperText={timeErrors.endTime}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Quality</InputLabel>
              <Select
                value={formData.quality}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quality: e.target.value
                }))}
              >
                <MenuItem value="native">Native</MenuItem>
                <MenuItem value="1080p">1080p</MenuItem>
                <MenuItem value="720p">720p</MenuItem>
                <MenuItem value="480p">480p</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={generatePreview}
            disabled={!selectedVideo || isGenerating}
          >
            {isGenerating ? 'Generating Preview...' : 'Generate Preview'}
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!selectedVideo || isCreating}
          >
            {isCreating ? 'Creating Clip...' : 'Create Clip'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {selectedVideo && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Source Video
              </Typography>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <ReactPlayer
                  ref={playerRef}
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  playing={playing}
                  controls
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (playerRef.current) {
                      const currentTime = playerRef.current.getCurrentTime() || 0;
                      setFormData(prev => ({
                        ...prev,
                        startTime: formatTime(currentTime)
                      }));
                    }
                  }}
                >
                  Set Start Time
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (playerRef.current) {
                      const currentTime = playerRef.current.getCurrentTime() || 0;
                      setFormData(prev => ({
                        ...prev,
                        endTime: formatTime(currentTime)
                      }));
                    }
                  }}
                >
                  Set End Time
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {previewUrl && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <ReactPlayer
                  ref={previewPlayerRef}
                  url={previewUrl}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  playing={previewPlaying}
                  controls
                />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ClipCreator; 