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
  clipCount?: number;
}

export const videoService = {
  // Get video streaming URL
  getStreamUrl: (videoId: number) => {
    const url = `${API_URL}/videos/${videoId}/stream`;
    console.log('Constructing stream URL:', {
      API_URL,
      videoId,
      fullUrl: url
    });
    return url;
  },

  // Get video preview URL
  getVideoUrl: (videoId: number) => {
    // Use the streaming URL for video playback
    return videoService.getStreamUrl(videoId);
  },

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

  // Helper function to format time to HH:MM:SS
  formatTimeForBackend: (timeStr: string): string => {
    // Remove milliseconds if present
    const timeWithoutMs = timeStr.split('.')[0];
    return timeWithoutMs;
  },

  // Create a clip
  createClip: async (data: {
    videoId: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    quality: string;
  }) => {
    try {
      const requestData = {
        start_time: videoService.formatTimeForBackend(data.startTime),
        end_time: videoService.formatTimeForBackend(data.endTime),
        output_name: data.title
      };

      console.log('Create clip - Full request details:', {
        method: 'POST',
        url: `/videos/${data.videoId}/create-clip`,
        data: requestData
      });
      
      const response = await api.post(`/videos/${data.videoId}/create-clip`, requestData);
      console.log('Create clip response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create clip - Error details:', {
        error,
        type: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`API Error: ${message}`);
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Failed to create clip');
      }
    }
  },

  // Helper function to convert time string to seconds
  timeToSeconds: (timeStr: string): number => {
    const [timeComponent, msComponent] = timeStr.split('.');
    const [hours, minutes, seconds] = timeComponent.split(':').map(Number);
    const ms = msComponent ? Number(msComponent) / 1000 : 0;
    return hours * 3600 + minutes * 60 + seconds + ms;
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

  getVideoClipCount: async (videoId: number): Promise<number> => {
    try {
      const response = await api.get(`/videos/${videoId}/clips/count`);
      console.log('Clip count response:', response);
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching clip count:', error);
      return 0;
    }
  },
}; 