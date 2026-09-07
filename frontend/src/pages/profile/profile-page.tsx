import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/auth-provider';
import { usersApi } from '@/features/users/api/users.api';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, User, Shield, Calendar, Edit2, X, Save, Loader2, 
  Bell, Lock, KeyRound, Sparkles, 
  ShieldCheck, Check, CheckCircle2
} from 'lucide-react';
import { formatDate } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().optional().refine(val => !val || val.length >= 6, {
    message: 'Password must be at least 6 characters',
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Preferences State
  const [emailDigests, setEmailDigests] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [aiSummaries, setAiSummaries] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      password: '',
    },
  });

  const watchPassword = form.watch('password') || '';

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Not set', color: 'bg-muted' };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 50) return { score, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(watchPassword);

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: async () => {
      toast.success('Profile updated successfully');
      await refetchUser();
      setIsEditing(false);
      form.reset({ ...form.getValues(), password: '' });
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    }
  });

  if (!user) return null;

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <User className="w-7 h-7 text-primary" />
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal profile, account settings, and notification preferences.
          </p>
        </div>
      </div>

      {/* Hero Profile Cover Card */}
      <Card className="overflow-hidden border shadow-md">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Centered avatar + info layout */}
        <div className="flex flex-col items-center text-center px-6 pb-6 -mt-14 sm:-mt-16">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-700 text-white text-3xl sm:text-4xl font-bold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-3 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              {user.firstName} {user.lastName}
              <span title="Verified Account"><ShieldCheck className="w-5 h-5 text-primary" /></span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <Badge variant="secondary" className="capitalize px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-3 h-3 mr-1" />
              {user.role.replace('_', ' ')}
            </Badge>
            {user.isActive ? (
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-xs font-medium">
                Inactive
              </Badge>
            )}
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
              <Calendar className="w-3 h-3 mr-1" />
              Joined {formatDate(user.createdAt)}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="details" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="details" className="text-xs sm:text-sm">Profile Details</TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs sm:text-sm">Preferences</TabsTrigger>
          </TabsList>
          
          <Button 
            variant={isEditing ? "outline" : "default"} 
            onClick={() => {
              setIsEditing(!isEditing);
              form.reset({ firstName: user.firstName, lastName: user.lastName, password: '' });
            }}
            disabled={updateProfileMutation.isPending}
            className="shadow-xs transition-all"
          >
            {isEditing ? (
              <><X className="h-4 w-4 mr-2" /> Cancel Edit</>
            ) : (
              <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>
            )}
          </Button>
        </div>

        {/* Tab 1: Profile & Security Details */}
        <TabsContent value="details">
          <Card className="border shadow-xs">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Personal Information & Security
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Update your identity details and account password.
              </CardDescription>
            </CardHeader>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="p-4 rounded-xl border bg-muted/10 space-y-1">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> Full Name
                        </div>
                        <div className="text-base font-semibold text-foreground">{user.firstName} {user.lastName}</div>
                      </div>

                      <div className="p-4 rounded-xl border bg-muted/10 space-y-1">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" /> Email Address
                        </div>
                        <div className="text-base font-semibold text-foreground flex items-center gap-2">
                          {user.email}
                          <span title="Primary Email"><Lock className="w-3.5 h-3.5 text-muted-foreground/60" /></span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border bg-muted/10 space-y-1">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5" /> Account Role
                        </div>
                        <div className="text-base font-semibold capitalize text-foreground">{user.role.replace('_', ' ')}</div>
                      </div>

                      <div className="p-4 rounded-xl border bg-muted/10 space-y-1">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Joined Date
                        </div>
                        <div className="text-base font-semibold text-foreground">{formatDate(user.createdAt)}</div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <CardContent className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={updateProfileMutation.isPending} className="rounded-lg" />
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
                                <FormLabel className="text-xs font-medium">Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={updateProfileMutation.isPending} className="rounded-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="pt-4 border-t space-y-4">
                          <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                            <KeyRound className="w-4 h-4 text-primary" />
                            <span>Security & Password</span>
                          </div>

                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="max-w-md">
                                <FormLabel className="text-xs font-medium">New Password (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Leave blank to keep current password" 
                                    {...field} 
                                    disabled={updateProfileMutation.isPending} 
                                    className="rounded-lg"
                                  />
                                </FormControl>
                                {watchPassword.length > 0 && (
                                  <div className="space-y-1.5 mt-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="text-muted-foreground">Strength:</span>
                                      <span className="font-semibold text-foreground">{pwdStrength.label}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${pwdStrength.color} transition-all duration-300`} 
                                        style={{ width: `${pwdStrength.score}%` }} 
                                      />
                                    </div>
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/20 border-t py-3.5 px-6 flex justify-end gap-2.5">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          disabled={updateProfileMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updateProfileMutation.isPending}>
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save Changes
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </TabsContent>

        {/* Tab 3: Notification & Account Preferences */}
        <TabsContent value="preferences">
          <Card className="border shadow-xs">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Notification & Communication Preferences
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Control how and when InsightLoop notifies you.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-muted/10">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Email Weekly Reminder
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Receive automated reminders every Friday for weekly report submissions.
                  </div>
                </div>
                <Switch 
                  checked={emailDigests} 
                  onCheckedChange={setEmailDigests} 
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-muted/10">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approval & Review Alerts
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Get notified immediately when a manager approves or requests corrections on your report.
                  </div>
                </div>
                <Switch 
                  checked={approvalAlerts} 
                  onCheckedChange={setApprovalAlerts} 
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-muted/10">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> AI Insights Digest
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Receive weekly AI summaries of team achievements, blocker trends, and risk analysis.
                  </div>
                </div>
                <Switch 
                  checked={aiSummaries} 
                  onCheckedChange={setAiSummaries} 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t py-3.5 px-6 flex justify-end">
              <Button onClick={handleSavePreferences} className="gap-2">
                <Check className="w-4 h-4" /> Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

