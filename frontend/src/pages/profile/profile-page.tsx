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
import { Mail, User, Shield, Calendar, Edit2, X, Save, Loader2 } from 'lucide-react';
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      password: '',
    },
  });

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

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account details and security.</p>
        </div>
        <Button 
          variant={isEditing ? "outline" : "default"} 
          onClick={() => {
            setIsEditing(!isEditing);
            form.reset({ firstName: user.firstName, lastName: user.lastName, password: '' });
          }}
          disabled={updateProfileMutation.isPending}
        >
          {isEditing ? (
            <><X className="h-4 w-4 mr-2" /> Cancel</>
          ) : (
            <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>
          )}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-lg shadow-slate-200/40">
        <CardHeader className="pb-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-medium">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize px-3 py-1 text-xs font-medium">
                  {user.role.replace('_', ' ')}
                </Badge>
                {user.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">Inactive</Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-8 pb-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email Address
                    </div>
                    <div className="text-lg font-medium text-slate-900">{user.email}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </div>
                    <div className="text-lg font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Account Role
                    </div>
                    <div className="text-lg font-medium capitalize text-slate-900">{user.role.replace('_', ' ')}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Member Since
                    </div>
                    <div className="text-lg font-medium text-slate-900">{formatDate(user.createdAt)}</div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="pt-8 pb-8 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={updateProfileMutation.isPending} />
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
                              <Input {...field} disabled={updateProfileMutation.isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium text-sm mb-4 text-slate-500">Security</h3>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="max-w-md">
                            <FormLabel>New Password (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Leave blank to keep current password" 
                                {...field} 
                                disabled={updateProfileMutation.isPending} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t py-4 px-6 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
