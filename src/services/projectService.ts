import api from './api';
import { Project, ProjectFormData, ProjectsResponse } from '../types';
import { apiToFrontend } from '../utils/apiTransform';

export const projectService = {
  async getProjects(page: number = 1, limit: number = 10, search: string = ''): Promise<ProjectsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const response = await api.get<any>(`/projects?${params}`);
    // Transformar snake_case a camelCase
    return apiToFrontend<ProjectsResponse>(response.data);
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<any>(`/projects/${id}`);
    // Transformar snake_case a camelCase
    return apiToFrontend<Project>(response.data);
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    const response = await api.post<any>('/projects', data);
    // Transformar snake_case a camelCase
    return apiToFrontend<Project>(response.data);
  },

  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    const response = await api.put<any>(`/projects/${id}`, data);
    // Transformar snake_case a camelCase
    return apiToFrontend<Project>(response.data);
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

