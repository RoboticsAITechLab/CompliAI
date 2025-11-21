import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/ui';
import OtpInput from '../../components/auth/OtpInput';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

type VerificationMethod = 'email_link' | 'otp_code';

const EmailVerificationCenter: React.FC = () => {
  // State Management
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('email_link');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // OTP specific states
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  useEffect(() => {
    // Get email and verification method from URL params
    const emailParam = searchParams.get('email');
    const methodParam = searchParams.get('method') as VerificationMethod;
    const userEmail = user?.email;
    
    const targetEmail = emailParam || userEmail || '';
    setEmail(targetEmail);
    
    // Set verification method (default to email_link if not specified)
    setVerificationMethod(methodParam || 'email_link');

    if (!targetEmail) {
      if (user) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
      return;
    }

    // Start countdown timer for resend
    startCountdown();
  }, [searchParams, user, navigate]);

  const startCountdown = () => {
    setTimeLeft(60);
    setCanResend(false);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  // Auto-check email verification status (only for email_link method)
  const checkEmailVerification = useCallback(async () => {
    if (verificationMethod !== 'email_link') return;
    
    try {
      setIsCheckingStatus(true);
      // Mock API call - replace with actual implementation
      const isVerified = Math.random() > 0.9; // 10% chance for demo
      
      if (isVerified) {
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to check email verification:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [verificationMethod, navigate]);

  // Auto-check every 10 seconds for email link method
  useEffect(() => {
    if (verificationMethod === 'email_link') {
      const checkInterval = setInterval(async () => {
        if (!isCheckingStatus && email) {
          await checkEmailVerification();
        }
      }, 10000);

      return () => clearInterval(checkInterval);
    }
  }, [email, isCheckingStatus, checkEmailVerification, verificationMethod]);

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');
      
      // Real API call for OTP verification
      const response = await authService.verifyEmailOtp(email, otpCode);
      
      if (response.success) {
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(response.error || 'Invalid verification code.');
      }
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend verification
  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setError('');
      setMessage('');

      // Real API call for resending verification
      const response = await authService.resendEmailVerification(email, verificationMethod);
      
      if (response.success) {
        setMessage(`Verification ${verificationMethod === 'otp_code' ? 'code' : 'email'} sent successfully!`);
        startCountdown();
      } else {
        throw new Error(response.error || 'Failed to resend verification.');
      }
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to resend verification. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Switch verification method
  const switchVerificationMethod = (method: VerificationMethod) => {
    setVerificationMethod(method);
    setOtpCode('');
    setError('');
    setMessage('');
    
    // Update URL to reflect the new method
    const params = new URLSearchParams(searchParams);
    params.set('method', method);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
          <p className="mt-2 text-gray-600">We've sent a verification to:</p>
          <p className="mt-1 text-lg font-semibold text-blue-600">{email}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-6">
          {/* Verification Method Toggle */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => switchVerificationMethod('email_link')}
                className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                  verificationMethod === 'email_link'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📧 Email Link
              </button>
              <button
                onClick={() => switchVerificationMethod('otp_code')}
                className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                  verificationMethod === 'otp_code'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🔢 Enter Code
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {message && (
            <Alert variant="success" className="mb-4">
              {message}
            </Alert>
          )}

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Email Link Method */}
          {verificationMethod === 'email_link' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Next Steps:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">1</span>
                    Check your email inbox (including spam/junk folder)
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">2</span>
                    Click the verification link in the email
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">3</span>
                    Return to this page or login to continue
                  </div>
                </div>
              </div>

              {!canResend && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Please wait before requesting another email.</p>
                  <div className="text-2xl font-mono font-bold text-gray-900">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={checkEmailVerification}
                  variant="primary"
                  fullWidth
                  isLoading={isCheckingStatus}
                >
                  Check Verification Status
                </Button>

                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  fullWidth
                  disabled={!canResend || isResending}
                  isLoading={isResending}
                >
                  Resend Email
                </Button>
              </div>
            </div>
          )}

          {/* OTP Code Method */}
          {verificationMethod === 'otp_code' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit verification code sent to your email
                </p>
              </div>

              <div className="space-y-4">
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isVerifying}
                  error={error}
                />

                <Button
                  onClick={handleOtpVerification}
                  variant="primary"
                  fullWidth
                  disabled={!otpCode || otpCode.length !== 6 || isVerifying}
                  isLoading={isVerifying}
                >
                  Verify Code
                </Button>

                {!canResend && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Resend code in:</p>
                    <div className="text-lg font-mono font-bold text-gray-700">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  fullWidth
                  disabled={!canResend || isResending}
                  isLoading={isResending}
                >
                  Resend Code
                </Button>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
            <ul className="text-xs text-gray-500 space-y-1 mb-4">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure your email allows emails from @compliai.com</li>
              <li>• Wait a few minutes - delivery can take time</li>
            </ul>
            <button
              onClick={() => window.open('mailto:support@compliai.com?subject=Email Verification Issue', '_blank')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Contact Support
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerificationCenter;