import { apiClient } from '@/lib/api-client';
import { User } from '@/types';
import { Role } from '@/enums';

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data.data;
  },

  updateRole: async (userId: string, role: Role): Promise<User> => {
    const response = await apiClient.patch(`/users/${userId}/role`, { role });
    return response.data.data;
  },

  updateStatus: async (userId: string, isActive: boolean): Promise<User> => {
    const response = await apiClient.patch(`/users/${userId}/status`, { isActive });
    return response.data.data;
  },
};
