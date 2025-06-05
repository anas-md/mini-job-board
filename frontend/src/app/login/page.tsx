'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { login, clearError } from '@/lib/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogIn, Mail, Lock, ArrowLeft, User, Briefcase } from 'lucide-react';
import { toast } from '@/lib/utils/toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const demoAccounts = {
  employer: {
    email: 'employer@example.com',
    password: 'password',
  },
  applicant: {
    email: 'applicant@example.com',
    password: 'password',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.quickSuccess('Welcome back!');
    } catch {
      // Error handled by useEffect above
    }
  };

  const prefillCredentials = (accountType: keyof typeof demoAccounts) => {
    const credentials = demoAccounts[accountType];
    setValue('email', credentials.email);
    setValue('password', credentials.password);
    toast.success(`Demo ${accountType} credentials filled!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 mb-4 font-bold tracking-wide transform hover:scale-105 transition-all duration-300">
            <ArrowLeft className="h-4 w-4 mr-2 text-pink-500" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text animate-pulse tracking-tight">
            Welcome back! 🎈
          </h1>
          <p className="text-lg font-semibold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text mt-3 tracking-wide">
            Sign in to your account to continue the fun!
          </p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-2xl dark:text-white">Sign In</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
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
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Demo Accounts</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Use these test accounts to explore the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Employer Account
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">employer@example.com / password</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => prefillCredentials('employer')}
                  disabled={isLoading}
                  className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                >
                  Use Demo
                </Button>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-300 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Applicant Account
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">applicant@example.com / password</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => prefillCredentials('applicant')}
                  disabled={isLoading}
                  className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-green-50 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                >
                  Use Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 