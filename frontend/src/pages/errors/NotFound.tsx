import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/ui';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-12 px-6 text-center">
          <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;