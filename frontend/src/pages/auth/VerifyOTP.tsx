import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import OtpInput from '../../components/auth/OtpInput';
import { authService } from '../../services/authService';

const VerifyOTP: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get email from query params or navigation state
  const email = searchParams.get('email') || '';

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/auth/login', { 
        state: { 
          error: 'Email verification session expired. Please try again.' 
        } 
      });
    }
  }, [email, navigate]);

  const handleVerifyEmail = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('Verification code must contain only numbers.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyOtp({ email, code });
      
      // Success - redirect to login with success message
      navigate('/auth/login', {
        state: {
          message: 'Email verified successfully! You can now log in to your account.'
        }
      });
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

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      await authService.sendOtp({ email });
      setError(''); // Clear any previous errors
      // Show success message by temporarily using error state
      setError('New verification code sent to your email address.');
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    } catch (error: unknown) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to resend verification code. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  if (!email) {
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

      {/* Verify Email Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Page Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <p className="text-gray-600">
                We've sent a 6-digit code to:
              </p>
              <p className="font-medium text-gray-900 break-all">
                {email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="py-4">
              <OtpInput
                value={code}
                onChange={setCode}
                disabled={isLoading || isResending}
                error={error}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleVerifyEmail}
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={!code || code.length !== 6 || isResending}
              >
                Verify Email
              </Button>

              <Button
                onClick={handleResendCode}
                variant="outline"
                fullWidth
                isLoading={isResending}
                disabled={isLoading}
              >
                Resend Code
              </Button>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  fullWidth
                  disabled={isLoading || isResending}
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

export default VerifyOTP;