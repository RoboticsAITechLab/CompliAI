import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

interface SessionInfo {
  reason: 'timeout' | 'logout' | 'revoked' | 'invalid' | 'security';
  lastActivity?: string;
  sessionDuration?: string;
  deviceInfo?: string;
}

const SessionExpired: React.FC = () => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    reason: 'timeout',
    lastActivity: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    sessionDuration: '2 hours 15 minutes',
    deviceInfo: 'Chrome on Windows'
  });
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuthStore();

  // Get session info from URL params
  useEffect(() => {
    const reason = searchParams.get('reason') as SessionInfo['reason'] || 'timeout';
    const returnTo = searchParams.get('returnTo');
    
    setSessionInfo(prev => ({
      ...prev,
      reason,
      returnTo
    }));

    // Clear any remaining auth state
    logout();
  }, [searchParams, logout]);

  const getSessionDetails = () => {
    switch (sessionInfo.reason) {
      case 'timeout':
        return {
          title: 'Session Expired',
          message: 'Your session has expired due to inactivity.',
          icon: 'clock',
          color: 'yellow'
        };
      case 'revoked':
        return {
          title: 'Session Revoked',
          message: 'Your session was ended by an administrator.',
          icon: 'shield',
          color: 'red'
        };
      case 'security':
        return {
          title: 'Security Logout',
          message: 'You were logged out due to suspicious activity.',
          icon: 'warning',
          color: 'red'
        };
      case 'logout':
        return {
          title: 'Logged Out',
          message: 'You have been successfully logged out.',
          icon: 'check',
          color: 'green'
        };
      default:
        return {
          title: 'Session Invalid',
          message: 'Your session is no longer valid.',
          icon: 'x',
          color: 'red'
        };
    }
  };

  const details = getSessionDetails();

  const handleLoginAgain = () => {
    setIsRedirecting(true);
    const returnTo = searchParams.get('returnTo');
    const loginUrl = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';
    navigate(loginUrl);
  };

  const handleContactSupport = () => {
    const subject = `Session Issue - ${details.title}`;
    const body = `
Session Details:
- Reason: ${sessionInfo.reason}
- Last Activity: ${sessionInfo.lastActivity}
- Session Duration: ${sessionInfo.sessionDuration}
- Device: ${sessionInfo.deviceInfo}
- Timestamp: ${new Date().toISOString()}

Please assist with this session issue.
    `.trim();
    
    window.open(`mailto:support@compliai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const renderIcon = () => {
    const iconClass = `h-8 w-8 text-${details.color}-600`;
    
    switch (details.icon) {
      case 'clock':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'check':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">CompliAI</h1>
          <p className="text-lg text-gray-600">AI-First Compliance OS</p>
        </div>
      </div>

      {/* Session Expired Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-${details.color}-100`}>
              {renderIcon()}
            </div>

            {/* Title and Message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{details.title}</h2>
              <p className="mt-2 text-gray-600">{details.message}</p>
            </div>

            {/* Session Details */}
            {sessionInfo.reason !== 'logout' && (
              <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Session Information</h3>
                {sessionInfo.lastActivity && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Activity:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(sessionInfo.lastActivity).toLocaleString()}
                    </span>
                  </div>
                )}
                {sessionInfo.sessionDuration && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Session Duration:</span>
                    <span className="text-sm text-gray-900">{sessionInfo.sessionDuration}</span>
                  </div>
                )}
                {sessionInfo.deviceInfo && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Device:</span>
                    <span className="text-sm text-gray-900">{sessionInfo.deviceInfo}</span>
                  </div>
                )}
              </div>
            )}

            {/* Security Notice for suspicious activity */}
            {sessionInfo.reason === 'security' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Security Alert</h3>
                    <p className="mt-1 text-sm text-red-700">
                      We detected unusual activity on your account. Please verify your identity when logging back in.
                      If this wasn't you, contact security immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleLoginAgain}
                variant="primary"
                fullWidth
                isLoading={isRedirecting}
              >
                {isRedirecting ? 'Redirecting...' : 'Login Again'}
              </Button>

              {sessionInfo.reason === 'security' && (
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  fullWidth
                  disabled={isRedirecting}
                >
                  Report Security Issue
                </Button>
              )}

              <Button
                onClick={() => navigate('/forgot-password')}
                variant="outline"
                fullWidth
                disabled={isRedirecting}
              >
                Reset Password
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {sessionInfo.reason === 'timeout' 
                  ? 'To stay logged in longer, enable "Remember me" during login.'
                  : 'Need help? Contact our support team for assistance.'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Session ID: SE-{Date.now().toString().slice(-8)} • {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default SessionExpired;