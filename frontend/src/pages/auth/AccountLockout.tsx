import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui';

interface LockoutInfo {
  reason: string;
  remainingTime: number; // in seconds
  attemptsCount: number;
  lockoutDuration: number; // in seconds
  canRequestUnlock: boolean;
}

const AccountLockout: React.FC = () => {
  const [lockoutInfo, setLockoutInfo] = useState<LockoutInfo>({
    reason: 'Too many failed login attempts',
    remainingTime: 900, // 15 minutes
    attemptsCount: 5,
    lockoutDuration: 900,
    canRequestUnlock: true
  });
  const [isRequestingUnlock, setIsRequestingUnlock] = useState(false);
  const [unlockRequested, setUnlockRequested] = useState(false);
  
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (lockoutInfo.remainingTime <= 0) return;

    const timer = setInterval(() => {
      setLockoutInfo(prev => ({
        ...prev,
        remainingTime: Math.max(0, prev.remainingTime - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutInfo.remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestUnlock = async () => {
    setIsRequestingUnlock(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUnlockRequested(true);
    } catch (error) {
      console.error('Failed to request unlock:', error);
    } finally {
      setIsRequestingUnlock(false);
    }
  };

  const handleContactSupport = () => {
    window.open('mailto:security@compliai.com?subject=Account Unlock Request - Urgent', '_blank');
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

      {/* Lockout Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Lock Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Temporarily Locked</h2>
              <p className="mt-2 text-gray-600">
                Your account has been temporarily locked for security reasons.
              </p>
            </div>

            {/* Lockout Details */}
            <div className="bg-red-50 p-4 rounded-lg text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-red-900">Reason:</span>
                <span className="text-sm text-red-700">{lockoutInfo.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-red-900">Failed Attempts:</span>
                <span className="text-sm text-red-700">{lockoutInfo.attemptsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-red-900">Time Remaining:</span>
                <span className="text-sm text-red-700 font-mono">
                  {lockoutInfo.remainingTime > 0 ? formatTime(lockoutInfo.remainingTime) : 'Unlocked'}
                </span>
              </div>
            </div>

            {/* Auto Unlock Message */}
            {lockoutInfo.remainingTime > 0 ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Automatic Unlock:</strong> Your account will be automatically unlocked in{' '}
                  <span className="font-mono font-bold">{formatTime(lockoutInfo.remainingTime)}</span>
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Account Unlocked!</strong> You can now try logging in again.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {lockoutInfo.remainingTime <= 0 ? (
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  fullWidth
                >
                  Try Login Again
                </Button>
              ) : (
                <>
                  {lockoutInfo.canRequestUnlock && !unlockRequested && (
                    <Button
                      onClick={handleRequestUnlock}
                      variant="primary"
                      fullWidth
                      isLoading={isRequestingUnlock}
                    >
                      Request Immediate Unlock
                    </Button>
                  )}

                  {unlockRequested && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        <strong>Unlock Requested:</strong> An unlock request has been sent to our security team. 
                        You'll receive an email confirmation shortly.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    fullWidth
                  >
                    Contact Security Support
                  </Button>
                </>
              )}

              <Button
                onClick={() => navigate('/forgot-password')}
                variant="outline"
                fullWidth
              >
                Reset Password Instead
              </Button>
            </div>

            {/* Security Notice */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Account lockouts help protect your data from unauthorized access attempts. 
                If you believe this lockout is in error, please contact our security team immediately.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Security incident ID: LO-{Date.now().toString().slice(-8)} • {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
};

export default AccountLockout;