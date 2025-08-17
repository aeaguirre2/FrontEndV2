import apiService from './api';
import type { LoginRequest, LoginResponse, Usuario } from '../types/auth';
import { API_CONFIG } from '../constants';

class AuthService {
  private readonly BASE_URL = `/api/concesionarios/${API_CONFIG.VERSION}/auth`;

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(`${this.BASE_URL}/login`, credentials);
      return response;
    } catch (error) {
      throw new Error('Error en el login. Verifica tus credenciales.');
    }
  }

  async getCurrentUser(email: string): Promise<Usuario> {
    try {
      const response = await apiService.get<Usuario>(`${this.BASE_URL}/usuarios/email/${email}`);
      return response;
    } catch (error) {
      throw new Error('Error al obtener el perfil del usuario.');
    }
  }

  async getAllUsers(): Promise<Usuario[]> {
    try {
      const response = await apiService.get<Usuario[]>(`${this.BASE_URL}/usuarios`);
      return response;
    } catch (error) {
      throw new Error('Error al obtener la lista de usuarios.');
    }
  }

  async createUser(user: Omit<Usuario, 'id' | 'version'>): Promise<Usuario> {
    try {
      const response = await apiService.post<Usuario>(`${this.BASE_URL}/usuarios`, user);
      return response;
    } catch (error) {
      throw new Error('Error al crear el usuario.');
    }
  }

  async updateUser(id: string, user: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await apiService.put<Usuario>(`${this.BASE_URL}/usuarios/${id}`, user);
      return response;
    } catch (error) {
      throw new Error('Error al actualizar el usuario.');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.BASE_URL}/usuarios/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar el usuario.');
    }
  }

  async updateProfile(user: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await apiService.put<Usuario>(`${this.BASE_URL}/usuarios/${user.id}`, user);
      return response;
    } catch (error) {
      throw new Error('Error al actualizar el perfil.');
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Método para obtener el usuario del localStorage
  getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  // Método para guardar datos de autenticación
  storeAuthData(user: Usuario, token?: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('authToken', token);
    }
  }

  // Método para limpiar datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();
export default authService; 