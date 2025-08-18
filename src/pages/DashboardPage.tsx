import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalStore } from '../contexts/GlobalContext';
import concesionarioService from '../services/concesionarioService';
import { getConcesionarioByVendedorEmail, getVehiculosByRuc } from '../services/concesionarioService';
import { prestamoService } from '../services/prestamoService';
import originacionService from '../services/originacionService';

interface DashboardStats {
  totalConcesionarios: number;
  totalVendedores: number;
  totalVehiculos: number;
  totalSolicitudes: number;
  solicitudesPendientes: number;
  solicitudesAprobadas: number;
  solicitudesRechazadas: number;
  valorCartera: number;
  desembolsosMes: number;
  // Estadísticas específicas para analistas
  documentosPendientes: number;
  documentosValidados: number;
  contratosPendientes: number;
  contratosValidados: number;
}

interface RecentActivity {
  id: string;
  type: 'solicitud' | 'aprobacion' | 'rechazo' | 'contrato' | 'documento' | 'validacion';
  message: string;
  details: string;
  timestamp: string;
  icon: string;
  color: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useGlobalStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalConcesionarios: 0,
    totalVendedores: 0,
    totalVehiculos: 0,
    totalSolicitudes: 0,
    solicitudesPendientes: 0,
    solicitudesAprobadas: 0,
    solicitudesRechazadas: 0,
    valorCartera: 0,
    desembolsosMes: 0,
    documentosPendientes: 0,
    documentosValidados: 0,
    contratosPendientes: 0,
    contratosValidados: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos según el rol del usuario
      if (user?.rol === 'ADMIN') {
        await fetchAdminData();
      } else if (user?.rol === 'ANALISTA') {
        await fetchAnalistaData();
      } else {
        await fetchVendedorData();
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      addToast({
        message: 'Error al cargar los datos del dashboard',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Obtener concesionarios
      const concesionarios = await concesionarioService.getAllConcesionarios();
      
      // Obtener vendedores
      const vendedores = await concesionarioService.getAllVendedores();
      
      // Obtener vehículos
      const vehiculos = await concesionarioService.getAllVehiculos();
      
      // Obtener solicitudes (simulado por ahora)
      const solicitudesData = await fetchSolicitudesData();
      
      setStats({
        totalConcesionarios: concesionarios.length,
        totalVendedores: vendedores.length,
        totalVehiculos: vehiculos.length,
        totalSolicitudes: solicitudesData.total,
        solicitudesPendientes: solicitudesData.pendientes,
        solicitudesAprobadas: solicitudesData.aprobadas,
        solicitudesRechazadas: solicitudesData.rechazadas,
        valorCartera: solicitudesData.valorCartera,
        desembolsosMes: solicitudesData.desembolsosMes,
        documentosPendientes: 0,
        documentosValidados: 0,
        contratosPendientes: 0,
        contratosValidados: 0,
      });

      // Generar actividad reciente
      generateRecentActivity();
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      throw error;
    }
  };

  const fetchAnalistaData = async () => {
    try {
      // Para analistas, enfocarse en documentación y validaciones
      const solicitudesData = await fetchSolicitudesData();
      
      // Simular datos de documentación pendiente (en un caso real, esto vendría de un servicio específico)
      const documentosPendientes = Math.floor(Math.random() * 15) + 5; // 5-20 documentos
      const documentosValidados = Math.floor(Math.random() * 50) + 20; // 20-70 documentos
      const contratosPendientes = Math.floor(Math.random() * 8) + 2; // 2-10 contratos
      const contratosValidados = Math.floor(Math.random() * 30) + 10; // 10-40 contratos
      
      setStats({
        totalConcesionarios: 0, // No relevante para analistas
        totalVendedores: 0, // No relevante para analistas
        totalVehiculos: 0, // No relevante para analistas
        totalSolicitudes: solicitudesData.total,
        solicitudesPendientes: solicitudesData.pendientes,
        solicitudesAprobadas: solicitudesData.aprobadas,
        solicitudesRechazadas: solicitudesData.rechazadas,
        valorCartera: solicitudesData.valorCartera,
        desembolsosMes: solicitudesData.desembolsosMes,
        documentosPendientes,
        documentosValidados,
        contratosPendientes,
        contratosValidados,
      });

      // Generar actividad reciente específica para analistas
      generateAnalistaRecentActivity();
      
    } catch (error) {
      console.error('Error fetching analista data:', error);
      throw error;
    }
  };

  const fetchVendedorData = async () => {
    try {
      // Para vendedores, mostrar datos específicos de su concesionario
      const solicitudesData = await fetchSolicitudesData();
      
      setStats({
        totalConcesionarios: 1, // Solo su concesionario
        totalVendedores: 1, // Solo él
        totalVehiculos: 0, // Se cargará después
        totalSolicitudes: solicitudesData.total,
        solicitudesPendientes: solicitudesData.pendientes,
        solicitudesAprobadas: solicitudesData.aprobadas,
        solicitudesRechazadas: solicitudesData.rechazadas,
        valorCartera: solicitudesData.valorCartera,
        desembolsosMes: solicitudesData.desembolsosMes,
        documentosPendientes: 0,
        documentosValidados: 0,
        contratosPendientes: 0,
        contratosValidados: 0,
      });

      // Cargar vehículos del concesionario del vendedor
      if (user?.email) {
        try {
          const concesionario = await getConcesionarioByVendedorEmail(user.email);
          const vehiculos = await getVehiculosByRuc(concesionario.ruc);
          setStats(prev => ({ ...prev, totalVehiculos: vehiculos.length }));
        } catch (error) {
          console.error('Error fetching vendedor vehicles:', error);
        }
      }

      generateRecentActivity();
      
    } catch (error) {
      console.error('Error fetching vendedor data:', error);
      throw error;
    }
  };

  const fetchSolicitudesData = async () => {
    try {
      // Obtener solicitudes de los últimos 30 días
      const fechaFin = new Date().toISOString().slice(0, 10);
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      
      const response = await originacionService.fetchSolicitudesPorFechas(
        `${fechaInicio}T00:00:00`,
        `${fechaFin}T23:59:59`
      );
      
      const solicitudes = response.data.solicitudes || [];
      
      const pendientes = solicitudes.filter((s: any) => s.estado === 'BORRADOR' || s.estado === 'DOCUMENTACION_CARGADA').length;
      const aprobadas = solicitudes.filter((s: any) => s.estado === 'APROBADA' || s.estado === 'CONTRATO_VALIDADO').length;
      const rechazadas = solicitudes.filter((s: any) => s.estado === 'RECHAZADA').length;
      
      const valorCartera = solicitudes
        .filter((s: any) => s.estado === 'APROBADA' || s.estado === 'CONTRATO_VALIDADO')
        .reduce((sum: number, s: any) => sum + (s.montoSolicitado || 0), 0);
      
      return {
        total: solicitudes.length,
        pendientes,
        aprobadas,
        rechazadas,
        valorCartera,
        desembolsosMes: valorCartera * 0.3, // Simulado: 30% del valor de cartera
      };
      
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      // Retornar datos por defecto si hay error
      return {
        total: 0,
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        valorCartera: 0,
        desembolsosMes: 0,
      };
    }
  };

  const generateRecentActivity = () => {
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'solicitud',
        message: 'Nueva solicitud de préstamo',
        details: 'Juan Pérez - Toyota Corolla 2024',
        timestamp: '2 min',
        icon: '📄',
        color: 'bg-blue-100 text-blue-600',
      },
      {
        id: '2',
        type: 'aprobacion',
        message: 'Análisis crediticio aprobado',
        details: 'María González - Hyundai Tucson',
        timestamp: '15 min',
        icon: '✅',
        color: 'bg-green-100 text-green-600',
      },
      {
        id: '3',
        type: 'contrato',
        message: 'Contrato firmado',
        details: 'Carlos Rodríguez - Nissan Sentra',
        timestamp: '1 hora',
        icon: '📑',
        color: 'bg-purple-100 text-purple-600',
      },
      {
        id: '4',
        type: 'rechazo',
        message: 'Solicitud rechazada',
        details: 'Ana López - Honda Civic',
        timestamp: '2 horas',
        icon: '❌',
        color: 'bg-red-100 text-red-600',
      },
    ];
    
    setRecentActivity(activities);
  };

  const generateAnalistaRecentActivity = () => {
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'documento',
        message: 'Documentos cargados para revisión',
        details: 'Solicitud #2024-001 - DNI, RUC, Boleta',
        timestamp: '5 min',
        icon: '📂',
        color: 'bg-blue-100 text-blue-600',
      },
      {
        id: '2',
        type: 'validacion',
        message: 'Documentos validados exitosamente',
        details: 'Solicitud #2024-002 - Todos los documentos aprobados',
        timestamp: '20 min',
        icon: '✅',
        color: 'bg-green-100 text-green-600',
      },
      {
        id: '3',
        type: 'documento',
        message: 'Contrato y pagaré cargados',
        details: 'Solicitud #2024-003 - Pendiente de validación',
        timestamp: '1 hora',
        icon: '📑',
        color: 'bg-purple-100 text-purple-600',
      },
      {
        id: '4',
        type: 'validacion',
        message: 'Contrato validado y préstamo creado',
        details: 'Solicitud #2024-004 - Proceso completado',
        timestamp: '2 horas',
        icon: '🎉',
        color: 'bg-emerald-100 text-emerald-600',
      },
      {
        id: '5',
        type: 'documento',
        message: 'Documentos rechazados',
        details: 'Solicitud #2024-005 - DNI ilegible, requiere nueva carga',
        timestamp: '3 horas',
        icon: '⚠️',
        color: 'bg-yellow-100 text-yellow-600',
      },
    ];
    
    setRecentActivity(activities);
  };

  const StatCard = ({ title, value, icon, color, link, subtitle }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    link?: string;
    subtitle?: string;
  }) => {
    const content = (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    );

    if (link) {
      return <Link to={link}>{content}</Link>;
    }

    return content;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          ¡Bienvenido, {user?.email}!
        </h1>
        <p className="text-blue-100">
          Panel de control del Sistema de Préstamos Automotrices
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Rol: {user?.rol} • Último acceso: {new Date().toLocaleDateString('es-EC')}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Solicitudes Totales"
          value={stats.totalSolicitudes.toLocaleString()}
          subtitle="Últimos 30 días"
          icon="📄"
          color="bg-blue-100 text-blue-600"
          link="/api/banco-frontend/loans"
        />
        <StatCard
          title="Pendientes de Revisión"
          value={stats.solicitudesPendientes.toLocaleString()}
          subtitle="Requieren atención"
          icon="⏱️"
          color="bg-yellow-100 text-yellow-600"
          link="/api/banco-frontend/loans"
        />
        <StatCard
          title="Aprobadas"
          value={stats.solicitudesAprobadas.toLocaleString()}
          subtitle="Procesadas exitosamente"
          icon="✅"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Vehículos Disponibles"
          value={stats.totalVehiculos.toLocaleString()}
          subtitle="En inventario"
          icon="🚗"
          color="bg-purple-100 text-purple-600"
          link="/api/banco-frontend/vehicles"
        />
      </div>

      {/* Role-specific Stats */}
      {user?.rol === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Concesionarios"
            value={stats.totalConcesionarios.toLocaleString()}
            subtitle="Activos en el sistema"
            icon="🏢"
            color="bg-indigo-100 text-indigo-600"
            link="/api/banco-frontend/concesionarios"
          />
          <StatCard
            title="Vendedores"
            value={stats.totalVendedores.toLocaleString()}
            subtitle="Registrados"
            icon="👔"
            color="bg-pink-100 text-pink-600"
            link="/api/banco-frontend/vendedores"
          />
          <StatCard
            title="Solicitudes Rechazadas"
            value={stats.solicitudesRechazadas.toLocaleString()}
            subtitle="En el período"
            icon="❌"
            color="bg-red-100 text-red-600"
          />
        </div>
      )}

      {/* Analista-specific Stats */}
      {user?.rol === 'ANALISTA' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Documentos Pendientes"
            value={stats.documentosPendientes.toLocaleString()}
            subtitle="Requieren validación"
            icon="📂"
            color="bg-orange-100 text-orange-600"
            link="/api/banco-frontend/documentation"
          />
          <StatCard
            title="Documentos Validados"
            value={stats.documentosValidados.toLocaleString()}
            subtitle="Este mes"
            icon="✅"
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Contratos Pendientes"
            value={stats.contratosPendientes.toLocaleString()}
            subtitle="Por validar"
            icon="📑"
            color="bg-purple-100 text-purple-600"
            link="/api/banco-frontend/documentation"
          />
          <StatCard
            title="Contratos Validados"
            value={stats.contratosValidados.toLocaleString()}
            subtitle="Este mes"
            icon="🎉"
            color="bg-emerald-100 text-emerald-600"
          />
        </div>
      )}

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Valor de Cartera"
          value={formatCurrency(stats.valorCartera)}
          subtitle="Solicitudes aprobadas"
          icon="💰"
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Desembolsos del Mes"
          value={formatCurrency(stats.desembolsosMes)}
          subtitle="Estimado"
          icon="📈"
          color="bg-orange-100 text-orange-600"
          link="/api/banco-frontend/desembolsos"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-4">
          {user?.rol === 'ANALISTA' ? (
            // Acciones específicas para analistas
            <>
              <Link
                to="/api/banco-frontend/documentation"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📂</div>
                <h4 className="font-medium text-gray-900">Revisar Documentación</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.documentosPendientes} documentos pendientes
                </p>
              </Link>
              
              <Link
                to="/api/banco-frontend/documentation"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📑</div>
                <h4 className="font-medium text-gray-900">Validar Contratos</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.contratosPendientes} contratos por validar
                </p>
              </Link>
            </>
          ) : (
            // Acciones para otros roles
            <>
              <Link
                to="/api/banco-frontend/loans/create"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">➕</div>
                <h4 className="font-medium text-gray-900">Nueva Solicitud</h4>
                <p className="text-sm text-gray-500 mt-1">Crear solicitud de préstamo</p>
              </Link>
              
              <Link
                to="/api/banco-frontend/loans"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-medium text-gray-900">Ver Solicitudes</h4>
                <p className="text-sm text-gray-500 mt-1">Gestionar solicitudes existentes</p>
              </Link>
              
              <Link
                to="/api/banco-frontend/vehicles"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🚗</div>
                <h4 className="font-medium text-gray-900">Gestionar Vehículos</h4>
                <p className="text-sm text-gray-500 mt-1">Ver y editar inventario</p>
              </Link>
              
              <Link
                to="/api/banco-frontend/riesgo-credito"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="font-medium text-gray-900">Análisis de Riesgo</h4>
                <p className="text-sm text-gray-500 mt-1">Evaluar solicitudes</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas y Notificaciones</h3>
        <div className="space-y-3">
          {user?.rol === 'ANALISTA' ? (
            // Alertas específicas para analistas
            <>
              {stats.documentosPendientes > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-orange-600 mr-3">📂</span>
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        {stats.documentosPendientes} documentos requieren validación
                      </p>
                      <p className="text-xs text-orange-600">
                        Pendientes de revisión en el sistema
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.contratosPendientes > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-3">📑</span>
                    <div>
                      <p className="text-sm font-medium text-purple-800">
                        {stats.contratosPendientes} contratos por validar
                      </p>
                      <p className="text-xs text-purple-600">
                        Documentos legales pendientes de aprobación
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.documentosValidados > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-3">✅</span>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {stats.documentosValidados} documentos validados este mes
                      </p>
                      <p className="text-xs text-green-600">
                        Proceso de validación funcionando correctamente
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Alertas para otros roles
            <>
              {stats.solicitudesPendientes > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-yellow-600 mr-3">⚠️</span>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        {stats.solicitudesPendientes} solicitudes requieren revisión
                      </p>
                      <p className="text-xs text-yellow-600">
                        Pendientes de análisis crediticio o documentación
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.solicitudesAprobadas > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-3">✅</span>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {stats.solicitudesAprobadas} solicitudes aprobadas este mes
                      </p>
                      <p className="text-xs text-green-600">
                        Valor total: {formatCurrency(stats.valorCartera)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {user?.rol === 'ADMIN' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-3">📊</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Sistema funcionando correctamente
                      </p>
                      <p className="text-xs text-blue-600">
                        {stats.totalConcesionarios} concesionarios activos • {stats.totalVendedores} vendedores registrados
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;