import React from 'react';
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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/videos/*" element={<Videos />} />
          <Route path="/uploads/*" element={<Uploads />} />
          <Route path="/clips/create" element={<CreateClip />} />
          <Route path="/clips/pending" element={<PendingClips />} />
          <Route path="/clips/processing" element={<ProcessingClips />} />
          <Route path="/clips/completed" element={<CompletedClips />} />
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 