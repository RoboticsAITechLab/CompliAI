import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const VerifyEmailPending: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds cooldown
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  useEffect(() => {
    // Get email from URL params or auth store
    const emailParam = searchParams.get('email');
    const userEmail = user?.email;
    const targetEmail = emailParam || userEmail || '';
    
    setEmail(targetEmail);

    if (!targetEmail) {
      // If no email available and user is not authenticated, redirect to login
      // If user is authenticated, redirect back to profile
      if (user) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
      return;
    }

    // Start countdown timer
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
  }, [searchParams, user, navigate]);

  const checkEmailVerification = useCallback(async () => {
    try {
      setIsCheckingEmail(true);
      // Mock API call - replace with actual implementation
      const isVerified = Math.random() > 0.9; // 10% chance of being verified (for demo)
      
      if (isVerified) {
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to check email verification:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  }, [navigate]);

  // Auto-check email verification status every 10 seconds
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      if (!isCheckingEmail && email) {
        await checkEmailVerification();
      }
    }, 10000);

    return () => clearInterval(checkInterval);
  }, [email, isCheckingEmail, checkEmailVerification]);

  const handleResendEmail = async () => {
    if (!canResend || isResending) return;

    try {
      setIsResending(true);
      setError('');
      setMessage('');

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Increment resend count
      setResendCount(prev => prev + 1);
      
      // Reset timer (longer cooldown after multiple resends)
      const cooldown = resendCount >= 2 ? 300 : resendCount >= 1 ? 120 : 60; // 5min, 2min, 1min
      setTimeLeft(cooldown);
      setCanResend(false);
      setMessage('Verification email sent successfully!');

      // Start new countdown
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

    } catch (error) {
      setError('Failed to resend verification email. Please try again.');
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    navigate('/register');
  };

  const handleContactSupport = () => {
    const subject = 'Email Verification Issue';
    const body = `
I'm having trouble verifying my email address.

Details:
- Email: ${email}
- Resend attempts: ${resendCount}
- Registration time: ${new Date().toISOString()}
- Browser: ${navigator.userAgent}

Please assist with email verification.
    `.trim();
    
    window.open(`mailto:support@compliai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCooldownMessage = () => {
    if (resendCount >= 2) {
      return 'Please wait 5 minutes before requesting another email.';
    } else if (resendCount >= 1) {
      return 'Please wait 2 minutes before requesting another email.';
    }
    return 'Please wait 1 minute before requesting another email.';
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

      {/* Verify Email Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Email Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Title and Message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
              <p className="mt-2 text-gray-600">
                We've sent a verification link to:
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 break-all">
                {email}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Next Steps:</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (including spam/junk folder)</li>
                <li>Click the verification link in the email</li>
                <li>Return to this page or login to continue</li>
              </ol>
            </div>

            {/* Auto-refresh indicator */}
            {isCheckingEmail && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Checking verification status...</span>
              </div>
            )}

            {/* Success/Error Messages */}
            {message && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Resend Email Section */}
            <div className="space-y-3">
              {!canResend ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {getCooldownMessage()}
                  </p>
                  <p className="text-lg font-mono text-gray-900">
                    {formatTime(timeLeft)}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleResendEmail}
                  variant="primary"
                  fullWidth
                  isLoading={isResending}
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              )}

              {resendCount > 0 && (
                <p className="text-xs text-gray-500">
                  Resent {resendCount} time{resendCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => checkEmailVerification()}
                variant="outline"
                fullWidth
                isLoading={isCheckingEmail}
              >
                Check Verification Status
              </Button>

              <Button
                onClick={handleChangeEmail}
                variant="ghost"
                fullWidth
              >
                Use Different Email Address
              </Button>
            </div>

            {/* Help Section */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <p className="text-sm text-gray-600">
                Didn't receive the email?
              </p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Check your spam/junk folder</p>
                <p>• Make sure {email.split('@')[1]} allows emails from @compliai.com</p>
                <p>• Wait a few minutes - delivery can take time</p>
              </div>

              <Button
                onClick={handleContactSupport}
                variant="ghost"
                size="sm"
              >
                Contact Support
              </Button>
            </div>

            {/* Rate Limiting Warning */}
            {resendCount >= 3 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Rate Limit Notice</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      You've requested multiple verification emails. Please contact support if you continue to have issues.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Having trouble? Contact us at{' '}
          <a href="mailto:support@compliai.com" className="text-blue-600 hover:text-blue-800">
            support@compliai.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPending;