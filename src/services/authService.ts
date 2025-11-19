import api from './api';
import { LoginFormData, RegisterFormData, LoginResponse, RegisterResponse, User } from '../types';

export const authService = {
  async register(data: RegisterFormData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginFormData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};

