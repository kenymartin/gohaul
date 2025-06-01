import { api } from '../lib/api';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<{ status: string; data: { user: User; token: string } }>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await api.post<{ status: string; data: { user: User; token: string } }>(
      '/auth/register',
      credentials
    );
    return response.data.data;
  },

  async getCurrentUser() {
    const response = await api.get<{ status: string; data: User }>('/auth/me');
    return response.data.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
}; 