/**
 *
 * Login
 *
 */
import { memo } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = memo(() => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);
      // Redirect to the page they tried to visit or dashboard
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError('Failed to sign in. Please check your credentials and try again.');
      if (err instanceof Error) {
        console.error('Login attempt failed:', err.message);
      } else if (typeof err === 'string') {
        console.error('Login attempt failed:', err);
      } else {
        console.error('Login attempt failed with an unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full mb-4"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 !my-input"
                          {...field}
                          aria-invalid={form.formState.errors.email ? 'true' : 'false'}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 !my-input"
                          {...field}
                          aria-invalid={form.formState.errors.password ? 'true' : 'false'}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !my-btn" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
          <p className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
