import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      console.log('Login attempt:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      console.log('Login successful');
      
      // TODO: Update auth store with user data
      // authStore.login(userData);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
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
          © 2024 CompliAI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;