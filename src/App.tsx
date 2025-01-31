import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Uploads from './pages/Uploads';
import Settings from './pages/Settings';
import ClipCreator from './pages/ClipCreator';
import Clips from './pages/Clips';
import Database from './pages/Database';

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
          <Route path="/clip-creator" element={<ClipCreator />} />
          <Route path="/clips/*" element={<Clips />} />
          <Route path="/database" element={<Database />} />
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 