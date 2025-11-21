import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Select } from '../../components/ui';

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  category: 'authentication' | 'authorization' | 'session' | 'account' | 'security' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  outcome: 'success' | 'failure' | 'warning';
  metadata?: Record<string, unknown>;
}

const SecurityLogs: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadSecurityLogs();
  }, [dateRange]);

  const loadSecurityLogs = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          event: 'login_success',
          category: 'authentication',
          severity: 'low',
          description: 'User logged in successfully',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'San Francisco, CA',
          outcome: 'success',
          metadata: { method: '2fa', device: 'Windows Chrome' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          event: 'failed_login_attempt',
          category: 'authentication',
          severity: 'medium',
          description: 'Failed login attempt - invalid password',
          ipAddress: '203.0.113.45',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          location: 'Unknown Location',
          outcome: 'failure',
          metadata: { attempts: 3, lockout: false }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          event: 'password_changed',
          category: 'account',
          severity: 'medium',
          description: 'User password changed successfully',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'San Francisco, CA',
          outcome: 'success',
          metadata: { strength: 'strong', method: 'self_service' }
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          event: 'suspicious_login_attempt',
          category: 'security',
          severity: 'high',
          description: 'Login attempt from suspicious IP address',
          ipAddress: '185.220.101.45',
          userAgent: 'curl/7.68.0',
          location: 'Unknown Location',
          outcome: 'warning',
          metadata: { risk_score: 85, blocked: true, reason: 'tor_exit_node' }
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          event: '2fa_enabled',
          category: 'security',
          severity: 'low',
          description: 'Two-factor authentication enabled',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'San Francisco, CA',
          outcome: 'success',
          metadata: { method: 'totp', backup_codes: true }
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 28800000).toISOString(),
          event: 'session_terminated',
          category: 'session',
          severity: 'medium',
          description: 'Session terminated due to suspicious activity',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)',
          location: 'San Francisco, CA',
          outcome: 'warning',
          metadata: { reason: 'location_change', automatic: true }
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load security logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: SecurityLog['severity']) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'default';
    }
  };

  const getOutcomeColor = (outcome: SecurityLog['outcome']) => {
    switch (outcome) {
      case 'success': return 'success';
      case 'failure': return 'danger';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: SecurityLog['category']) => {
    switch (category) {
      case 'authentication':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2v3m0-3V9a2 2 0 012-2m-2 2a2 2 0 00-2 2m2-2a2 2 0 012 2" />
          </svg>
        );
      case 'security':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'session':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'account':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'authorization':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2v3m0-3V9a2 2 0 012-2m-2 2a2 2 0 00-2 2m2-2a2 2 0 012 2" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Event,Category,Severity,Description,IP Address,Location,Outcome',
      ...filteredLogs.map(log => [
        log.timestamp,
        log.event,
        log.category,
        log.severity,
        `"${log.description}"`,
        log.ipAddress,
        `"${log.location}"`,
        log.outcome
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Security Audit Logs</h1>
              <p className="mt-2 text-gray-600">
                Monitor and review security events for your account
              </p>
            </div>
            <Button
              onClick={exportLogs}
              variant="outline"
              disabled={filteredLogs.length === 0}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Logs
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search events, IPs, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                { value: "authentication", label: "Authentication" },
                { value: "authorization", label: "Authorization" },
                { value: "session", label: "Session" },
                { value: "account", label: "Account" },
                { value: "security", label: "Security" },
                { value: "system", label: "System" }
              ]}
              fullWidth
            />

            <Select
              label="Severity"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              options={[
                { value: "all", label: "All Severities" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" }
              ]}
              fullWidth
            />

            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: "24hours", label: "Last 24 Hours" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
                { value: "90days", label: "Last 90 Days" }
              ]}
              fullWidth
            />
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredLogs.length} of {logs.length} logs</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </Card>

        {/* Security Summary Cards */}
        <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Successful Events
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {logs.filter(log => log.outcome === 'success').length}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Failed Events
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {logs.filter(log => log.outcome === 'failure').length}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Warnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {logs.filter(log => log.outcome === 'warning').length}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    High/Critical
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {logs.filter(log => log.severity === 'high' || log.severity === 'critical').length}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600">No security logs match your current filters.</p>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="p-6">
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-grow">
                      {/* Category Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`p-2 rounded-lg bg-gray-100 text-gray-600`}>
                          {getCategoryIcon(log.category)}
                        </div>
                      </div>
                      
                      {/* Event Details */}
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {log.event.replace(/_/g, ' ')}
                          </h3>
                          <Badge 
                            variant={getSeverityColor(log.severity)} 
                            size="sm"
                          >
                            {log.severity.toUpperCase()}
                          </Badge>
                          <Badge 
                            variant={getOutcomeColor(log.outcome)} 
                            size="sm"
                          >
                            {log.outcome.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{log.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>🕒 {new Date(log.timestamp).toLocaleString()}</span>
                          <span>📍 {log.location}</span>
                          <span>🌐 {log.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand Arrow */}
                    <div className="flex-shrink-0 ml-4">
                      <svg 
                        className={`h-5 w-5 text-gray-400 transform transition-transform ${
                          expandedLog === log.id ? 'rotate-90' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedLog === log.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Technical Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Technical Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Event ID:</span>
                              <span className="text-gray-900 font-mono">{log.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Category:</span>
                              <span className="text-gray-900 capitalize">{log.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">User Agent:</span>
                              <span className="text-gray-900 truncate max-w-xs" title={log.userAgent}>
                                {log.userAgent.split(' ')[0]}...
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        {log.metadata && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Data</h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(log.metadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                                  <span className="text-gray-900">
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Full User Agent */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Full User Agent</h5>
                        <p className="text-xs text-gray-600 font-mono break-all">{log.userAgent}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredLogs.length > 0 && filteredLogs.length < logs.length && (
          <div className="mt-8 text-center">
            <Button variant="outline">
              Load More Logs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityLogs;