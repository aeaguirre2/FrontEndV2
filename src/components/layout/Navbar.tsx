import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalStore } from '../../contexts/GlobalContext';
import { getConcesionarioByVendedorEmail } from '../../services/concesionarioService';

interface NavbarProps {
  onSidebarToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { addToast } = useGlobalStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userConcesionario, setUserConcesionario] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener concesionario del vendedor
  useEffect(() => {
    const loadUserConcesionario = async () => {
      if (user?.rol === 'VENDEDOR' && user?.email) {
        try {
          const concesionario = await getConcesionarioByVendedorEmail(user.email);
          setUserConcesionario(concesionario);
        } catch (error) {
          console.error('Error al obtener concesionario del vendedor:', error);
        }
      }
    };

    loadUserConcesionario();
  }, [user]);

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/admin/dashboard':
        return 'Dashboard de Administrador';
      case '/admin/users':
        return 'Gestión de Usuarios';
      case '/vehicles':
        return 'Catálogo de Vehículos';
      case '/products':
        return 'Productos de Crédito';
      case '/products/interest':
        return 'Tasas de Interés';

      case '/loans':
        return 'Solicitudes de Préstamo';
      case '/analysis':
        return 'Análisis Crediticio';
      case '/contracts':
        return 'Contratos y Garantías';
      case '/concesionarios':
        return 'Concesionarios';
      case '/vendedores':
        return 'Vendedores';
      default:
        return 'Sistema de Préstamos Automotrices';
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Inicio', href: user?.rol === 'ADMIN' ? '/admin/dashboard' : '/dashboard' }
    ];

    if (segments.length > 0) {
      let currentPath = '';
              segments.forEach((segment: string) => {
          currentPath += `/${segment}`;
          let label = segment;
        
        // Mapear segmentos a labels más amigables
        switch (segment) {
          case 'admin':
            label = 'Administración';
            break;
          case 'users':
            label = 'Usuarios';
            break;
          case 'vehicles':
            label = 'Vehículos';
            break;
          case 'products':
            label = 'Productos';
            break;
          case 'interest':
            label = 'Tasas de Interés';
            break;

          case 'loans':
            label = 'Solicitudes';
            break;
          case 'analysis':
            label = 'Análisis';
            break;
          case 'contracts':
            label = 'Contratos';
            break;
          case 'concesionarios':
            label = 'Concesionarios';
            break;
          case 'vendedores':
            label = 'Vendedores';
            break;
          case 'dashboard':
            return; // No agregar dashboard ya que está en inicio
        }

        breadcrumbs.push({
          label: label.charAt(0).toUpperCase() + label.slice(1),
          href: currentPath,
        });
      });
    }

    return breadcrumbs;
  };

  const handleLogout = () => {
    logout();
    addToast({
      message: 'Sesión cerrada exitosamente',
      type: 'success',
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            
            {/* Breadcrumbs */}
            <nav className="flex space-x-1 text-sm text-gray-500 mt-1">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  {i > 0 && <span>/</span>}
                  <Link
                    to={crumb.href}
                    className={cn(
                      'hover:text-gray-700 transition-colors',
                      i === breadcrumbs.length - 1 && 'text-gray-900 font-medium'
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors relative">
            <span className="sr-only">Notificaciones</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17H4l5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">{user?.rol}</p>
                {user?.rol === 'VENDEDOR' && userConcesionario && (
                  <p className="text-xs text-blue-600 font-medium">{userConcesionario.razonSocial}</p>
                )}
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-gray-500">{user?.rol}</p>
                  {user?.rol === 'VENDEDOR' && userConcesionario && (
                    <p className="text-blue-600 font-medium text-xs mt-1">{userConcesionario.razonSocial}</p>
                  )}
                </div>
                
                {user?.rol === 'ADMIN' && (
                  <Link
                    to="/admin/users"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Gestión de Usuarios
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;