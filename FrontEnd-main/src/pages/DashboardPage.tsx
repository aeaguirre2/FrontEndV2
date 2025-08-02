import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalVehicles: number;
  totalUsers: number;
  totalContracts: number;
  portfolioValue: number;
  monthlyDisbursements: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalVehicles: 0,
    totalUsers: 0,
    totalContracts: 0,
    portfolioValue: 0,
    monthlyDisbursements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API calls to microservices
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalApplications: 245,
          pendingApplications: 28,
          approvedApplications: 187,
          totalVehicles: 1420,
          totalUsers: 890,
          totalContracts: 156,
          portfolioValue: 8750000,
          monthlyDisbursements: 1250000,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, link }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    link?: string;
  }) => {
    const content = (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido al Sistema de Préstamos Automotrices!</h1>
        <p className="text-blue-100">
          Gestiona solicitudes, análisis crediticio y contratos desde un solo lugar.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Solicitudes Totales"
          value={stats.totalApplications.toLocaleString()}
          icon="📄"
          color="bg-blue-100 text-blue-600"
          link="/loans"
        />
        <StatCard
          title="Pendientes de Revisión"
          value={stats.pendingApplications.toLocaleString()}
          icon="⏱️"
          color="bg-yellow-100 text-yellow-600"
          link="/loans"
        />
        <StatCard
          title="Aprobadas"
          value={stats.approvedApplications.toLocaleString()}
          icon="✅"
          color="bg-green-100 text-green-600"
          link="/contracts"
        />
        <StatCard
          title="Vehículos Disponibles"
          value={stats.totalVehicles.toLocaleString()}
          icon="🚗"
          color="bg-purple-100 text-purple-600"
          link="/vehicles"
        />
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Valor de Cartera"
          value={formatCurrency(stats.portfolioValue)}
          icon="💰"
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Desembolsos del Mes"
          value={formatCurrency(stats.monthlyDisbursements)}
          icon="📈"
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Contratos Activos"
          value={stats.totalContracts.toLocaleString()}
          icon="📑"
          color="bg-pink-100 text-pink-600"
          link="/contracts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📄</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Nueva solicitud de préstamo</p>
                  <p className="text-xs text-gray-500">Juan Pérez - Toyota Corolla 2024</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">2 min</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✅</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Análisis crediticio aprobado</p>
                  <p className="text-xs text-gray-500">María González - Hyundai Tucson</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">15 min</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📑</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Contrato firmado</p>
                  <p className="text-xs text-gray-500">Carlos Rodríguez - Nissan Sentra</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">1 hora</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/credit-simulation"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🧮</div>
              <div className="text-sm font-medium text-gray-700">Simular Crédito</div>
            </Link>
            
            <Link
              to="/loans"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm font-medium text-gray-700">Nueva Solicitud</div>
            </Link>
            
            <Link
              to="/vehicles"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🚗</div>
              <div className="text-sm font-medium text-gray-700">Ver Vehículos</div>
            </Link>
            
            <Link
              to="/analysis"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm font-medium text-gray-700">Análisis Crediticio</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas y Notificaciones</h3>
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  3 solicitudes requieren análisis crediticio
                </p>
                <p className="text-xs text-yellow-600">
                  Pendientes por más de 24 horas
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-blue-600 mr-3">📋</span>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  5 contratos vencen esta semana
                </p>
                <p className="text-xs text-blue-600">
                  Revisar y procesar renovaciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;