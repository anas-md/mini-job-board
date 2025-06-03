'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { register as registerUser, clearError } from '@/lib/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserPlus, Mail, Lock, User, ArrowLeft, Briefcase, Users } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  role: z.enum(['employer', 'applicant'], {
    required_error: 'Please select your role',
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'employer' ? '/dashboard/employer' : '/dashboard/applicant';
      router.push(redirectPath);
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Account created successfully! Welcome aboard!');
    } catch (err) {
      // Error handled by useEffect above
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Join Mini Job Board</h1>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Choose your role and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  I want to join as a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative">
                    <input
                      {...register('role')}
                      type="radio"
                      value="employer"
                      className="peer sr-only"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-50 hover:border-gray-300">
                      <Briefcase className="h-6 w-6 text-gray-600 peer-checked:text-indigo-600 mb-2" />
                      <span className="text-sm font-medium">Employer</span>
                      <span className="text-xs text-gray-500 text-center">Post jobs & hire talent</span>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      {...register('role')}
                      type="radio"
                      value="applicant"
                      className="peer sr-only"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-50 hover:border-gray-300">
                      <Users className="h-6 w-6 text-gray-600 peer-checked:text-indigo-600 mb-2" />
                      <span className="text-sm font-medium">Job Seeker</span>
                      <span className="text-xs text-gray-500 text-center">Find & apply for jobs</span>
                    </div>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('name')}
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('password_confirmation')}
                    id="password_confirmation"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits by Role */}
        {selectedRole && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedRole === 'employer' ? 'Employer Benefits' : 'Job Seeker Benefits'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRole === 'employer' ? (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Post unlimited job listings</li>
                  <li>• Access to qualified candidates</li>
                  <li>• Application management dashboard</li>
                  <li>• Company profile customization</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Browse thousands of job opportunities</li>
                  <li>• Easy one-click applications</li>
                  <li>• Track your application status</li>
                  <li>• Personalized job recommendations</li>
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 