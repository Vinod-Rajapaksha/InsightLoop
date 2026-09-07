import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

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

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchPassword = form.watch('password') || '';

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = calculatePasswordStrength(watchPassword);

  const getStrengthColor = (index: number) => {
    if (index >= strengthScore) return 'bg-slate-200';
    if (strengthScore <= 1) return 'bg-red-500';
    if (strengthScore === 2) return 'bg-amber-500';
    if (strengthScore === 3) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: 'TEAM_MEMBER'
      });
      
      toast.success('Registration successful. Please log in.');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Registration failed due to invalid data.');
      } else {
        toast.error('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                    <Input placeholder="John" disabled={isLoading} className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                    <Input placeholder="Doe" disabled={isLoading} className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                  <Input placeholder="john.doe@example.com" type="email" disabled={isLoading} className="pl-10" {...field} />
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
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                    <Input 
                      placeholder="********"
                      type={showPassword ? 'text' : 'password'} 
                      disabled={isLoading} 
                      className="pl-10 pr-10" 
                      {...field} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 focus:outline-none transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {watchPassword.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="flex gap-1.5 h-1.5 w-full">
                        <div className={`flex-1 rounded-full transition-all duration-300 ${getStrengthColor(0)}`} />
                        <div className={`flex-1 rounded-full transition-all duration-300 ${getStrengthColor(1)}`} />
                        <div className={`flex-1 rounded-full transition-all duration-300 ${getStrengthColor(2)}`} />
                        <div className={`flex-1 rounded-full transition-all duration-300 ${getStrengthColor(3)}`} />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Strength: {strengthScore === 0 ? 'Weak' : strengthScore === 1 ? 'Fair' : strengthScore === 2 ? 'Good' : strengthScore === 3 ? 'Strong' : 'Very Strong'}
                      </p>
                    </div>
                  )}
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
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                  <Input 
                    placeholder="********"
                    type={showConfirmPassword ? 'text' : 'password'} 
                    disabled={isLoading} 
                    className="pl-10 pr-10" 
                    {...field} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 focus:outline-none transition-colors z-10"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-6 h-11 text-base shadow-lg shadow-indigo-500/25" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </Form>
  );
};
