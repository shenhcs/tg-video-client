import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import { videoService, Video } from '../../services/api';

interface VideoResponse {
  uploaded: Video[];
  unuploaded: Video[];
}

const DatabaseTable = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data: VideoResponse = await response.json();
        // Combine uploaded and unuploaded videos into a single array
        const allVideos = [...data.uploaded, ...data.unuploaded];
        setVideos(allVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Path</TableCell>
            <TableCell>K2S Status</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>{video.id}</TableCell>
              <TableCell>{video.title}</TableCell>
              <TableCell>{video.path}</TableCell>
              <TableCell>{video.k2s_status}</TableCell>
              <TableCell>{video.size}</TableCell>
              <TableCell>{video.duration}</TableCell>
              <TableCell>
                <Tooltip title="Play">
                  <IconButton 
                    onClick={() => window.open(videoService.getStreamUrl(video.id), '_blank')}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => {
                    if (window.confirm('Are you sure you want to delete this video?')) {
                      videoService.deleteVideo(video.id)
                        .then(() => {
                          // Refresh videos after deletion
                          window.location.reload();
                        })
                        .catch(err => {
                          console.error('Failed to delete video:', err);
                          alert('Failed to delete video');
                        });
                    }
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DatabaseTable; 