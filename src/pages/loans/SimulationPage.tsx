import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { loanService } from '../../services/loanService';

// Iconos
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SimulacionSolicitudResponseDTO {
  numeroSolicitud: string;
  cedulaSolicitante: string;
  placaVehiculo: string;
  rucConcesionario: string;
  idPrestamo: string;
  valorVehiculo: number;
  valorEntrada: number;
  montoSolicitado: number;
  plazoMeses: number;
  tasaInteres: number;
  fechaSimulacion: string;
  cuotaMensual: number;
  montoTotal: number;
  totalIntereses: number;
  totalAPagar: number;
  tablaAmortizacion: Array<{
    numeroCuota: number;
    saldoInicial: number;
    cuota: number;
    abonoCapital: number;
    interes: number;
    saldoFinal: number;
  }>;
  nombrePrestamo: string;
  descripcionPrestamo: string;
  capacidadPagoCliente: number;
  esAprobable: boolean;
  motivoRechazo: string | null;
}

const SimulationPage: React.FC = () => {
  const { numeroSolicitud } = useParams<{ numeroSolicitud: string }>();
  const navigate = useNavigate();
  
  const [simulacion, setSimulacion] = useState<SimulacionSolicitudResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (numeroSolicitud) {
      cargarSimulacion();
    }
  }, [numeroSolicitud]);

  const cargarSimulacion = async () => {
    if (!numeroSolicitud) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await loanService.simularSolicitud(numeroSolicitud);
      setSimulacion(data);
    } catch (err: any) {
      console.error('Error al cargar simulación:', err);
      setError('Error al cargar la simulación de la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando simulación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar simulación</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button onClick={cargarSimulacion} className="bg-blue-600 hover:bg-blue-700 text-white">
              Reintentar
            </Button>
            <Button onClick={() => navigate('/loans')} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!simulacion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/loans')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <ArrowLeftIcon />
              <span>Volver</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simulación de Crédito</h1>
              <p className="text-gray-600 mt-1">Solicitud: {simulacion.numeroSolicitud}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              simulacion.esAprobable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {simulacion.esAprobable ? (
                <span className="flex items-center space-x-1">
                  <CheckIcon />
                  <span>Aprobable</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <XIcon />
                  <span>No Aprobable</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen de la Simulación */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <CalculatorIcon />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Resumen de la Simulación</h2>
                  <p className="text-sm text-gray-500">Detalles del crédito simulado</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Valor del Vehículo</span>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(simulacion.valorVehiculo)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Valor de Entrada</span>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(simulacion.valorEntrada)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Monto Solicitado</span>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(simulacion.montoSolicitado)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Plazo</span>
                    <p className="text-lg font-semibold text-gray-900">{simulacion.plazoMeses} meses</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tasa de Interés</span>
                    <p className="text-lg font-semibold text-gray-900">{formatPercentage(simulacion.tasaInteres)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Cuota Mensual</span>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(simulacion.cuotaMensual)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Amortización */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Amortización</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuota
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo Inicial
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuota
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Abono Capital
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interés
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo Final
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {simulacion.tablaAmortizacion.map((cuota) => (
                      <tr key={cuota.numeroCuota} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cuota.numeroCuota}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cuota.saldoInicial)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-purple-600">
                          {formatCurrency(cuota.cuota)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cuota.abonoCapital)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cuota.interes)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cuota.saldoFinal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Información del Cliente */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Cédula</span>
                  <p className="font-medium text-gray-900">{simulacion.cedulaSolicitante}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Placa del Vehículo</span>
                  <p className="font-medium text-gray-900">{simulacion.placaVehiculo}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">RUC Concesionario</span>
                  <p className="font-medium text-gray-900">{simulacion.rucConcesionario}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Capacidad de Pago</span>
                  <p className="font-medium text-gray-900">{formatCurrency(simulacion.capacidadPagoCliente)}</p>
                </div>
              </div>
            </div>

            {/* Información del Préstamo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Préstamo</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Nombre</span>
                  <p className="font-medium text-gray-900">{simulacion.nombrePrestamo}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Descripción</span>
                  <p className="text-sm text-gray-700">{simulacion.descripcionPrestamo}</p>
                </div>
              </div>
            </div>

            {/* Totales */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Totales</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Intereses</span>
                  <span className="font-medium text-red-600">{formatCurrency(simulacion.totalIntereses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto Total</span>
                  <span className="font-medium text-blue-600">{formatCurrency(simulacion.montoTotal)}</span>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Total a Pagar</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(simulacion.totalAPagar)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Aprobación */}
            {!simulacion.esAprobable && simulacion.motivoRechazo && (
              <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Motivo de Rechazo</h3>
                <p className="text-sm text-red-700">{simulacion.motivoRechazo}</p>
              </div>
            )}

            {/* Fecha de Simulación */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">
                Simulación realizada el: {formatDate(simulacion.fechaSimulacion)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage; 