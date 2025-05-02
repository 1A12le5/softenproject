import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Package, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await registerUser(data.name, data.email, data.password, data.phone);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Failed to register');
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
            <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="text-gray-600 mt-2">Join our community today</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              id="name"
              icon={<User size={18} />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
            
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
              label="Phone Number (Optional)"
              type="tel"
              id="phone"
              icon={<Phone size={18} />}
              error={errors.phone?.message}
              {...register('phone', {
                pattern: {
                  value: /^[0-9\+\-\(\)\s]+$/,
                  message: 'Please enter a valid phone number'
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
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;