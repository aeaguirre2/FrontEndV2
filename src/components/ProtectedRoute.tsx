import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UnauthorizedMessage from './UnauthorizedMessage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'VENDEDOR' | 'ANALISTA';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/api/banco-frontend/login',
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <UnauthorizedMessage 
        message={`Necesitas permisos de ${requiredRole} para acceder a esta página`}
        showLoginButton={false}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 