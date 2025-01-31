import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import Videos from './pages/videos';
import Uploads from './pages/uploads';
import Settings from './pages/settings';
import CreateClip from './pages/clips/create';
import PendingClips from './pages/clips/pending';
import ProcessingClips from './pages/clips/processing';
import CompletedClips from './pages/clips/completed';
import Clips from './pages/clips';
import DatabaseView from './pages/database';

interface Stats {
  untrackedVideos: number;
  unuploadedVideos: number;
  uploadedVideosWithoutClips: number;
  uploadedVideosWithClips: number;
  unuploadedClips: number;
  uploadedClips: number;
}

function App() {
  const [stats, setStats] = useState<Stats>({
    untrackedVideos: 0,
    unuploadedVideos: 0,
    uploadedVideosWithoutClips: 0,
    uploadedVideosWithClips: 0,
    unuploadedClips: 0,
    uploadedClips: 0
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard stats={stats} onRefresh={fetchStats} />} />
          <Route path="/videos/*" element={<Videos />} />
          <Route path="/uploads/*" element={<Uploads />} />
          <Route path="/clips/*" element={<Clips />} />
          <Route path="/database" element={<DatabaseView />} />
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 