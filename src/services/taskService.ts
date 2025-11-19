import api from './api';
import { Task, TaskFormData, UpdateTaskData, TasksResponse, TaskStatus } from '../types';
import { apiToFrontend } from '../utils/apiTransform';

interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get<any>(`/tasks?${params}`);
      // Transformar snake_case a camelCase
      return apiToFrontend<TasksResponse>(response.data);
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<any>(`/tasks/${id}`);
    // Transformar snake_case a camelCase
    return apiToFrontend<Task>(response.data);
  },

  async createTask(data: TaskFormData): Promise<Task> {
    // Validar campos requeridos
    if (!data.title || !data.title.trim()) {
      throw new Error('El título es requerido');
    }
    if (!data.projectId) {
      throw new Error('El proyecto es requerido');
    }
    if (!data.priority) {
      throw new Error('La prioridad es requerida');
    }

    // La API espera snake_case y tipos específicos
    // project_id debe ser integer (parseInt)
    // due_date debe ser date-time ISO string
    // assigned_to debe ser integer o null
    const payload: any = {
      title: data.title.trim(),
      project_id: parseInt(data.projectId as any, 10),
      priority: data.priority,
    };
    
    // Solo agregar campos opcionales si existen y no están vacíos
    if (data.description && data.description.trim()) {
      payload.description = data.description.trim();
    }
    if (data.dueDate && data.dueDate.trim()) {
      // Convertir fecha a formato ISO date-time
      const date = new Date(data.dueDate + 'T00:00:00');
      payload.due_date = date.toISOString();
    }
    if (data.assignedTo && data.assignedTo.trim()) {
      // assigned_to debe ser integer
      const assignedToId = parseInt(data.assignedTo.trim(), 10);
      if (!isNaN(assignedToId)) {
        payload.assigned_to = assignedToId;
      }
    }
    
    console.log('Enviando payload a la API:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await api.post<any>('/tasks', payload);
      // Transformar snake_case a camelCase
      return apiToFrontend<Task>(response.data);
    } catch (error: any) {
      console.error('Error en createTask:', error);
      console.error('Response data:', error.response?.data);
      console.error('Payload enviado:', payload);
      throw error;
    }
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    // Limpiar datos y convertir a snake_case
    const payload: any = {};
    
    if (data.title !== undefined && data.title !== null) {
      payload.title = data.title.trim();
    }
    if (data.description !== undefined && data.description !== null) {
      payload.description = data.description.trim();
    }
    if (data.status !== undefined && data.status !== null) {
      payload.status = data.status;
    }
    if (data.priority !== undefined && data.priority !== null) {
      payload.priority = data.priority;
    }
    if (data.dueDate !== undefined && data.dueDate !== null && data.dueDate.trim()) {
      const date = new Date(data.dueDate + 'T00:00:00');
      payload.due_date = date.toISOString();
    } else if (data.dueDate === null || data.dueDate === '') {
      payload.due_date = null;
    }
    if (data.assignedTo !== undefined && data.assignedTo !== null && data.assignedTo.trim()) {
      const assignedToId = parseInt(data.assignedTo.trim(), 10);
      if (!isNaN(assignedToId)) {
        payload.assigned_to = assignedToId;
      }
    } else if (data.assignedTo === null || data.assignedTo === '') {
      payload.assigned_to = null;
    }
    
    const response = await api.put<any>(`/tasks/${id}`, payload);
    // Transformar snake_case a camelCase
    return apiToFrontend<Task>(response.data);
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await api.patch<any>(`/tasks/${id}/status`, { status });
    // Transformar snake_case a camelCase
    return apiToFrontend<Task>(response.data);
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

