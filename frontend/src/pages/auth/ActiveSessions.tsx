import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Modal, Alert } from '../../components/ui';

interface ActiveSession {
  id: string;
  deviceInfo: string;
  browser: string;
  platform: string;
  location: string;
  ipAddress: string;
  lastActivity: string;
  loginTime: string;
  isCurrent: boolean;
  isSecure: boolean;
  userAgent: string;
}

const ActiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<Set<string>>(new Set());
  const [terminatingAll, setTerminatingAll] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [sessionToTerminate, setSessionToTerminate] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadSessions, 30000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadSessions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSessions: ActiveSession[] = [
        {
          id: 'current',
          deviceInfo: 'Windows 11, Chrome 122',
          browser: 'Chrome',
          platform: 'Windows',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100',
          lastActivity: new Date().toISOString(),
          loginTime: new Date(Date.now() - 3600000).toISOString(),
          isCurrent: true,
          isSecure: true,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 'session-2',
          deviceInfo: 'iPhone 15, Safari',
          browser: 'Safari',
          platform: 'iOS',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.101',
          lastActivity: new Date(Date.now() - 1800000).toISOString(),
          loginTime: new Date(Date.now() - 7200000).toISOString(),
          isCurrent: false,
          isSecure: true,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)'
        },
        {
          id: 'session-3',
          deviceInfo: 'macOS, Firefox 121',
          browser: 'Firefox',
          platform: 'macOS',
          location: 'New York, NY',
          ipAddress: '10.0.0.50',
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          loginTime: new Date(Date.now() - 86400000).toISOString(),
          isCurrent: false,
          isSecure: false,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0)'
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    setTerminating(prev => new Set([...prev, sessionId]));
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      setShowTerminateModal(false);
      setSessionToTerminate(null);
    } catch (error) {
      console.error('Failed to terminate session:', error);
    } finally {
      setTerminating(prev => {
        const updated = new Set(prev);
        updated.delete(sessionId);
        return updated;
      });
    }
  };

  const handleTerminateAllSessions = async () => {
    setTerminatingAll(true);
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Keep only current session
      setSessions(prev => prev.filter(session => session.isCurrent));
    } catch (error) {
      console.error('Failed to terminate sessions:', error);
    } finally {
      setTerminatingAll(false);
    }
  };

  const getActivityStatus = (lastActivity: string): { text: string; color: string } => {
    const diff = Date.now() - new Date(lastActivity).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 5) return { text: 'Active now', color: 'green' };
    if (minutes < 30) return { text: `${minutes}m ago`, color: 'yellow' };
    if (minutes < 60) return { text: `${minutes}m ago`, color: 'orange' };
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return { text: `${hours}h ago`, color: 'red' };
    
    const days = Math.floor(hours / 24);
    return { text: `${days}d ago`, color: 'gray' };
  };

  const getDeviceIcon = (platform: string) => {
    if (platform === 'iOS' || platform === 'Android') {
      return (
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }

    return (
      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  const getLocationFlag = (location: string) => {
    if (location.includes('CA')) return '🇺🇸';
    if (location.includes('NY')) return '🇺🇸';
    return '🌍';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Active Sessions</h1>
              <p className="mt-2 text-gray-600">
                Manage your active login sessions across all devices
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={loadSessions}
                variant="outline"
                disabled={loading}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
              {sessions.filter(s => !s.isCurrent).length > 0 && (
                <Button
                  onClick={handleTerminateAllSessions}
                  variant="danger"
                  isLoading={terminatingAll}
                >
                  Terminate All Other Sessions
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sessions List */}
          <div className="lg:col-span-3 space-y-4">
            {sessions.map((session) => {
              const activityStatus = getActivityStatus(session.lastActivity);
              
              return (
                <Card key={session.id} className={`p-6 ${session.isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Device Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getDeviceIcon(session.platform)}
                      </div>
                      
                      {/* Session Info */}
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {session.deviceInfo}
                          </h3>
                          {session.isCurrent && (
                            <Badge variant="success" size="sm">Current Session</Badge>
                          )}
                          {!session.isSecure && (
                            <Badge variant="warning" size="sm">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              Insecure
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <span className="mr-1">{getLocationFlag(session.location)}</span>
                              {session.location}
                            </span>
                            <span>IP: {session.ipAddress}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>Logged in: {new Date(session.loginTime).toLocaleString()}</span>
                            <span className={`flex items-center text-${activityStatus.color}-600`}>
                              <span className={`w-2 h-2 bg-${activityStatus.color}-500 rounded-full mr-1`}></span>
                              {activityStatus.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-shrink-0 ml-4">
                      {!session.isCurrent && (
                        <Button
                          onClick={() => {
                            setSessionToTerminate(session.id);
                            setShowTerminateModal(true);
                          }}
                          variant="outline"
                          size="sm"
                          isLoading={terminating.has(session.id)}
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          End Session
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <details className="group">
                      <summary className="flex items-center cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        <svg className="h-4 w-4 mr-1 transform group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Technical Details
                      </summary>
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="grid gap-2">
                          <div><strong>Session ID:</strong> {session.id}</div>
                          <div><strong>Browser:</strong> {session.browser}</div>
                          <div><strong>Platform:</strong> {session.platform}</div>
                          <div><strong>User Agent:</strong> {session.userAgent}</div>
                          <div><strong>Secure Connection:</strong> {session.isSecure ? 'Yes (HTTPS)' : 'No (HTTP)'}</div>
                        </div>
                      </div>
                    </details>
                  </div>
                </Card>
              );
            })}
            
            {sessions.length === 0 && (
              <Card className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Sessions</h3>
                <p className="text-gray-600">You don't have any active sessions at the moment.</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-medium">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Now</span>
                  <span className="font-medium text-green-600">
                    {sessions.filter(s => getActivityStatus(s.lastActivity).color === 'green').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secure Connections</span>
                  <span className="font-medium">
                    {sessions.filter(s => s.isSecure).length}/{sessions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Refresh</span>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Security Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  Regularly review your active sessions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  End sessions on shared computers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  Report suspicious sessions immediately
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  Use secure networks when possible
                </li>
              </ul>
            </Card>

            {/* Security Alert */}
            {sessions.some(s => !s.isSecure) && (
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Insecure Sessions Detected</h3>
                    <p className="mt-1 text-sm text-red-700">
                      Some sessions are using insecure connections. Consider ending them and logging in again.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/change-password')}
                  variant="outline"
                  fullWidth
                  size="sm"
                >
                  Change Password
                </Button>
                <Button
                  onClick={() => navigate('/setup-2fa')}
                  variant="outline"
                  fullWidth
                  size="sm"
                >
                  Manage 2FA
                </Button>
                <Button
                  onClick={() => navigate('/recovery-codes')}
                  variant="outline"
                  fullWidth
                  size="sm"
                >
                  Recovery Codes
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Terminate Session Modal */}
        {/* Terminate Session Modal */}
        <Modal
          isOpen={showTerminateModal && sessionToTerminate !== null}
          onClose={() => {
            setShowTerminateModal(false);
            setSessionToTerminate(null);
          }}
          title="End Session"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to end this session? The user will be logged out immediately.
            </p>
            
            <Alert variant="warning" title="Warning">
              This action cannot be undone. The session will be terminated immediately.
            </Alert>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => sessionToTerminate && handleTerminateSession(sessionToTerminate)}
                variant="danger"
                isLoading={sessionToTerminate ? terminating.has(sessionToTerminate) : false}
                className="flex-1"
              >
                End Session
              </Button>
              <Button
                onClick={() => {
                  setShowTerminateModal(false);
                  setSessionToTerminate(null);
                }}
                variant="outline"
                className="flex-1"
                disabled={sessionToTerminate ? terminating.has(sessionToTerminate) : false}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ActiveSessions;