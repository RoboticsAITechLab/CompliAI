import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

const VerifyEmailSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">CompliAI</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">AI-First Compliance OS</p>
        </div>
      </div>

      {/* Success Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:px-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <span className="text-3xl">✅</span>
                EMAIL VERIFIED SUCCESSFULLY
              </h2>
            </div>

            <div className="mb-8 space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                <span className="text-xl">🎉</span>
                Your email has been verified!
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                You can now log in and access your dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/login">
                <Button
                  variant="primary"
                  fullWidth
                  className="text-lg py-3"
                >
                  GO TO LOGIN
                </Button>
              </Link>
              
              <div className="text-center">
                <Link
                  to="/dashboard"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CompliAI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailSuccess;