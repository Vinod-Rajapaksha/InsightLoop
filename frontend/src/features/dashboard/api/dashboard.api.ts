import { apiClient } from '@/lib/api-client';

export interface DashboardFilters {
  weekStartDate?: string;
  weekEndDate?: string;
  memberId?: string;
  projectId?: string;
  status?: string;
}

export const dashboardApi = {
  getManagerDashboard: async (filters?: DashboardFilters): Promise<any> => {
    const { data } = await apiClient.get('/manager/dashboard', { params: filters });
    const resData = data?.data;
    return resData?.dashboard ?? resData ?? data;
  }
};
