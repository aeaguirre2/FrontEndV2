// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  rol: 'ADMIN' | 'VENDEDOR';
  vendedorId?: string;
  concesionarioId?: string;
  email: string;
}

export interface Usuario {
  id?: string;
  email: string;
  password?: string;
  rol: 'ADMIN' | 'VENDEDOR';
  vendedorId?: string;
  concesionarioId?: string;
  activo: boolean;
  version?: number;
}

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (user: Omit<Usuario, 'id' | 'version'>) => Promise<void>;
  updateProfile: (user: Partial<Usuario>) => Promise<void>;
  clearError: () => void;
} 