import { apiClient } from '@/lib/api-client';
import { Project } from '@/types';

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const { data } = await apiClient.get('/projects');
    return data.data;
  },
  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.post('/projects', projectData);
    return data.data;
  },
  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.put(`/projects/${id}`, projectData);
    return data.data;
  },
  deleteProject: async (id: string): Promise<any> => {
    const { data } = await apiClient.delete(`/projects/${id}`);
    return data.data;
  }
};
