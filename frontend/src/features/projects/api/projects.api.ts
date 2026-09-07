import { apiClient } from '@/lib/api-client';
import { Project } from '@/types';

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const { data } = await apiClient.get('/projects');
    const resData = data?.data;
    if (Array.isArray(resData?.projects)) return resData.projects;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(data)) return data;
    return [];
  },
  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.post('/projects', projectData);
    return data?.data?.project ?? data?.data ?? data;
  },
  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.put(`/projects/${id}`, projectData);
    return data?.data?.project ?? data?.data ?? data;
  },
  deleteProject: async (id: string): Promise<any> => {
    const { data } = await apiClient.delete(`/projects/${id}`);
    return data?.data;
  }
};
