import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components/ui';
import OtpInput from '../../components/auth/OtpInput';
import { useAuthStore } from '../../store/authStore';

const Disable2FA: React.FC = () => {
  const [step, setStep] = useState<'confirm' | 'verify' | 'success'>('confirm');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleConfirmDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required to disable 2FA');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate password verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, verify password first
      // await authService.verifyPassword(password);
      
      setStep('verify');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndDisable = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, call authService.disable2FA()
      // await authService.disable2FA(otpCode);
      
      setStep('success');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/profile');
  };

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Disable Two-Factor Authentication</h2>
        <p className="mt-2 text-gray-600">
          You're about to disable 2FA protection on your account
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Security Warning</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Disabling 2FA reduces your account security</li>
                <li>Your account will only be protected by your password</li>
                <li>We strongly recommend keeping 2FA enabled</li>
                <li>You can re-enable 2FA anytime in your profile settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirmDisable} className="space-y-4">
        <Input
          label="Confirm Your Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your current password"
          error={error}
          required
        />

        <div className="space-y-3">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!password}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Proceed to Disable 2FA
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => navigate('/profile')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Final Verification</h2>
        <p className="mt-2 text-gray-600">
          Enter the code from your authenticator app to disable 2FA
        </p>
      </div>

      <div className="py-4">
        <OtpInput
          value={otpCode}
          onChange={setOtpCode}
          disabled={isLoading}
          error={error}
        />
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleVerifyAndDisable}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!otpCode || otpCode.length !== 6}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          Disable 2FA Now
        </Button>
        <Button
          onClick={() => setStep('confirm')}
          variant="outline"
          fullWidth
          disabled={isLoading}
        >
          Back
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
        <h2 className="text-2xl font-bold text-gray-900">2FA Disabled</h2>
        <p className="mt-2 text-gray-600">
          Two-factor authentication has been successfully disabled
        </p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex">
          <svg className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800">Security Notice</h3>
            <p className="mt-1 text-sm text-orange-700">
              Your account is now only protected by your password. Consider setting up 2FA again 
              to improve your account security.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={handleFinish} variant="primary" fullWidth>
          Return to Profile
        </Button>
        <Button onClick={() => navigate('/setup-2fa')} variant="outline" fullWidth>
          Re-enable 2FA
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
            {['Confirm', 'Verify', 'Complete'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index === 0 && step === 'confirm' ? 'bg-yellow-600 text-white' :
                    index === 1 && step === 'verify' ? 'bg-blue-600 text-white' :
                    index === 2 && step === 'success' ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-8 h-0.5 ${
                    (index === 0 && ['verify', 'success'].includes(step)) ||
                    (index === 1 && step === 'success')
                      ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6">
          {step === 'confirm' && renderConfirmStep()}
          {step === 'verify' && renderVerifyStep()}
          {step === 'success' && renderSuccessStep()}
        </Card>

        {/* User Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Disabling 2FA for: <span className="font-medium">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Disable2FA;