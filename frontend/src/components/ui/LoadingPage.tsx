import React from 'react';
import { Spinner } from './index';

export interface LoadingPageProps {
  message?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
  subtitle,
  size = 'lg',
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size={size} centered />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          {subtitle && (
            <p className="text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;