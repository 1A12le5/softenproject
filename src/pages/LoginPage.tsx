import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Package, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(data.email, 'password'); // In this demo, password is not checked
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              id="email"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email'
                }
              })}
            />
            
            <Input
              label="Password"
              type="password"
              id="password"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required'
              })}
            />
            
            <div>
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="text-center text-sm text-gray-500">
              <p>
                Demo accounts: 
              </p>
              <p className="font-medium mt-1">
                User: jane@example.com<br />
                Admin: admin@example.com
              </p>
              <p className="text-xs mt-2">
                (Password field is ignored in this demo)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;