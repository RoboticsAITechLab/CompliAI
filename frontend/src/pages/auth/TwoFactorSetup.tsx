import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/ui';
import OtpInput from '../../components/auth/OtpInput';
import { useAuthStore } from '../../store/authStore';

const TwoFactorSetup: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'success'>('intro');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryCodes] = useState([
    'ABC123', 'DEF456', 'GHI789', 'JKL012',
    'MNO345', 'PQR678', 'STU901', 'VWX234'
  ]);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGetStarted = () => {
    setStep('qr');
  };

  const handleContinueToVerify = () => {
    setStep('verify');
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, call authService.enable2FA()
      // await authService.enable2FA(verificationCode);

      setStep('success');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/profile');
  };

  const renderIntroStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Setup Two-Factor Authentication</h2>
        <p className="mt-2 text-gray-600">
          Add an extra layer of security to your account
        </p>
      </div>

      <Alert variant="info" title="What you'll need:">
        <ul className="space-y-1">
          <li>• An authenticator app (Google Authenticator, Authy, etc.)</li>
          <li>• Your smartphone or tablet</li>
          <li>• A few minutes to complete setup</li>
        </ul>
      </Alert>

      <div className="space-y-3">
        <Button onClick={handleGetStarted} variant="primary" fullWidth>
          Get Started
        </Button>
        <Button onClick={() => navigate('/profile')} variant="outline" fullWidth>
          Maybe Later
        </Button>
      </div>
    </div>
  );

  const renderQRStep = () => (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Scan QR Code</h2>
        <p className="mt-2 text-gray-600">
          Use your authenticator app to scan this QR code
        </p>
      </div>

      {/* Mock QR Code */}
      <div className="mx-auto w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M20 12v4.01" />
          </svg>
          <p className="text-sm text-gray-500">QR Code would appear here</p>
          <p className="text-xs text-gray-400 mt-1">Demo Mode</p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>Can't scan?</strong> Manually enter this code in your authenticator app:
        </p>
        <code className="block mt-2 text-xs font-mono bg-white p-2 rounded border">
          DEMO123ABCDEF456GHIJK789
        </code>
      </div>

      <Button onClick={handleContinueToVerify} variant="primary" fullWidth>
        I've Added the Code
      </Button>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Verify Setup</h2>
        <p className="mt-2 text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="py-4">
        <OtpInput
          value={verificationCode}
          onChange={setVerificationCode}
          disabled={isLoading}
          error={error}
        />
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleVerifyCode}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!verificationCode || verificationCode.length !== 6}
        >
          Verify & Enable 2FA
        </Button>
        <Button onClick={() => setStep('qr')} variant="outline" fullWidth disabled={isLoading}>
          Back to QR Code
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">2FA Enabled!</h2>
        <p className="mt-2 text-gray-600">
          Your account is now protected with two-factor authentication
        </p>
      </div>

      <Alert variant="warning" title="Save Your Recovery Codes">
        <p className="mb-3">
          Store these codes in a safe place. You can use them to access your account if you lose your phone.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {recoveryCodes.map((code, index) => (
            <code key={index} className="block text-xs font-mono bg-white p-2 rounded border text-center">
              {code}
            </code>
          ))}
        </div>
      </Alert>

      <div className="space-y-3">
        <Button onClick={handleFinish} variant="primary" fullWidth>
          Finish Setup
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['Setup', 'Scan', 'Verify', 'Done'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index === 0 && step === 'intro' ? 'bg-blue-600 text-white' :
                    index === 1 && step === 'qr' ? 'bg-blue-600 text-white' :
                    index === 2 && step === 'verify' ? 'bg-blue-600 text-white' :
                    index === 3 && step === 'success' ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 ${
                    (index === 0 && ['qr', 'verify', 'success'].includes(step)) ||
                    (index === 1 && ['verify', 'success'].includes(step)) ||
                    (index === 2 && step === 'success')
                      ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6">
          {step === 'intro' && renderIntroStep()}
          {step === 'qr' && renderQRStep()}
          {step === 'verify' && renderVerifyStep()}
          {step === 'success' && renderSuccessStep()}
        </Card>

        {/* User Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Setting up 2FA for: <span className="font-medium">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;