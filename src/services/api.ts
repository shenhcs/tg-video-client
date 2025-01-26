import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  size?: string;
  views?: number;
  createdAt?: string;
  uploadedAt?: string;
  path?: string;
}

export const videoService = {
  // Get all videos
  getVideos: async () => {
    try {
      console.log('Fetching videos...');
      const response = await api.get<{ uploaded: Video[], unuploaded: Video[] }>('/videos');
      console.log('Videos response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Upload a video
  uploadVideo: async (videoId: number) => {
    try {
      console.log('Uploading video:', videoId);
      const response = await api.post(`/videos/${videoId}/upload`);
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Create a clip
  createClip: async (data: {
    videoId: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    quality: string;
  }) => {
    const response = await api.post('/clips', data);
    return response.data;
  },

  // Delete a video
  deleteVideo: async (videoId: number) => {
    await api.delete(`/videos/${videoId}`);
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get<{
      unuploadedVideos: number;
      uploadedVideosWithoutClips: number;
      uploadedVideosWithClips: number;
      unuploadedClips: number;
      uploadedClips: number;
    }>('/stats');
    return response.data;
  },

  // Refresh files
  refreshFiles: async () => {
    const response = await api.post('/refresh');
    return response.data;
  },
}; 