import axios from 'axios';
import type { LoginRequest, LoginResponse, Usuario } from '../types/auth';
import { MICROSERVICES } from '../constants';

class AuthService {
  private readonly BASE_URL = `${MICROSERVICES.CONCESIONARIOS}/api/concesionarios/v1/auth`;

  private client = axios.create({
    baseURL: this.BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Configurar interceptor para agregar headers de autenticación
  constructor() {
    console.log('🔧 AuthService - BASE_URL:', this.BASE_URL);
    
    this.client.interceptors.request.use(
      (config) => {
        console.log('🔧 AuthService - Request URL:', config.url || 'undefined');
        console.log('🔧 AuthService - Full URL:', (config.baseURL || '') + (config.url || ''));
        
        // Add user email header if available
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.email) {
              config.headers['X-User-Email'] = user.email;
            }
          } catch (error) {
            console.error('Error parsing user from localStorage:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.client.post<LoginResponse>('/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Error en el login. Verifica tus credenciales.');
    }
  }

  async getCurrentUser(email: string): Promise<Usuario> {
    try {
      const response = await this.client.get<Usuario>(`/usuarios/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el perfil del usuario.');
    }
  }

  async getAllUsers(): Promise<Usuario[]> {
    try {
      console.log('🔧 AuthService - getAllUsers() called');
      const response = await this.client.get<Usuario[]>('/usuarios');
      return response.data;
    } catch (error) {
      console.error('🔧 AuthService - getAllUsers() error:', error);
      throw new Error('Error al obtener la lista de usuarios.');
    }
  }

  async createUser(user: Omit<Usuario, 'id' | 'version'>): Promise<Usuario> {
    try {
      const response = await this.client.post<Usuario>('/usuarios', user);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear el usuario.');
    }
  }

  async updateUser(id: string, user: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await this.client.put<Usuario>(`/usuarios/${id}`, user);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar el usuario.');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.client.delete(`/usuarios/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar el usuario.');
    }
  }

  async updateProfile(user: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await this.client.put<Usuario>(`/usuarios/${user.id}`, user);
      return response.data;
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
    localStorage.setItem('userEmail', user.email); // Guardar email del usuario
    if (token) {
      localStorage.setItem('authToken', token);
    }
  }

  // Método para limpiar datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem('userEmail'); // Limpiar email del usuario
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();
export default authService; 