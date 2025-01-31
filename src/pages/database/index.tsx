import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';

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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Video {
  id: number;
  filename: string;
  path: string;
  k2s_status: string;
  k2s_link: string | null;
  created_at: string;
}

interface Clip {
  id: number;
  video_id: number;
  filename: string;
  path: string;
  start_time: number;
  end_time: number;
  k2s_link: string | null;
  telegram_status: string;
  telegram_link: string | null;
  created_at: string;
}

const DatabaseView = () => {
  const [tabValue, setTabValue] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch videos
      const videosResponse = await fetch('http://localhost:8000/videos');
      const videosData = await videosResponse.json();
      setVideos(videosData.tracked || []);

      // Fetch clips
      const clipsResponse = await fetch('http://localhost:8000/clips');
      const clipsData = await clipsResponse.json();
      setClips(clipsData || []);
    } catch (error) {
      console.error('Failed to fetch database data:', error);
      setError('Failed to load database contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Database Contents</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Videos" />
          <Tab label="Clips" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>K2S Status</TableCell>
                <TableCell>K2S Link</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.id}</TableCell>
                  <TableCell>{video.filename}</TableCell>
                  <TableCell>
                    <Chip 
                      label={video.k2s_status}
                      color={video.k2s_status === 'uploaded' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {video.k2s_link ? (
                      <a href={video.k2s_link} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{new Date(video.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Video ID</TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>Time Range</TableCell>
                <TableCell>Telegram Status</TableCell>
                <TableCell>Links</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clips.map((clip) => (
                <TableRow key={clip.id}>
                  <TableCell>{clip.id}</TableCell>
                  <TableCell>{clip.video_id}</TableCell>
                  <TableCell>{clip.filename}</TableCell>
                  <TableCell>
                    {formatTime(clip.start_time)} - {formatTime(clip.end_time)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={clip.telegram_status}
                      color={clip.telegram_status === 'uploaded' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {clip.k2s_link && (
                      <Chip 
                        label="K2S"
                        component="a"
                        href={clip.k2s_link}
                        target="_blank"
                        clickable
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {clip.telegram_link && (
                      <Chip 
                        label="Telegram"
                        component="a"
                        href={clip.telegram_link}
                        target="_blank"
                        clickable
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{new Date(clip.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
};

export default DatabaseView; 