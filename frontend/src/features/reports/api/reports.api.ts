import { apiClient } from '@/lib/api-client';
import { Report, ReportVersion } from '@/types';

export const reportsApi = {
  getMyReports: async (): Promise<Report[]> => {
    const { data } = await apiClient.get('/reports/my');
    const resData = data?.data;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.reports)) return resData.reports;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(data)) return data;
    return [];
  },
  
  getAllReports: async (filters?: any): Promise<Report[]> => {
    const { data } = await apiClient.get('/reports', { params: filters });
    const resData = data?.data;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.reports)) return resData.reports;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(data)) return data;
    return [];
  },
  
  getReport: async (id: string): Promise<Report> => {
    const { data } = await apiClient.get(`/reports/${id}`);
    return data?.data?.report ?? data?.data ?? data;
  },
  
  getReportVersions: async (id: string): Promise<ReportVersion[]> => {
    const { data } = await apiClient.get(`/reports/${id}/versions`);
    const resData = data?.data;
    if (Array.isArray(resData?.versions)) return resData.versions;
    if (Array.isArray(resData)) return resData;
    return [];
  },
  
  createReport: async (reportData: any): Promise<Report> => {
    const { data } = await apiClient.post('/reports', reportData);
    return data?.data?.report ?? data?.data ?? data;
  },
  
  updateReport: async (id: string, reportData: any): Promise<Report> => {
    const { data } = await apiClient.put(`/reports/${id}`, reportData);
    return data?.data?.report ?? data?.data ?? data;
  },
  
  submitReport: async (id: string): Promise<Report> => {
    const { data } = await apiClient.post(`/reports/${id}/submit`);
    return data?.data?.report ?? data?.data ?? data;
  },
  
  approveReport: async (id: string): Promise<Report> => {
    const { data } = await apiClient.post(`/reports/${id}/approve`);
    return data?.data?.report ?? data?.data ?? data;
  },
  
  requestChanges: async (id: string, comments: string): Promise<Report> => {
    const { data } = await apiClient.post(`/reports/${id}/request-correction`, { comments });
    return data?.data?.report ?? data?.data ?? data;
  }
};
