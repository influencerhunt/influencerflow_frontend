import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Use Next.js API routes instead of calling FastAPI directly
const BASE_URL = ''

interface User {
  id: string
  email: string
  role: string
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
}

interface GoogleAuthUrlResponse {
  url: string
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

  async exchangeGoogleToken(accessToken: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/google', {
      access_token: accessToken
    })
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
export type { User, AuthResponse, LoginData, SignupData } 