import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Modal, Alert } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

interface RecoveryCode {
  id: string;
  code: string;
  used: boolean;
  usedAt?: string;
  usedFrom?: string;
}

const RecoveryCodes: React.FC = () => {
  const [recoveryCodes, setRecoveryCodes] = useState<RecoveryCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [actionType, setActionType] = useState<'generate' | 'regenerate' | 'download'>('generate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Load existing recovery codes
  useEffect(() => {
    loadRecoveryCodes();
  }, []);

  const loadRecoveryCodes = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual implementation
      const mockCodes: RecoveryCode[] = [
        { id: '1', code: 'RC-A7K9-M2N5-X8P3', used: false },
        { id: '2', code: 'RC-B4H8-L6Q1-Y9R7', used: false },
        { id: '3', code: 'RC-C3J5-N8W2-Z5T6', used: true, usedAt: '2024-01-10T14:30:00Z', usedFrom: 'Chrome on Windows' },
        { id: '4', code: 'RC-D9K2-P7V4-A1S8', used: false },
        { id: '5', code: 'RC-E6M3-Q5X9-B8F1', used: false },
        { id: '6', code: 'RC-F2L7-R4Y8-C9G3', used: false },
        { id: '7', code: 'RC-G8N1-S6Z2-D5H9', used: false },
        { id: '8', code: 'RC-H4P5-T3A7-E2J6', used: false },
      ];
      setRecoveryCodes(mockCodes);
      setShowCodes(mockCodes.length > 0);
    } catch (error) {
      console.error('Failed to load recovery codes:', error);
      setError('Failed to load recovery codes');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: typeof actionType) => {
    setActionType(type);
    setPasswordConfirmation('');
    setError('');
    setShowPasswordModal(true);
  };

  const confirmAction = async () => {
    if (!passwordConfirmation.trim()) {
      setError('Password is required');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Mock password verification
      if (passwordConfirmation !== 'password123') {
        throw new Error('Invalid password');
      }

      if (actionType === 'generate' || actionType === 'regenerate') {
        // Generate new codes
        const newCodes: RecoveryCode[] = Array.from({ length: 8 }, (_, i) => ({
          id: `new-${i + 1}`,
          code: `RC-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          used: false
        }));
        
        setRecoveryCodes(newCodes);
        setShowCodes(true);
        setShowPasswordModal(false);
        
        // Auto-download codes after generation
        setTimeout(() => {
          downloadCodes(newCodes);
        }, 500);
      } else if (actionType === 'download') {
        setIsDownloading(true);
        downloadCodes(recoveryCodes);
        setIsDownloading(false);
        setShowPasswordModal(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCodes = (codes: RecoveryCode[]) => {
    const content = `CompliAI Recovery Codes
Generated: ${new Date().toLocaleString()}
Account: ${user?.email}

IMPORTANT: Store these codes in a secure location.
Each code can only be used once.

Recovery Codes:
${codes.filter(code => !code.used).map((code, index) => `${index + 1}. ${code.code}`).join('\n')}

Used Codes:
${codes.filter(code => code.used).map(code => `- ${code.code} (Used: ${code.usedAt ? new Date(code.usedAt).toLocaleString() : 'Unknown'})`).join('\n') || 'None'}

Instructions:
1. Keep these codes secure and offline
2. Each code can only be used once
3. Use these codes when you cannot access your 2FA device
4. Generate new codes immediately after using the last one

For security questions, contact: security@compliai.com
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliai-recovery-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUsedCodesCount = () => recoveryCodes.filter(code => code.used).length;
  const getUnusedCodesCount = () => recoveryCodes.filter(code => !code.used).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900">Recovery Codes</h1>
          <p className="mt-2 text-gray-600">
            Backup codes for when your 2FA device is unavailable
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{getUnusedCodesCount()}</div>
                  <div className="text-sm text-green-700">Available Codes</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{getUsedCodesCount()}</div>
                  <div className="text-sm text-red-700">Used Codes</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{recoveryCodes.length}</div>
                  <div className="text-sm text-blue-700">Total Generated</div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recoveryCodes.length === 0 && (
                  <Button
                    onClick={() => handleAction('generate')}
                    variant="primary"
                    isLoading={isGenerating && actionType === 'generate'}
                  >
                    Generate Codes
                  </Button>
                )}
                
                {recoveryCodes.length > 0 && (
                  <>
                    <Button
                      onClick={() => handleAction('regenerate')}
                      variant="outline"
                      isLoading={isGenerating && actionType === 'regenerate'}
                    >
                      Regenerate All
                    </Button>
                    <Button
                      onClick={() => handleAction('download')}
                      variant="outline"
                      isLoading={isDownloading}
                    >
                      Download Codes
                    </Button>
                    <Button
                      onClick={() => setShowCodes(!showCodes)}
                      variant="ghost"
                    >
                      {showCodes ? 'Hide Codes' : 'Show Codes'}
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Recovery Codes Display */}
            {showCodes && recoveryCodes.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Recovery Codes</h2>
                <div className="bg-gray-900 p-4 rounded-lg text-white font-mono text-sm">
                  <div className="grid gap-2 md:grid-cols-2">
                    {recoveryCodes.map((code, index) => (
                      <div 
                        key={code.id}
                        className={`flex justify-between items-center p-2 rounded ${
                          code.used ? 'bg-red-800/50 line-through text-red-300' : 'bg-gray-800'
                        }`}
                      >
                        <span>{index + 1}. {code.code}</span>
                        {code.used && (
                          <span className="text-xs text-red-400">USED</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Store these codes securely offline. Each code can only be used once. 
                        Screenshot or download these codes before closing this page.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Usage History */}
            {recoveryCodes.some(code => code.used) && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage History</h2>
                <div className="space-y-3">
                  {recoveryCodes.filter(code => code.used).map(code => (
                    <div key={code.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-mono text-sm text-gray-900">{code.code}</span>
                        <div className="text-xs text-gray-500">
                          Used: {code.usedAt ? new Date(code.usedAt).toLocaleString() : 'Unknown'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {code.usedFrom || 'Unknown device'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Recovery Codes</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">What are they?</h4>
                  <p>Backup codes that let you access your account when your 2FA device is unavailable.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">When to use?</h4>
                  <p>Use when you lose your phone, authenticator app, or hardware key.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Important</h4>
                  <p>Each code works only once. Generate new codes after using them all.</p>
                </div>
              </div>
            </Card>

            {/* Security Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Best Practices</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Store codes in a secure password manager
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Print and store in a safe location
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Never share codes with anyone
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Don't store in email or cloud notes
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Don't take photos with your phone
                </li>
              </ul>
            </Card>

            {/* Alert for Low Codes */}
            {getUnusedCodesCount() <= 2 && getUnusedCodesCount() > 0 && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Low Codes Warning</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      You only have {getUnusedCodesCount()} codes left. Consider generating new ones soon.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Password Confirmation Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordConfirmation('');
            setError('');
          }}
          title={`Confirm ${actionType === 'generate' ? 'Generate' : actionType === 'regenerate' ? 'Regenerate' : 'Download'} Codes`}
          size="md"
        >
          <div className="space-y-4">
            {actionType === 'regenerate' && (
              <Alert variant="warning">
                This will invalidate all existing codes. Make sure you have access to your 2FA device.
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter your password to continue
              </label>
              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Password"
                className="mt-1"
                autoFocus
                error={error}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={confirmAction}
                variant="primary"
                isLoading={isGenerating}
                className="flex-1"
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordConfirmation('');
                  setError('');
                }}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
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

export default RecoveryCodes;