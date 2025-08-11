import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  children?: SidebarItem[];
  roles?: ('ADMIN' | 'VENDEDOR')[];
}

const Sidebar: React.FC<{ isCollapsed: boolean; onToggle: () => void }> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Definir elementos del sidebar según el rol
  const getSidebarItems = (): SidebarItem[] => {
    const isAdmin = user?.rol === 'ADMIN';

    const baseItems: SidebarItem[] = [
      {
        label: 'Dashboard',
        href: isAdmin ? '/admin/dashboard' : ROUTES.DASHBOARD,
        icon: '📊',
      },
    ];

    if (isAdmin) {
      // Elementos solo para ADMIN
      return [
        ...baseItems,
        {
          label: 'Gestión de Usuarios',
          href: '/admin/users',
          icon: '👥',
          roles: ['ADMIN'],
        },
        {
          label: 'Concesionarios',
          href: ROUTES.CONCESIONARIOS,
          icon: '🏢',
          roles: ['ADMIN'],
        },
        {
          label: 'Vendedores',
          href: '/vendedores',
          icon: '👔',
          roles: ['ADMIN'],
        },
        {
          label: 'Vehículos',
          href: ROUTES.VEHICLES,
          icon: '🚗',
          roles: ['ADMIN'],
        },
        {
          label: 'Productos de Crédito',
          href: ROUTES.PRODUCTS,
          icon: '💳',
          roles: ['ADMIN'],
          children: [
            {
              label: 'Productos',
              href: ROUTES.PRODUCTS,
              icon: '📋',
              roles: ['ADMIN'],
            },
            {
              label: 'Tasas de Interés',
              href: ROUTES.PRODUCTS_INTEREST,
              icon: '📈',
              roles: ['ADMIN'],
            },
          ],
        },
        {
          label: 'Simulador',
          href: ROUTES.CREDIT_SIMULATION,
          icon: '🧮',
          roles: ['ADMIN'],
        },
        {
          label: 'Solicitudes',
          href: ROUTES.LOANS,
          icon: '📄',
          roles: ['ADMIN'],
        },
        {
          label: 'Análisis Crediticio',
          href: ROUTES.ANALYSIS,
          icon: '🔍',
          roles: ['ADMIN'],
        },
        {
          label: 'Contratos',
          href: ROUTES.CONTRACTS,
          icon: '📑',
          roles: ['ADMIN'],
        },
        {
          label: 'Documentación',
          href: '/documentation',
          icon: '📂',
          roles: ['ADMIN', 'VENDEDOR']
        },


      ];
    } else {
      // Elementos para VENDEDOR
      return [
        ...baseItems,
        {
          label: 'Vehículos',
          href: ROUTES.VEHICLES,
          icon: '🚗',
          roles: ['VENDEDOR'],
        },
        {
          label: 'Simulador',
          href: ROUTES.CREDIT_SIMULATION,
          icon: '🧮',
          roles: ['VENDEDOR'],
        },
        {
          label: 'Solicitudes',
          href: ROUTES.LOANS,
          icon: '📄',
          roles: ['VENDEDOR'],
        },
        {
          label: 'Análisis Crediticio',
          href: ROUTES.ANALYSIS,
          icon: '🔍',
          roles: ['VENDEDOR'],
        },
        {
          label: 'Contratos',
          href: ROUTES.CONTRACTS,
          icon: '📑',
          roles: ['VENDEDOR'],
        },

      ];
    }
  };

  const sidebarItems = getSidebarItems();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD || href === '/admin/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const SidebarItemComponent: React.FC<{ item: SidebarItem; level?: number }> = ({
    item,
    level = 0,
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const [isExpanded, setIsExpanded] = React.useState(active);

    React.useEffect(() => {
      if (active) {
        setIsExpanded(true);
      }
    }, [active]);

    const handleClick = () => {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      }
    };

    return (
      <div>
        <Link
          to={hasChildren ? '#' : item.href}
          onClick={handleClick}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            level > 0 && 'ml-4',
            active
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <span className="mr-3 text-lg">{item.icon}</span>
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {hasChildren && (
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </>
          )}
        </Link>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children!.map((child) => (
              <SidebarItemComponent key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">
            Sistema de Gestión
          </h2>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItemComponent key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Usuario: {user?.email}</p>
            <p>Rol: {user?.rol}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;