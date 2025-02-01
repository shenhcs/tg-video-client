import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Box, IconButton, Tooltip, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { videoService, Video } from '../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`video-tabpanel-${index}`}
      aria-labelledby={`video-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VideoTable = () => {
  const [tabValue, setTabValue] = useState(0);
  const [uploadedVideos, setUploadedVideos] = useState<Video[]>([]);
  const [unuploadedVideos, setUnuploadedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchVideos = async () => {
    try {
      const data = await videoService.getVideos();
      setUploadedVideos(data.uploaded || []);
      setUnuploadedVideos(data.unuploaded || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePlay = (video: Video) => {
    // TODO: Implement play functionality
    console.log('Playing video:', video);
  };

  const handleDelete = async (video: Video) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(video.id);
        fetchVideos(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  const handleTrackAll = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const response = await fetch('http://localhost:8000/videos/track-all', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to track videos');
      }
      
      const data = await response.json();
      console.log('Successfully tracked videos:', data);
      fetchVideos(); // Refresh the list
    } catch (error) {
      console.error('Error tracking videos:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadAll = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const response = await fetch('http://localhost:8000/videos/upload-all', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload videos');
      }
      
      const data = await response.json();
      console.log('Successfully uploaded videos:', data);
      fetchVideos(); // Refresh the list
    } catch (error) {
      console.error('Error uploading videos:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderVideoTable = (videos: Video[]) => (
    <Box>
      {tabValue === 1 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleTrackAll}
            disabled={isProcessing}
          >
            Track All Videos
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadAll}
            disabled={isProcessing}
          >
            Upload All Videos
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Clips</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>{video.title || video.filename}</TableCell>
                <TableCell>{video.path}</TableCell>
                <TableCell>{video.size}</TableCell>
                <TableCell>{video.duration}</TableCell>
                <TableCell>{video.clipCount || 0}</TableCell>
                <TableCell>
                  <Tooltip title="Play">
                    <IconButton onClick={() => handlePlay(video)}>
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(video)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Uploaded Videos (${uploadedVideos.length})`} />
          <Tab label={`Unuploaded Videos (${unuploadedVideos.length})`} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderVideoTable(uploadedVideos)}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderVideoTable(unuploadedVideos)}
      </TabPanel>
    </Box>
  );
};

export default VideoTable; 