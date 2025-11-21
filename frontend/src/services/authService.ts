import { apiClient } from './apiClient';
import type { User, AuthTokens, LoginResult, LoginResponse } from '../store/authStore';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
  details?: Record<string, unknown>;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  org?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  org?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Error Code Constants
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SESSION_REVOKED: 'SESSION_REVOKED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const;

interface AxiosErrorResponse {
  status: number;
  data?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
}

class AuthService {
  private readonly baseURL = '/api/v1/auth';

  /**
   * Type guard for axios errors
   */
  private isAxiosError(error: unknown): error is { response: AxiosErrorResponse } {
    return typeof error === 'object' && error !== null && 'response' in error;
  }

  /**
   * Normalize API errors into consistent AuthError format
   */
  private handleError(error: unknown): never {
    // Network or connection errors
    if (!this.isAxiosError(error) || !error.response) {
      throw {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.'
      } as AuthError;
    }

    const { status, data } = error.response;
    const errorCode = data?.code || this.getCodeFromStatus(status);
    const errorMessage = this.getHumanMessage(errorCode, data?.message);

    throw {
      code: errorCode,
      message: errorMessage,
      details: data?.details
    } as AuthError;
  }

  /**
   * Get error code from HTTP status
   */
  private getCodeFromStatus(status: number): string {
    switch (status) {
      case 400: return AUTH_ERROR_CODES.VALIDATION_ERROR;
      case 401: return AUTH_ERROR_CODES.UNAUTHORIZED;
      case 403: return AUTH_ERROR_CODES.FORBIDDEN;
      case 404: return AUTH_ERROR_CODES.NOT_FOUND;
      case 409: return AUTH_ERROR_CODES.CONFLICT;
      case 429: return AUTH_ERROR_CODES.TOO_MANY_REQUESTS;
      case 500: return AUTH_ERROR_CODES.INTERNAL_SERVER_ERROR;
      default: return 'UNKNOWN_ERROR';
    }
  }

  /**
   * Get human-readable message for error codes
   */
  private getHumanMessage(code: string, fallback?: string): string {
    const messages: Record<string, string> = {
      [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: 'Incorrect email or password.',
      [AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: 'Please verify your email address before logging in.',
      [AUTH_ERROR_CODES.ACCOUNT_LOCKED]: 'Your account has been temporarily locked. Please contact support.',
      [AUTH_ERROR_CODES.TOO_MANY_ATTEMPTS]: 'Too many login attempts. Please wait before trying again.',
      [AUTH_ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many requests. Please wait a moment before trying again.',
      [AUTH_ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
      [AUTH_ERROR_CODES.SESSION_REVOKED]: 'Your session has been revoked. Please log in again.',
      [AUTH_ERROR_CODES.CONFLICT]: 'An account with this email already exists.',
      [AUTH_ERROR_CODES.UNAUTHORIZED]: 'Authentication required.',
      [AUTH_ERROR_CODES.FORBIDDEN]: 'Access denied.',
      [AUTH_ERROR_CODES.NOT_FOUND]: 'Resource not found.',
      [AUTH_ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
      [AUTH_ERROR_CODES.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred. Please try again later.',
      [AUTH_ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection and try again.'
    };

    return messages[code] || fallback || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Normalize email consistently with backend
      const normalizedData = {
        email: email.toLowerCase().trim(),
        password: password
      };

      const response = await apiClient.post<ApiResponse<LoginResult>>(
        `${this.baseURL}/login`,
        normalizedData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      // Normalize data consistently with backend expectations
      const normalizedData = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        org: data.org?.trim()
      };

      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        `${this.baseURL}/register`,
        normalizedData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<AuthTokens | null> {
    try {
      const response = await apiClient.post<ApiResponse<AuthTokens>>(
        `${this.baseURL}/refresh`,
        { refreshToken }
      );

      if (!response.data.success) {
        return null;
      }

      return response.data.data;
    } catch (error: unknown) {
      // Return null on refresh failure - caller handles token clearing
      console.warn('Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        `${this.baseURL}/profile`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        `${this.baseURL}/profile`,
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<null>>(
        `${this.baseURL}/change-password`,
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseURL}/request-password-reset`,
        { email: email.toLowerCase().trim() }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to request password reset');
      }
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseURL}/reset-password`,
        { token, password: newPassword }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password reset failed');
      }
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiClient.get<ApiResponse<null>>(
        `${this.baseURL}/verify-email?token=${encodeURIComponent(token)}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Email verification failed');
      }
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseURL}/resend-verification`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to resend verification email');
      }
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Logout from current session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseURL}/logout`);
    } catch (error) {
      // Ignore logout errors - we're clearing local state anyway
      console.warn('Logout request failed:', error);
    }
  }

  /**
   * Logout from all sessions
   */
  async logoutAll(): Promise<void> {
    try {
      await apiClient.post(`${this.baseURL}/logout-all`);
    } catch (error) {
      // Ignore logout errors - we're clearing local state anyway
      console.warn('Logout all request failed:', error);
    }
  }

  /**
   * Verify OTP for email verification or 2FA login
   */
  async verifyOtp(payload: { userId?: string; email?: string; code: string }): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        `${this.baseURL}/verify-otp`,
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'OTP verification failed');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  /**
   * Verify email with OTP code
   */
  async verifyEmailOtp(email: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseURL}/verify-email-otp`,
        { email: email.toLowerCase().trim(), code: otpCode }
      );

      return {
        success: response.data.success,
        error: response.data.success ? undefined : response.data.message
      };
    } catch (error: unknown) {
      if (this.isAxiosError(error) && error.response?.data?.message) {
        return {
          success: false,
          error: error.response.data.message
        };
      }
      return {
        success: false,
        error: 'Email verification failed. Please try again.'
      };
    }
  }

  /**
   * Resend email verification with method choice
   */
  async resendEmailVerification(email: string, method: 'email_link' | 'otp_code'): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseURL}/resend-email-verification`,
        { email: email.toLowerCase().trim(), method }
      );

      return {
        success: response.data.success,
        error: response.data.success ? undefined : response.data.message
      };
    } catch (error: unknown) {
      if (this.isAxiosError(error) && error.response?.data?.message) {
        return {
          success: false,
          error: error.response.data.message
        };
      }
      return {
        success: false,
        error: 'Failed to resend verification. Please try again.'
      };
    }
  }

  /**
   * Send OTP for verification
   */
  async sendOtp(payload: { email: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseURL}/send-otp`,
        { email: payload.email.toLowerCase().trim() }
      );

      return {
        success: response.data.success,
        error: response.data.success ? undefined : response.data.message
      };
    } catch (error: unknown) {
      if (this.isAxiosError(error) && error.response?.data?.message) {
        return {
          success: false,
          error: error.response.data.message
        };
      }
      return {
        success: false,
        error: 'Failed to send OTP. Please try again.'
      };
    }
  }
}

export const authService = new AuthService();
export default authService;