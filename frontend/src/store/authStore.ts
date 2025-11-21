import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'ANALYST' | 'AUDITOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  org?: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Request/Response Interfaces
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Login2FAResponse {
  status: '2FA_REQUIRED';
  userId: string;
}

export type LoginResult = LoginResponse | Login2FAResponse;

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // 2FA State
  requires2FA: boolean;
  pendingUserId: string | null;
  
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: { email: string; password: string; firstName?: string; lastName?: string; org?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; org?: string }) => Promise<void>;
  
  // 2FA Actions
  set2FARequired: (userId: string) => void;
  clear2FAState: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  
  // Getters
  getDisplayName: () => string;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  canAccess: (requiredRoles?: UserRole | UserRole[]) => boolean;
}

const useAuthStore = create<AuthState>()(persist(
  (set, get) => ({
    // Initial state
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,
    
    // 2FA Initial state
    requires2FA: false,
    pendingUserId: null,

    // Actions
    login: async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        set({ isLoading: true, error: null });
        
        const response = await authService.login(email, password);
        
        // Check if response indicates 2FA is required
        if ('status' in response && response.status === '2FA_REQUIRED' && 'userId' in response) {
          // Set 2FA required state
          get().set2FARequired(response.userId);
          set({ isLoading: false });
          return; // Don't set tokens or user yet
        }
        
        // Handle normal login response
        const loginResponse = response as LoginResponse;
        
        set({
          user: loginResponse.user,
          tokens: loginResponse.tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          requires2FA: false,
          pendingUserId: null,
        });
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('auth_remember_me', 'true');
        } else {
          localStorage.removeItem('auth_remember_me');
        }
      } catch (error: unknown) {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: (error instanceof Error ? error.message : 'Login failed'),
          requires2FA: false,
          pendingUserId: null,
        });
        throw error;
      }
    },

    register: async (data) => {
      try {
        set({ isLoading: true, error: null });
        
        const response = await authService.register(data);
        
        set({
          user: response.user,
          tokens: response.tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error: unknown) {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: (error instanceof Error ? error.message : 'Registration failed'),
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        set({ isLoading: true });
        
        // Call logout on server if we have tokens
        const { tokens } = get();
        if (tokens) {
          try {
            await authService.logout();
          } catch (error) {
            // Ignore logout errors - we're clearing local state anyway
            console.warn('Logout request failed:', error);
          }
        }
        
        // Clear all auth state
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        
        // Clear remember me preference
        localStorage.removeItem('auth_remember_me');
      } catch {
        // Even if logout fails, clear local state
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    },

    refreshToken: async () => {
      try {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const newTokens = await authService.refresh(tokens.refreshToken);
        
        set({
          tokens: newTokens,
          error: null,
        });
      } catch (error: unknown) {
        // If refresh fails, logout user
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: 'Session expired. Please login again.',
        });
        localStorage.removeItem('auth_remember_me');
        throw error;
      }
    },

    clearError: () => {
      set({ error: null });
    },

    initialize: async () => {
      try {
        set({ isLoading: true });
        
        const { tokens } = get();
        
        if (!tokens?.accessToken) {
          set({ 
            isAuthenticated: false,
            isInitialized: true, 
            isLoading: false 
          });
          return;
        }
        
        // Try to get user profile with existing token
        try {
          const user = await authService.getUserProfile();
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        } catch {
          // If profile fetch fails, try to refresh token
          try {
            await get().refreshToken();
            const user = await authService.getUserProfile();
            set({
              user,
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
              error: null,
            });
          } catch {
            // If refresh also fails, clear auth state
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              isInitialized: true,
              isLoading: false,
              error: null,
            });
          }
        }
      } catch {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      }
    },

    updateProfile: async (data: { firstName?: string; lastName?: string; org?: string }) => {
      try {
        set({ isLoading: true, error: null });
        
        const updatedUser = await authService.updateProfile(data);
        
        set({
          user: updatedUser,
          isLoading: false,
          error: null,
        });
      } catch (error: unknown) {
        set({
          isLoading: false,
          error: (error instanceof Error ? error.message : 'Profile update failed'),
        });
        throw error;
      }
    },

    // 2FA Actions
    set2FARequired: (userId: string) => {
      set({
        requires2FA: true,
        pendingUserId: userId,
        isAuthenticated: false,
        user: null,
        tokens: null,
      });
    },

    clear2FAState: () => {
      set({
        requires2FA: false,
        pendingUserId: null,
      });
    },

    setUser: (user: User) => {
      set({ user, isAuthenticated: true });
    },

    setTokens: (tokens: AuthTokens) => {
      set({ tokens });
    },

    // Getters
    getDisplayName: () => {
      const { user } = get();
      if (!user) return 'Guest';
      
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      if (user.firstName) return user.firstName;
      if (user.lastName) return user.lastName;
      return user.email.split('@')[0];
    },

    hasRole: (roles: UserRole | UserRole[]) => {
      const { user } = get();
      if (!user) return false;
      
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },

    isAdmin: () => {
      const { user } = get();
      return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
    },

    canAccess: (requiredRoles?: UserRole | UserRole[]) => {
      const { isAuthenticated, user } = get();
      
      if (!isAuthenticated || !user) return false;
      if (!requiredRoles) return true;
      
      return get().hasRole(requiredRoles);
    },
  }),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      user: state.user,
      tokens: state.tokens,
      isAuthenticated: state.isAuthenticated,
      requires2FA: state.requires2FA,
      pendingUserId: state.pendingUserId,
    }),
    skipHydration: false, // Enable hydration for demo mode
  }
));

// Export hook and store
export { useAuthStore };
export default useAuthStore;