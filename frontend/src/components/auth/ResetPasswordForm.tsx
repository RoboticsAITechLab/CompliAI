import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { isStrongPassword, validatePasswordMatch } from '../../utils/validation';

interface ResetPasswordFormProps {
  onResetPassword: (password: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onResetPassword,
  isLoading,
  disabled = false
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    submit?: string;
  }>({});
  const [showPasswords, setShowPasswords] = useState(false);

  /**
   * Get password strength for visual indicator
   */
  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^a-zA-Z0-9]/.test(password),
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const strength = {
      0: { label: '', color: 'bg-gray-200' },
      1: { label: 'Very Weak', color: 'bg-red-500' },
      2: { label: 'Weak', color: 'bg-orange-500' },
      3: { label: 'Fair', color: 'bg-yellow-500' },
      4: { label: 'Good', color: 'bg-blue-500' },
      5: { label: 'Strong', color: 'bg-green-500' },
    }[score] || { label: 'Very Weak', color: 'bg-red-500' };
    
    return { score, ...strength };
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (!isStrongPassword(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol';
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!validatePasswordMatch(newPassword, confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setErrors({});
    
    try {
      await onResetPassword(newPassword);
    } catch (err: unknown) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Failed to reset password. Please try again.'
      });
    }
  };

  /**
   * Handle password input change
   */
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (errors.newPassword) {
      setErrors(prev => ({ ...prev, newPassword: undefined }));
    }
  };

  /**
   * Handle confirm password change
   */
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* New Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          New Password:
        </label>
        <div className="relative">
          <Input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            error={errors.newPassword}
            placeholder="Enter your new password"
            disabled={disabled || isLoading}
            required
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            disabled={disabled || isLoading}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {showPasswords ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Password Strength Meter */}
        {newPassword && (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Strength:</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-4 rounded ${
                      i < passwordStrength.score ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength.score >= 4 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Confirm New Password:
        </label>
        <Input
          type={showPasswords ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          error={errors.confirmPassword}
          placeholder="Confirm your new password"
          disabled={disabled || isLoading}
          required
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={disabled || !newPassword || !confirmPassword || passwordStrength.score < 3}
        fullWidth
        className="text-lg py-3"
      >
        RESET PASSWORD
      </Button>
      
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        Password must be at least 8 characters with uppercase, lowercase, number, and symbol
      </div>
    </form>
  );
};

export default ResetPasswordForm;