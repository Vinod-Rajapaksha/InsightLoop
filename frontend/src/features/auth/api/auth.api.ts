import { apiClient } from '@/lib/api-client';
import { User } from '@/types';

export const authApi = {
  login: async (data: any): Promise<any> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: any): Promise<any> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  }
};
