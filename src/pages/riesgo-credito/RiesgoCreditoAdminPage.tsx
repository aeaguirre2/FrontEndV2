import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Users, Database, Settings } from 'lucide-react';
import { riesgoCreditoService } from '../../services/riesgoCreditoService';
import { useToast } from '../../hooks/useToast';

const RiesgoCreditoAdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    personasCore: 0,
    clientesInternos: 0,
  });
  const [cantidadClientesExternos, setCantidadClientesExternos] = useState(20);
  const { showToast } = useToast();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [personasCore, clientesInternos] = await Promise.all([
        riesgoCreditoService.contarPersonasCore(),
        riesgoCreditoService.contarClientesInternos(),
      ]);
      setStats({ personasCore, clientesInternos });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleSincronizarCore = async () => {
    setIsLoading(true);
    try {
      const resultado = await riesgoCreditoService.sincronizarDesdeCore();
      showToast(resultado, 'success');
      await cargarEstadisticas();
    } catch (error: any) {
      const mensaje = error.response?.data || 'Error al sincronizar desde core';
      showToast(mensaje, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSincronizarInternoExterno = async () => {
    setIsLoading(true);
    try {
      const resultado = await riesgoCreditoService.sincronizarInternoExterno();
      showToast(resultado, 'success');
      await cargarEstadisticas();
    } catch (error: any) {
      const mensaje = error.response?.data || 'Error al sincronizar interno-externo';
      showToast(mensaje, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerarClientesExternos = async () => {
    if (cantidadClientesExternos <= 0 || cantidadClientesExternos > 100) {
      showToast('La cantidad debe estar entre 1 y 100', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const resultado = await riesgoCreditoService.generarClientesExternos(cantidadClientesExternos);
      showToast(resultado, 'success');
      await cargarEstadisticas();
    } catch (error: any) {
      const mensaje = error.response?.data || 'Error al generar clientes externos';
      showToast(mensaje, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Administración - Riesgo Crediticio</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Personas en Core</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.personasCore}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes en Buró Interno</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.clientesInternos}</p>
                </div>
                <Database className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Acciones de Administración
            </h2>

            <div className="space-y-6">
              {/* Sincronizar desde Core */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Sincronizar desde Core
                </h3>
                <p className="text-gray-600 mb-4">
                  Carga masiva de clientes del core al buró interno. Devuelve un mensaje con el total de registros creados.
                </p>
                <button
                  onClick={handleSincronizarCore}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sincronizando...' : 'Sincronizar desde Core'}
                </button>
              </div>

              {/* Sincronizar Interno-Externo */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Sincronizar Interno-Externo
                </h3>
                <p className="text-gray-600 mb-4">
                  Copia todos los clientes existentes en el buró interno al buró externo si aún no existen. Ideal para la carga mensual.
                </p>
                <button
                  onClick={handleSincronizarInternoExterno}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sincronizando...' : 'Sincronizar Interno-Externo'}
                </button>
              </div>

              {/* Generar Clientes Externos */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Generar Clientes Externos Mock
                </h3>
                <p className="text-gray-600 mb-4">
                  Genera un número determinado de clientes externos ficticios (mock) que no existen en el buró interno. Útil para pruebas y simulaciones.
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={cantidadClientesExternos}
                    onChange={(e) => setCantidadClientesExternos(parseInt(e.target.value) || 0)}
                    min="1"
                    max="100"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                  />
                  <button
                    onClick={handleGenerarClientesExternos}
                    disabled={isLoading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Generando...' : 'Generar Clientes Externos'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="text-center">
            <button
              onClick={cargarEstadisticas}
              disabled={isLoading}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar Estadísticas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiesgoCreditoAdminPage;
