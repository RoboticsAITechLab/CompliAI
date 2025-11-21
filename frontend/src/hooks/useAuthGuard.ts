import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, type UserRole, type User } from '../store/authStore';

export interface UseAuthGuardOptions {
  /** Required roles to access the route */
  requiredRoles?: UserRole | UserRole[];
  /** Redirect path if not authenticated */
  redirectTo?: string;
  /** Redirect path if not authorized (has different role) */
  unauthorizedRedirectTo?: string;
  /** Whether to show loading state while checking auth */
  showLoading?: boolean;
}

export interface UseAuthGuardReturn {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether user has required roles */
  isAuthorized: boolean;
  /** Whether auth check is in progress */
  isLoading: boolean;
  /** Current user object */
  user: User | null;
  /** Whether user has any admin role */
  isAdmin: boolean;
  /** Check if user has specific role(s) */
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  /** Get user display name */
  displayName: string;
}

/**
 * Authentication guard hook that protects routes and provides auth utilities
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const {
    requiredRoles,
    redirectTo = '/login',
    unauthorizedRedirectTo = '/access-denied',
    showLoading = true,
  } = options;

  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    isInitialized,
    hasRole,
    isAdmin,
    getDisplayName,
    canAccess,
  } = useAuthStore();

  // Check if user is authorized based on required roles
  const isAuthorized = canAccess(requiredRoles);

  // Show loading state
  const isLoading = showLoading && (authLoading || !isInitialized);

  useEffect(() => {
    // Don't redirect while loading or if auth is not initialized
    if (isLoading || !isInitialized) {
      return;
    }

    // Handle unauthenticated users
    if (!isAuthenticated) {
      // Save current location to return after login
      const returnTo = location.pathname !== '/login' ? location.pathname : undefined;
      const redirectPath = returnTo 
        ? `${redirectTo}?returnTo=${encodeURIComponent(returnTo)}` 
        : redirectTo;
      
      navigate(redirectPath, { replace: true });
      return;
    }

    // Handle unauthorized users (authenticated but wrong role)
    if (requiredRoles && !isAuthorized) {
      navigate(unauthorizedRedirectTo, { replace: true });
      return;
    }
  }, [
    isAuthenticated,
    isAuthorized,
    isLoading,
    isInitialized,
    navigate,
    requiredRoles,
    redirectTo,
    unauthorizedRedirectTo,
    location.pathname,
  ]);

  return {
    isAuthenticated,
    isAuthorized,
    isLoading,
    user,
    isAdmin: isAdmin(),
    hasRole,
    displayName: getDisplayName(),
  };
}

/**
 * Simplified hook for basic authentication check
 */
export function useAuth() {
  return useAuthGuard();
}

/**
 * Hook for admin-only routes
 */
export function useAdminGuard() {
  return useAuthGuard({
    requiredRoles: ['SUPER_ADMIN', 'ADMIN'],
  });
}

/**
 * Hook for manager+ routes
 */
export function useManagerGuard() {
  return useAuthGuard({
    requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  });
}

export default useAuthGuard;