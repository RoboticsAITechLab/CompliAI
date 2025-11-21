import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// Define the structure for auth tokens
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Get environment configuration
const getBaseURL = (): string => {
  // In development, use the backend server URL
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }
  
  // In production, use relative URLs (assuming same domain)
  return '';
};

class APIClient {
  private axios: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axios = axios.create({
      baseURL: getBaseURL(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        console.log('🚀 Making API request to:', config.url);
        console.log('🔑 Token status:', token ? 'Present' : 'Missing');
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Authorization header set');
        } else if (!token) {
          console.log('❌ No token available for authorization');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If we're already refreshing, wait for it to complete
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.axios(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.axios.post('/api/v1/auth/refresh', {
              refreshToken,
            });

            if (response.data.success && response.data.data.tokens) {
              const newTokens = response.data.data.tokens;
              this.updateTokens(newTokens);
              
              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              }
              
              // Notify all waiting requests
              this.refreshSubscribers.forEach((callback) => callback(newTokens.accessToken));
              this.refreshSubscribers = [];
              
              return this.axios(originalRequest);
            } else {
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            this.notifyLogout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (!authData) {
        console.log('🔍 No auth-storage found in localStorage');
        return null;
      }
      
      const parsed = JSON.parse(authData);
      const token = parsed.state?.tokens?.accessToken || null;
      
      if (token) {
        console.log('✅ Found access token:', token.substring(0, 50) + '...');
      } else {
        console.log('❌ No access token in auth storage:', parsed);
      }
      
      return token;
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      return null;
    }
  }

  private getRefreshToken(): string | null {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (!authData) return null;
      
      const parsed = JSON.parse(authData);
      return parsed.state?.tokens?.refreshToken || null;
    } catch {
      return null;
    }
  }

  private updateTokens(tokens: AuthTokens): void {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (!authData) return;
      
      const parsed = JSON.parse(authData);
      if (parsed.state) {
        parsed.state.tokens = tokens;
        localStorage.setItem('auth-storage', JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Failed to update tokens in localStorage:', error);
    }
  }

  private clearTokens(): void {
    try {
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('auth_remember_me');
    } catch (error) {
      console.error('Failed to clear tokens from localStorage:', error);
    }
  }

  private notifyLogout(): void {
    // Dispatch a custom event to notify the app of logout
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Also try to redirect to login if we're not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // HTTP methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.get<T>(url, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.post<T>(url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.put<T>(url, data, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.patch<T>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.delete<T>(url, config);
  }

  // Utility methods
  setBaseURL(baseURL: string): void {
    this.axios.defaults.baseURL = baseURL;
  }

  getBaseURL(): string | undefined {
    return this.axios.defaults.baseURL;
  }

  // Download file helper
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.axios.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('File download failed:', error);
      throw new Error('File download failed');
    }
  }

  // Upload file helper
  async uploadFile<T = unknown>(url: string, file: File, progressCallback?: (progress: number) => void): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.axios.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(progress);
        }
      },
    });
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;