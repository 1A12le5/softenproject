import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import Button from '../components/shared/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full h-24 w-24 bg-gray-100 flex items-center justify-center">
              <Search size={48} className="text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">404</h2>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Page Not Found</h3>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Button
              variant="outline"
              icon={<Home size={18} />}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;