import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Modal, Alert } from '../../components/ui';

interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  platform: string;
  location: string;
  ipAddress: string;
  firstSeen: string;
  lastSeen: string;
  isCurrent: boolean;
  isTrusted: boolean;
  trustExpiry?: string;
  deviceFingerprint: string;
}

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [deviceToRevoke, setDeviceToRevoke] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<Set<string>>(new Set());
  const [trusting, setTrusting] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockDevices: TrustedDevice[] = [
        {
          id: 'current-device',
          deviceName: 'Windows Desktop',
          deviceType: 'desktop',
          browser: 'Chrome 122',
          platform: 'Windows 11',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100',
          firstSeen: new Date(Date.now() - 86400000 * 30).toISOString(),
          lastSeen: new Date().toISOString(),
          isCurrent: true,
          isTrusted: true,
          trustExpiry: new Date(Date.now() + 86400000 * 30).toISOString(),
          deviceFingerprint: 'fp_1234567890abcdef'
        },
        {
          id: 'device-2',
          deviceName: 'iPhone 15',
          deviceType: 'mobile',
          browser: 'Safari',
          platform: 'iOS 17.2',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.101',
          firstSeen: new Date(Date.now() - 86400000 * 15).toISOString(),
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          isCurrent: false,
          isTrusted: true,
          trustExpiry: new Date(Date.now() + 86400000 * 15).toISOString(),
          deviceFingerprint: 'fp_abcdef1234567890'
        },
        {
          id: 'device-3',
          deviceName: 'MacBook Pro',
          deviceType: 'desktop',
          browser: 'Firefox 121',
          platform: 'macOS Sonoma',
          location: 'New York, NY',
          ipAddress: '10.0.0.50',
          firstSeen: new Date(Date.now() - 86400000 * 7).toISOString(),
          lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(),
          isCurrent: false,
          isTrusted: false,
          deviceFingerprint: 'fp_9876543210fedcba'
        },
        {
          id: 'device-4',
          deviceName: 'Samsung Galaxy Tab',
          deviceType: 'tablet',
          browser: 'Chrome Mobile',
          platform: 'Android 14',
          location: 'Los Angeles, CA',
          ipAddress: '172.16.0.25',
          firstSeen: new Date(Date.now() - 86400000 * 5).toISOString(),
          lastSeen: new Date(Date.now() - 86400000).toISOString(),
          isCurrent: false,
          isTrusted: true,
          trustExpiry: new Date(Date.now() + 86400000 * 25).toISOString(),
          deviceFingerprint: 'fp_fedcba0987654321'
        }
      ];
      
      setDevices(mockDevices);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter(device => 
    !searchTerm || 
    device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ipAddress.includes(searchTerm)
  );

  const handleTrustDevice = async (deviceId: string) => {
    setTrusting(prev => new Set([...prev, deviceId]));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              isTrusted: true, 
              trustExpiry: new Date(Date.now() + 86400000 * 30).toISOString() 
            }
          : device
      ));
    } catch (error) {
      console.error('Failed to trust device:', error);
    } finally {
      setTrusting(prev => {
        const updated = new Set(prev);
        updated.delete(deviceId);
        return updated;
      });
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    setRevoking(prev => new Set([...prev, deviceId]));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, isTrusted: false, trustExpiry: undefined }
          : device
      ));
      
      setShowRevokeModal(false);
      setDeviceToRevoke(null);
    } catch (error) {
      console.error('Failed to revoke device:', error);
    } finally {
      setRevoking(prev => {
        const updated = new Set(prev);
        updated.delete(deviceId);
        return updated;
      });
    }
  };

  const getDeviceIcon = (deviceType: TrustedDevice['deviceType']) => {
    switch (deviceType) {
      case 'mobile':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'tablet':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getTrustStatus = (device: TrustedDevice) => {
    if (!device.isTrusted) {
      return { text: 'Not Trusted', color: 'danger' as const };
    }

    if (device.trustExpiry) {
      const expiry = new Date(device.trustExpiry);
      const now = new Date();
      const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft < 0) {
        return { text: 'Expired', color: 'danger' as const };
      } else if (daysLeft < 7) {
        return { text: `Expires in ${daysLeft} days`, color: 'warning' as const };
      }
    }

    return { text: 'Trusted', color: 'success' as const };
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
              <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
              <p className="mt-2 text-gray-600">
                Manage trusted devices and monitor device access to your account
              </p>
            </div>
            <Button
              onClick={loadDevices}
              variant="outline"
              disabled={loading}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <span>Total: {devices.length}</span>
              <span>Trusted: {devices.filter(d => d.isTrusted).length}</span>
              <span>Current: {devices.filter(d => d.isCurrent).length}</span>
            </div>
          </div>
        </Card>

        {/* Devices List */}
        <div className="space-y-4">
          {filteredDevices.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
              <p className="text-gray-600">No devices match your search criteria.</p>
            </Card>
          ) : (
            filteredDevices.map((device) => {
              const trustStatus = getTrustStatus(device);
              
              return (
                <Card key={device.id} className={`p-6 ${device.isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-grow">
                      {/* Device Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                          {getDeviceIcon(device.deviceType)}
                        </div>
                      </div>
                      
                      {/* Device Info */}
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{device.deviceName}</h3>
                          {device.isCurrent && (
                            <Badge variant="success" size="sm">Current Device</Badge>
                          )}
                          <Badge
                            variant={trustStatus.color}
                            size="sm"
                          >
                            {trustStatus.text}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-6">
                            <span>🖥️ {device.browser} on {device.platform}</span>
                            <span>📍 {device.location}</span>
                            <span>🌐 {device.ipAddress}</span>
                          </div>
                          <div className="flex items-center space-x-6">
                            <span>First seen: {new Date(device.firstSeen).toLocaleDateString()}</span>
                            <span>Last active: {new Date(device.lastSeen).toLocaleString()}</span>
                          </div>
                          {device.trustExpiry && (
                            <div>
                              <span>Trust expires: {new Date(device.trustExpiry).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-shrink-0 ml-4 space-x-2">
                      {!device.isCurrent && (
                        <>
                          {!device.isTrusted ? (
                            <Button
                              onClick={() => handleTrustDevice(device.id)}
                              variant="outline"
                              size="sm"
                              isLoading={trusting.has(device.id)}
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Trust Device
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setDeviceToRevoke(device.id);
                                setShowRevokeModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              isLoading={revoking.has(device.id)}
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Revoke Trust
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Technical Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <details className="group">
                      <summary className="flex items-center cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        <svg className="h-4 w-4 mr-1 transform group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Technical Details
                      </summary>
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="grid gap-2 md:grid-cols-2">
                          <div><strong>Device ID:</strong> {device.id}</div>
                          <div><strong>Device Type:</strong> {device.deviceType}</div>
                          <div><strong>Fingerprint:</strong> {device.deviceFingerprint}</div>
                          <div><strong>Platform:</strong> {device.platform}</div>
                        </div>
                      </div>
                    </details>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Device Trust</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Trusted Devices:</strong> Skip 2FA prompts for 30 days</p>
              <p><strong>Automatic Expiry:</strong> Trust expires after 30 days of inactivity</p>
              <p><strong>Current Device:</strong> The device you're currently using</p>
              <p><strong>Revoke Anytime:</strong> Remove trust to require 2FA again</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                Only trust devices you own and use regularly
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                Revoke trust for shared or public computers
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                Monitor device activity regularly
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-0.5">✗</span>
                Never trust devices in public places
              </li>
            </ul>
          </Card>
        </div>

        {/* Revoke Trust Modal */}
        <Modal
          isOpen={showRevokeModal && deviceToRevoke !== null}
          onClose={() => {
            setShowRevokeModal(false);
            setDeviceToRevoke(null);
          }}
          title="Revoke Device Trust"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to revoke trust for this device? 
              The user will need to complete 2FA on their next login.
            </p>
            
            <Alert variant="warning" title="Warning">
              This action cannot be undone. The device will need to be trusted again manually.
            </Alert>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => deviceToRevoke && handleRevokeDevice(deviceToRevoke)}
                variant="danger"
                isLoading={deviceToRevoke ? revoking.has(deviceToRevoke) : false}
                className="flex-1"
              >
                Revoke Trust
              </Button>
              <Button
                onClick={() => {
                  setShowRevokeModal(false);
                  setDeviceToRevoke(null);
                }}
                variant="outline"
                className="flex-1"
                disabled={deviceToRevoke ? revoking.has(deviceToRevoke) : false}
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

export default DeviceManagement;