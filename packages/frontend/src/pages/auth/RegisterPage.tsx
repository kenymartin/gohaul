import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CUSTOMER', 'COMPANY', 'TRANSPORTER']),
  companyName: z.string().optional(),
}).refine((data) => {
  // For COMPANY role, companyName is required
  if (data.role === 'COMPANY' && !data.companyName) {
    return false;
  }
  return true;
}, {
  message: "Company name is required for company accounts",
  path: ["companyName"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#FF9900] hover:text-[#E88A00]"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md bg-white p-6 shadow-sm">
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  {...register('role')}
                >
                  <option value="CUSTOMER">Individual Customer</option>
                  <option value="COMPANY">Business/Company</option>
                  <option value="TRANSPORTER">Transporter/Driver</option>
                </select>
              </div>

              {watchedRole === 'COMPANY' && (
                <Input
                  label="Company Name"
                  type="text"
                  autoComplete="organization"
                  error={errors.companyName?.message}
                  {...register('companyName')}
                  placeholder="Enter your company name"
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 