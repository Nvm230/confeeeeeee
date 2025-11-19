import api from './api';
import { Project, ProjectFormData, ProjectsResponse } from '../types';

export const projectService = {
  async getProjects(page: number = 1, limit: number = 10, search: string = ''): Promise<ProjectsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const response = await api.get<ProjectsResponse>(`/projects?${params}`);
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

