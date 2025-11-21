import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';
import { authService, AUTH_ERROR_CODES } from '../../services/authService';
import { validateRegisterForm, normalizeAuthData, type RegisterValidationErrors } from '../../utils/validation';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const validationErrors = validateRegisterForm(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.organization
    );
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const registerData = {
        email: normalizeAuthData.email(formData.email),
        password: formData.password,
        firstName: normalizeAuthData.name(formData.firstName),
        lastName: normalizeAuthData.name(formData.lastName),
        org: normalizeAuthData.org(formData.organization)
      };

      await authService.register(registerData);
      
      // Registration successful - redirect to email verification pending page
      navigate(`/email-verification?email=${encodeURIComponent(registerData.email)}&method=email_link`);
      
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as { code: string; message: string };
        
        switch (authError.code) {
          case AUTH_ERROR_CODES.CONFLICT:
            setErrors({ email: 'An account with this email already exists. Please sign in instead.' });
            break;
          case AUTH_ERROR_CODES.VALIDATION_ERROR:
            setErrors({ submit: authError.message });
            break;
          case AUTH_ERROR_CODES.TOO_MANY_REQUESTS:
            setErrors({ submit: 'Too many registration attempts. Please wait a moment before trying again.' });
            break;
          default:
            setErrors({ submit: authError.message || 'Registration failed. Please try again.' });
        }
      } else {
        setErrors({ submit: 'Registration failed. Please check your connection and try again.' });
      }
    } finally {
      setIsLoading(false);
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

      {/* Register Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="John"
                autoComplete="given-name"
                required
              />
              
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Doe"
                autoComplete="family-name"
                required
              />
            </div>

            {/* Organization Field */}
            <Input
              label="Organization"
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              error={errors.organization}
              placeholder="Your Company Name"
              autoComplete="organization"
              required
            />

            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="john@company.com"
              autoComplete="email"
              required
            />

            {/* Password Fields */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />

            {/* General Error Display */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errors.submit}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Create Account
              </Button>
              
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/login')}
                disabled={isLoading}
              >
                Back to Login
              </Button>
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

export default Register;