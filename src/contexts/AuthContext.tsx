import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import type { AuthState, LoginRequest, Usuario } from '../types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (user: Omit<Usuario, 'id' | 'version'>) => Promise<void>;
  updateProfile: (user: Partial<Usuario>) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          
          // Obtener el usuario completo
          const user = await authService.getCurrentUser(response.email);
          
          // Guardar en localStorage
          authService.storeAuthData(user);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error en el login',
          });
          throw error;
        }
      },

      logout: () => {
        authService.clearAuthData();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      register: async (user: Omit<Usuario, 'id' | 'version'>) => {
        set({ isLoading: true, error: null });
        try {
          await authService.createUser(user);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error al registrar usuario',
          });
          throw error;
        }
      },

      updateProfile: async (user: Partial<Usuario>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(user);
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error al actualizar perfil',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          set({
            user: storedUser,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    isAdmin: () => store.user?.rol === 'ADMIN',
    isVendedor: () => store.user?.rol === 'VENDEDOR',
    hasRole: (role: 'ADMIN' | 'VENDEDOR') => store.user?.rol === role,
  };
}; 