import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from '../../components/ui';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const { user } = useAuthStore();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      // Redirect to pending page after 3 seconds
      setTimeout(() => {
        navigate('/verify-email-pending');
      }, 3000);
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (error: unknown) {
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Email verification failed. The link may be expired or invalid.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleResendVerification = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerification();
      setMessage('A new verification email has been sent to your email address.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email. Please try again later.';
      setMessage(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <Spinner size="lg" className="mx-auto" />
                <p className="text-gray-600">Verifying your email address...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Email Verified!</h3>
                <p className="text-gray-600">{message}</p>
                <div className="space-y-2">
                  {user ? (
                    <Button
                      onClick={handleGoToDashboard}
                      className="w-full"
                      variant="primary"
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGoToLogin}
                      className="w-full"
                      variant="primary"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verification Failed</h3>
                <p className="text-gray-600">{message}</p>
                <div className="space-y-2">
                  {user ? (
                    <Button
                      onClick={handleResendVerification}
                      className="w-full"
                      variant="outline"
                      disabled={isResending}
                    >
                      {isResending ? <Spinner size="sm" /> : 'Resend Verification Email'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate('/verify-email-pending')}
                        className="w-full"
                        variant="primary"
                      >
                        Go to Email Verification
                      </Button>
                      <Button
                        onClick={handleGoToLogin}
                        className="w-full"
                        variant="outline"
                      >
                        Back to Sign In
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;