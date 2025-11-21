import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Input, Alert } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    org: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  // Initialize form data with user info
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        org: user.org || '',
      });
    }
  }, [user]);

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      await updateProfile(formData);
      
      setNotification({
        message: 'Profile updated successfully!',
        type: 'success'
      });
    } catch (error: unknown) {
      setNotification({
        message: (error as Error).message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notification */}
      {notification && (
        <Alert 
          variant={notification.type === 'success' ? 'success' : 'error'}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600">Update your personal details</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <Input
              label="Email Address"
              type="email"
              value={user.email}
              disabled
              readOnly
              placeholder="Email address"
              helperText="Email cannot be changed. Contact support if you need to update your email."
            />

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Your first name"
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Your last name"
                required
              />
            </div>

            {/* Organization */}
            <Input
              label="Organization"
              type="text"
              name="org"
              value={formData.org}
              onChange={handleInputChange}
              placeholder="Your organization name"
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdating}
                disabled={isUpdating || isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
          <p className="text-sm text-gray-600">View your account details</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-sm text-gray-900 bg-blue-50 text-blue-800 px-2 py-1 rounded inline-block">
                {user.role}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <p className="text-sm text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          <p className="text-sm text-gray-600">Manage your account security and authentication</p>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Authentication & Password */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Authentication</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/change-password')}
              >
                🔑 Change Password
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/setup-2fa')}
              >
                🛡️ Setup 2FA
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/disable-2fa')}
              >
                🔓 Disable 2FA
              </Button>
            </div>
          </div>

          {/* Recovery & Backup */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Recovery & Backup</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/recovery-codes')}
              >
                📋 Recovery Codes
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/email-verification?method=otp_code')}
              >
                ✉️ Email Verification
              </Button>
            </div>
          </div>

          {/* Session Management */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Session Management</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/active-sessions')}
              >
                🖥️ Active Sessions
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/security-logs')}
              >
                📊 Security Audit Logs
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/device-management')}
              >
                📱 Device Management
              </Button>
            </div>
          </div>

          {/* Account Status */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">Account Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">Email Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-600">2FA Enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">Account Active</span>
              </div>
            </div>
            
            {/* Email verification notice for unverified emails */}
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-yellow-800">Email Verification</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    Need to verify your email or resend verification?
                  </p>
                  <Button
                    onClick={() => navigate('/verify-email-pending')}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    ✉️ Manage Email Verification
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Support & Help */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Need help with security settings or want to delete your account? Contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open('mailto:security@compliai.com?subject=Security Support Request', '_blank')}
              >
                🔐 Security Support
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open('mailto:support@compliai.com?subject=Account Deletion Request', '_blank')}
              >
                ⚠️ Delete Account
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;