import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

interface RecoveryStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const EmergencyRecovery: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    recoveryCode: '',
    newPassword: '',
    confirmPassword: '',
    securityQuestion: '',
    verificationCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const recoverySteps: RecoveryStep[] = [
    {
      id: 'verify-identity',
      title: 'Verify Identity',
      description: 'Confirm your email and backup contact information',
      completed: false
    },
    {
      id: 'security-verification',
      title: 'Security Verification',
      description: 'Provide additional verification details',
      completed: false
    },
    {
      id: 'reset-credentials',
      title: 'Reset Credentials',
      description: 'Set new password and security settings',
      completed: false
    },
    {
      id: 'confirm-recovery',
      title: 'Confirm Recovery',
      description: 'Complete the account recovery process',
      completed: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Mock API calls for each step
      switch (currentStep) {
        case 0: // Verify Identity
          if (!formData.email || !formData.phone) {
            throw new Error('Email and phone number are required');
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
          setMessage('Verification code sent to your backup email and phone');
          break;

        case 1: // Security Verification
          if (!formData.verificationCode || !formData.securityQuestion) {
            throw new Error('Verification code and security question answer are required');
          }
          await new Promise(resolve => setTimeout(resolve, 1500));
          setMessage('Security verification completed successfully');
          break;

        case 2: // Reset Credentials
          if (!formData.newPassword || formData.newPassword !== formData.confirmPassword) {
            throw new Error('Passwords do not match or are empty');
          }
          if (formData.newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters long');
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
          setMessage('New password set successfully');
          break;

        case 3: // Confirm Recovery
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessage('Account recovery completed! Redirecting to login...');
          setTimeout(() => {
            logout();
            navigate('/login?message=Account+recovered+successfully');
          }, 2000);
          break;
      }

      // Move to next step
      if (currentStep < recoverySteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setMessage('');
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSupport = () => {
    const subject = 'Emergency Account Recovery Assistance';
    const body = `
I need emergency assistance with account recovery.

Account Details:
- Email: ${formData.email}
- Current Step: ${recoverySteps[currentStep]?.title}
- Issue: Unable to complete recovery process
- Timestamp: ${new Date().toISOString()}
- Browser: ${navigator.userAgent}

Please assist with manual account recovery.
    `.trim();
    
    window.open(`mailto:emergency@compliai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0: // Verify Identity
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Please provide your account email and backup contact information to begin the recovery process.
            </p>
            <Input
              label="Account Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your account email"
              required
              autoFocus
            />
            <Input
              label="Backup Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your backup phone number"
              required
            />
          </div>
        );

      case 1: // Security Verification
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Enter the verification code sent to your backup contacts and answer your security question.
            </p>
            <Input
              label="Verification Code"
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              autoFocus
            />
            <Input
              label="What was the name of your first pet?"
              type="text"
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleInputChange}
              placeholder="Answer security question"
              required
            />
          </div>
        );

      case 2: // Reset Credentials
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Create a new secure password for your account.
            </p>
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              required
              autoFocus
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              required
            />
            <div className="text-xs text-gray-500">
              Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
            </div>
          </div>
        );

      case 3: // Confirm Recovery
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recovery Almost Complete</h3>
            <p className="text-gray-600">
              Your account recovery is ready to be finalized. Click the button below to complete the process.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-left">
              <h4 className="text-sm font-medium text-green-800 mb-2">What happens next:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Your account will be restored with the new password</li>
                <li>• All previous sessions will be terminated</li>
                <li>• 2FA settings will be reset (you'll need to set them up again)</li>
                <li>• You'll receive a confirmation email</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">CompliAI</h1>
          <p className="text-lg text-gray-600">Emergency Account Recovery</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex items-center justify-between px-4">
          {recoverySteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                ${index <= currentStep 
                  ? 'border-blue-600 bg-blue-600 text-white' 
                  : 'border-gray-300 bg-white text-gray-500'
                }
              `}>
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-xs text-center max-w-20">
                <div className={`font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </div>
              </div>
              {index < recoverySteps.length - 1 && (
                <div className={`
                  absolute w-full h-0.5 top-4 left-1/2 transform -translate-y-1/2 z-[-1]
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}
                `} style={{width: '100px', left: 'calc(50% + 20px)'}} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="space-y-6">
            {/* Current Step Info */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {recoverySteps[currentStep]?.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {recoverySteps[currentStep]?.description}
              </p>
            </div>

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

            {/* Step Form */}
            <form onSubmit={handleStepSubmit}>
              {getStepContent()}
              
              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  {currentStep === recoverySteps.length - 1 
                    ? 'Complete Recovery' 
                    : 'Continue'
                  }
                </Button>
              </div>
            </form>

            {/* Emergency Contact */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Need Help?</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      If you can't complete the recovery process, our emergency support team can assist.
                    </p>
                    <Button
                      onClick={handleContactSupport}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Contact Emergency Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                This emergency recovery process is logged for security purposes. 
                If you didn't request this recovery, please contact security immediately.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Recovery Session: ER-{Date.now().toString().slice(-8)} • {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default EmergencyRecovery;