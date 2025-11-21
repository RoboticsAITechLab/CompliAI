import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import AppRoutes from './routes';

// Import debug utilities for development
if (import.meta.env.DEV) {
  import('../utils/debug');
}

const App: React.FC = () => {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load (for demo mode, this just sets initialized flag)
    initialize();
    
    // Listen for logout events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-storage' && e.newValue === null) {
        // Auth was cleared in another tab, reload to sync state
        window.location.reload();
      }
    };
    
    const handleAuthLogout = () => {
      // Handle logout event from API client
      window.location.href = '/login';
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [initialize]);

  // Show minimal loading for demo mode (very brief)
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-8 w-8 bg-blue-600 rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">CompliAI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppRoutes />
    </div>
  );
};

export default App;
