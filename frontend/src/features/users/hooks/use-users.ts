import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { toast } from 'sonner';
import { Role } from '@/enums';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) => 
      usersApi.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) => 
      usersApi.updateStatus(userId, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`User ${data.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  });
};
