import { apiClient } from '@/lib/api-client';
import { Report, ReportVersion } from '@/types';

export const reportsApi = {
  getMyReports: async (): Promise<Report[]> => {
    const { data } = await apiClient.get('/reports/my');
    const result = data?.data ?? data;
    return Array.isArray(result) ? result : [];
  },
  
  getAllReports: async (filters?: any): Promise<Report[]> => {
    const { data } = await apiClient.get('/reports', { params: filters });
    const result = data?.data ?? data;
    return Array.isArray(result) ? result : [];
  },
  
  getReport: async (id: string): Promise<Report> => {
    const { data } = await apiClient.get(`/reports/${id}`);
    return data.data;
  },
  
  getReportVersions: async (id: string): Promise<ReportVersion[]> => {
    const { data } = await apiClient.get(`/reports/${id}/versions`);
    return data.data;
  },
  
  createReport: async (reportData: any): Promise<Report> => {
    const { data } = await apiClient.post('/reports', reportData);
    return data.data;
  },
  
  updateReport: async (id: string, reportData: any): Promise<Report> => {
    const { data } = await apiClient.put(`/reports/${id}`, reportData);
    return data.data;
  },
  
  submitReport: async (id: string): Promise<Report> => {
    const { data } = await apiClient.post(`/reports/${id}/submit`);
    return data.data;
  },
  
  approveReport: async (id: string): Promise<Report> => {
    const { data } = await apiClient.post(`/reports/${id}/approve`);
    return data.data;
  },
  
  requestChanges: async (id: string, comments: string): Promise<Report> => {
    const { data } = await apiClient.post(`/reports/${id}/request-correction`, { comments });
    return data.data;
  }
};
