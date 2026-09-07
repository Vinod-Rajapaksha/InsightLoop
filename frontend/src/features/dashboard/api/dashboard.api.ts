import { apiClient } from '@/lib/api-client';

export const dashboardApi = {
  getManagerDashboard: async (weekStartDate?: string): Promise<any> => {
    const params = weekStartDate ? { weekStartDate } : undefined;
    const { data } = await apiClient.get('/manager/dashboard', { params });
    return data.data;
  }
};
