import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Use Next.js API routes instead of calling FastAPI directly
const BASE_URL = ''

interface User {
  id: string
  email: string
  role: string | null
  full_name?: string
  profile_completed?: boolean
}

interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

interface LoginData {
  email: string
  password: string
}

interface SignupData {
  email: string
  password: string
  role: string
  full_name?: string
}

interface GoogleAuthUrlResponse {
  url: string
}

interface ProfileUpdateData {
  full_name?: string
  bio?: string
  company?: string
  website?: string
  location?: string
  phone?: string
  social_instagram?: string
  social_tiktok?: string
  social_youtube?: string
  social_twitter?: string
  interests?: string[]
  experience_level?: string
  budget_range?: string
  content_categories?: string[]
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  setAuthToken(token: string) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.client.defaults.headers.common['Authorization']
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', data)
    return response.data
  }

  async signup(data: SignupData): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post('/auth/signup', data)
    return response.data
  }

  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    const response: AxiosResponse<GoogleAuthUrlResponse> = await this.client.get('/auth/google/url')
    return response.data
  }

  async exchangeGoogleCode(code: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/google/callback', {
      code: code
    })
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/auth/me')
    return response.data
  }

  async updateUserProfile(profileData: ProfileUpdateData): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post('/auth/profile', profileData)
    return response.data
  }

  async updateUserRole(role: string): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post('/auth/update-role', { role })
    return response.data
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout')
  }

  // Test endpoints
  async testProtected(): Promise<any> {
    const response = await this.client.get('/auth/protected')
    return response.data
  }

  async testAdminOnly(): Promise<any> {
    const response = await this.client.get('/auth/admin-only')
    return response.data
  }

  async testInfluencerOnly(): Promise<any> {
    const response = await this.client.get('/auth/influencer-only')
    return response.data
  }
}

export const api = new ApiClient()
export type { User, AuthResponse, LoginData, SignupData, ProfileUpdateData }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// YouTube Analytics API functions
export const youtubeApi = {
  // Utility function to get channel ID from channel name
  async getChannelIdFromName(channelName: string) {
    const response = await fetch(`/api/youtube/channel-id?channel_name=${encodeURIComponent(channelName)}`);
    if (!response.ok) throw new Error('Failed to fetch channel ID');
    return response.json();
  },

  // Helper function to ensure we have a channel ID (convert from name if needed)
  async ensureChannelId(channelIdentifier: string): Promise<string> {
    // Validate input
    if (!channelIdentifier || channelIdentifier.trim() === '' || channelIdentifier === 'undefined') {
      throw new Error('Channel name or ID is required');
    }
    
    const cleanIdentifier = channelIdentifier.trim();
    
    // If it looks like a channel ID (starts with UC and is 24 chars), use it directly
    if (cleanIdentifier.startsWith('UC') && cleanIdentifier.length === 24) {
      return cleanIdentifier;
    }
    
    // Otherwise, treat it as a channel name and get the ID
    try {
      const result = await this.getChannelIdFromName(cleanIdentifier);
      return result.channel_id;
    } catch (error) {
      throw new Error(`Could not find channel with name: ${cleanIdentifier}`);
    }
  },

  // Channel Analytics - now supports both channel names and IDs
  async getChannelStats(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/stats?channel_id=${channelId}`);
    if (!response.ok) throw new Error('Failed to fetch channel stats');
    return response.json();
  },

  async getChannelAnalytics(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/analytics/channel?channel_id=${channelId}`);
    if (!response.ok) throw new Error('Failed to fetch channel analytics');
    return response.json();
  },

  async getChannelVideos(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/videos?channel_id=${channelId}`);
    if (!response.ok) {
      console.error('Failed to fetch channel videos:', response.statusText);
      throw new Error('Failed to fetch channel videos');
    }
    return response.json();
  },

  async getPlaylistId(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/playlist-id?channel_id=${channelId}`);
    if (!response.ok) throw new Error('Failed to fetch playlist ID');
    return response.json();
  },

  // Video Analytics
  async getVideoDetails(videoUrl: string) {
    const response = await fetch(`/api/youtube/video-details?video_url=${encodeURIComponent(videoUrl)}`);
    if (!response.ok) throw new Error('Failed to fetch video details');
    return response.json();
  },

  async getVideoMetrics(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/metrics?channel_id=${channelId}`);
    if (!response.ok) throw new Error('Failed to fetch video metrics');
    return response.json();
  },

  async getVideoAnalytics(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/analytics/videos?channel_id=${channelId}`);
    if (!response.ok) throw new Error('Failed to fetch video analytics');
    return response.json();
  },

  // Comment Analytics
  async getVideoComments(videoId: string, maxResults: number = 10) {
    const response = await fetch(`/api/youtube/comments?video_id=${videoId}&max_results=${maxResults}`);
    if (!response.ok) throw new Error('Failed to fetch video comments');
    return response.json();
  },

  async getCommentAnalytics(videoId: string) {
    const response = await fetch(`/api/youtube/analytics/comments?video_id=${videoId}`);
    if (!response.ok) throw new Error('Failed to fetch comment analytics');
    return response.json();
  },

  // Engagement Analytics
  async getEngagementMetrics(channelIdentifier: string, duration: string = '30d') {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/engagement?channel_id=${channelId}&duration=${duration}`);
    if (!response.ok) throw new Error('Failed to fetch engagement metrics');
    return response.json();
  },

  // Utility functions
  async getChannelByName(channelName: string) {
    const response = await fetch(`/api/youtube/stats-by-name?channel_name=${encodeURIComponent(channelName)}`);
    if (!response.ok) throw new Error('Failed to fetch channel by name');
    return response.json();
  },

  async testConnection(channelIdentifier: string) {
    const channelId = await this.ensureChannelId(channelIdentifier);
    const response = await fetch(`/api/youtube/test?channel_id=${channelId}`);
    if (!response.ok) throw new Error('Failed to test connection');
    return response.json();
  }
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  // Check for specific error types
  if (error.message.includes('Could not find channel with name')) {
    return {
      error: true,
      message: `Channel not found. Please check the channel name/username and try again. Make sure to use the exact channel handle or display name.`
    };
  }
  
  if (error.message.includes('Failed to fetch')) {
    return {
      error: true,
      message: 'Backend server is not running. Please start the backend server at http://localhost:8000'
    };
  }
  
  if (error.status === 500) {
    return {
      error: true,
      message: 'YouTube API key not configured. Please add YOUTUBE_API_KEY to your backend .env file. See README for setup instructions.'
    };
  }
  
  if (error.status === 400) {
    return {
      error: true,
      message: 'Invalid request. Please check your Channel Name or Video URL format.'
    };
  }
  
  if (error.status === 403) {
    return {
      error: true,
      message: 'YouTube API quota exceeded or invalid API key. Please check your Google Cloud Console settings.'
    };
  }
  
  if (error.status === 404) {
    return {
      error: true,
      message: 'Channel or video not found. Please verify the Channel Name or Video URL is correct.'
    };
  }
  
  return {
    error: true,
    message: error.message || 'An unexpected error occurred. Please try again later.'
  };
}; 