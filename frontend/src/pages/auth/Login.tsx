import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { AUTH_ERROR_CODES } from '../../services/authService';
import { validateLoginForm, normalizeAuthData } from '../../utils/validation';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error, clearError, isAuthenticated, requires2FA } = useAuthStore();
  
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const successMessage = searchParams.get('message') || '';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    } else if (requires2FA) {
      navigate('/2fa-login', { replace: true });
    }
  }, [isAuthenticated, requires2FA, navigate, returnTo]);

  // Clear auth errors when component mounts or form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.email, formData.password, error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear field-specific errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const validationErrors = validateLoginForm(formData.email, formData.password);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Use normalized email for consistent backend processing
      const normalizedEmail = normalizeAuthData.email(formData.email);
      await login(normalizedEmail, formData.password, formData.rememberMe);
      
      // Navigation will be handled by useEffect when isAuthenticated changes
      
    } catch (error: unknown) {
      console.error('Login failed:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as { code: string; message: string };
        
        switch (authError.code) {
          case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
            setErrors({ general: 'Incorrect email or password.' });
            break;
          case AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED:
            setErrors({ general: 'Please verify your email address before logging in.' });
            break;
          case AUTH_ERROR_CODES.ACCOUNT_LOCKED:
            setErrors({ general: 'Your account has been temporarily locked. Please contact support.' });
            break;
          case AUTH_ERROR_CODES.TOO_MANY_ATTEMPTS:
            setErrors({ general: 'Too many login attempts. Please wait before trying again.' });
            break;
          default:
            setErrors({ general: authError.message || 'Login failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Login failed. Please check your connection and try again.' });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">CompliAI</h1>
          <p className="text-lg text-gray-600">AI-First Compliance OS</p>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Login</h2>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            {/* Remember Me & Error Display */}
            <div className="space-y-4">
              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              {/* Error Display */}
              {(errors.general || error) && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">
                    {errors.general || error}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Login
              </Button>
              
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/register')}
                disabled={isLoading}
              >
                Register
              </Button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </form>
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

export default Login;