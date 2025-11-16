import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.organization) newErrors.organization = 'Organization is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual auth service call
      console.log('Registration attempt:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      console.log('Registration successful');
      
      // Redirect to login with success message
      navigate('/login');
      
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ email: 'Registration failed. Please try again.' });
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
          © 2024 CompliAI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;