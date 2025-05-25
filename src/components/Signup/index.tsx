/**
 *
 * Signup
 *
 */
import { memo } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, UserPlus } from 'lucide-react';
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

// Zod schema for signup form validation
const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'), // Consider adding .min(8, 'Password must be at least 8 characters') for security
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error will be associated with the confirmPassword field
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup = memo(() => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('');
      setLoading(true);
      await signup(data.email, data.password);
      // After successful signup, redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError('Failed to create an account. Please try again.');

      if (err instanceof Error) {
        console.error('Signup attempt failed:', err.message);
      } else if (typeof err === 'string') {
        console.error('Signup attempt failed with error:', err);
      } else {
        console.error('Signup attempt failed with an unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to start your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                          placeholder="you@example.com"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10 !my-input"
                          {...field}
                          aria-invalid={form.formState.errors.confirmPassword ? 'true' : 'false'}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full !my-btn"
                disabled={loading || !form.formState.isDirty || !form.formState.isValid}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
