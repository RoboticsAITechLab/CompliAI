import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import OtpInput from '../../components/auth/OtpInput';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const TwoFactorLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { pendingUserId, clear2FAState, setUser, setTokens } = useAuthStore();

  // Redirect if no pending 2FA session
  useEffect(() => {
    if (!pendingUserId) {
      navigate('/auth/login', {
        state: {
          error: 'Two-factor authentication session expired. Please log in again.'
        }
      });
    }
  }, [pendingUserId, navigate]);

  const handleVerifyAndContinue = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('Verification code must contain only numbers.');
      return;
    }

    if (!pendingUserId) {
      setError('Session expired. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp({ 
        userId: pendingUserId, 
        code 
      });

      // Success - complete the login process
      if (response.user && response.tokens) {
        setUser(response.user);
        setTokens(response.tokens);
        clear2FAState();
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'Invalid verification code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    clear2FAState();
    navigate('/auth/login');
  };

  const handleUseRecoveryCode = () => {
    setError('Recovery code authentication coming soon!');
  };

  if (!pendingUserId) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">CompliAI</h1>
          <p className="text-lg text-gray-600">AI-First Compliance OS</p>
        </div>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Page Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Two-Factor Authentication
              </h2>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <p className="text-gray-600">
                Your account requires a second verification step.
              </p>
              <p className="text-sm text-gray-500">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>

            {/* OTP Input */}
            <div className="py-4">
              <OtpInput
                value={code}
                onChange={setCode}
                disabled={isLoading}
                error={error}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleVerifyAndContinue}
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={!code || code.length !== 6}
              >
                Verify & Continue
              </Button>

              <Button
                onClick={handleUseRecoveryCode}
                variant="outline"
                fullWidth
                disabled={isLoading}
              >
                Use Recovery Code (Coming Soon)
              </Button>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  fullWidth
                  disabled={isLoading}
                >
                  ← Back to Login
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} CompliAI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TwoFactorLogin;