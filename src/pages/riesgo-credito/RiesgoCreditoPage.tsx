import React, { useState } from 'react';
import { Shield, Info, AlertCircle } from 'lucide-react';
import { riesgoCreditoService } from '../../services/riesgoCreditoService';
import type { ConsultaBuroCreditoResponse } from '../../services/riesgoCreditoService';
import { useToast } from '../../hooks/useToast';

const RiesgoCreditoPage: React.FC = () => {
  const [cedula, setCedula] = useState('12345678');
  const [isLoading, setIsLoading] = useState(false);
  const [consulta, setConsulta] = useState<ConsultaBuroCreditoResponse | null>(null);
  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);
  const { showToast } = useToast();

  const handleConsultar = async () => {
    if (!cedula.trim()) {
      showToast('Por favor ingresa un número de cédula válido', 'error');
      return;
    }

    setIsLoading(true);
    setClienteNoEncontrado(false);
    setConsulta(null);
    
    try {
      console.log('🔄 Iniciando consulta para cédula:', cedula);
      const resultado = await riesgoCreditoService.consultarPorCedula(cedula);
      console.log('✅ Respuesta recibida:', resultado);
      console.log('📊 Datos de la consulta:', {
        nombreCliente: resultado.nombreCliente,
        cedulaCliente: resultado.cedulaCliente,
        calificacionRiesgo: resultado.calificacionRiesgo,
        capacidadPago: resultado.capacidadPago
      });
      setConsulta(resultado);
      console.log('💾 Estado actualizado con consulta');
      showToast('Consulta realizada exitosamente', 'success');
    } catch (error: any) {
      console.error('❌ Error en la consulta:', error);
      console.error('🔍 Detalles del error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      
      // Verificar si es un error 404 (cliente no encontrado)
      if (error.response?.status === 404) {
        setClienteNoEncontrado(true);
        showToast('Cliente no encontrado. Verifique el número de cédula e intente nuevamente.', 'error');
      } else {
        const mensaje = error.response?.data || 'Error al consultar el riesgo crediticio';
        showToast(mensaje, 'error');
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Consulta finalizada');
    }
  };

  const getCalificacionColor = (calificacion: string) => {
    switch (calificacion?.toUpperCase()) {
      case 'A+':
      case 'A':
      case 'A-':
        return 'bg-green-500 text-white';
      case 'B+':
      case 'B':
      case 'B-':
        return 'bg-green-400 text-white';
      case 'C+':
      case 'C':
      case 'C-':
        return 'bg-yellow-500 text-white';
      case 'D+':
      case 'D':
      case 'D-':
        return 'bg-orange-500 text-white';
      case 'E+':
      case 'E':
      case 'E-':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCalificacionText = (calificacion: string) => {
    switch (calificacion?.toUpperCase()) {
      case 'A+':
      case 'A':
      case 'A-':
        return 'Riesgo Muy Bajo';
      case 'B+':
      case 'B':
      case 'B-':
        return 'Riesgo Bajo';
      case 'C+':
      case 'C':
      case 'C-':
        return 'Riesgo Medio';
      case 'D+':
      case 'D':
      case 'D-':
        return 'Riesgo Alto';
      case 'E+':
      case 'E':
      case 'E-':
        return 'Riesgo Muy Alto';
      default:
        return 'Sin Calificación';
    }
  };

  const getRiesgoPercentage = (calificacion: string) => {
    switch (calificacion?.toUpperCase()) {
      case 'A+': return 5;
      case 'A': return 10;
      case 'A-': return 15;
      case 'B+': return 25;
      case 'B': return 30;
      case 'B-': return 35;
      case 'C+': return 45;
      case 'C': return 50;
      case 'C-': return 55;
      case 'D+': return 65;
      case 'D': return 70;
      case 'D-': return 75;
      case 'E+': return 85;
      case 'E': return 90;
      case 'E-': return 95;
      default: return 0;
    }
  };

  const getRiesgoBarColor = (calificacion: string) => {
    switch (calificacion?.toUpperCase()) {
      case 'A+':
      case 'A':
      case 'A-':
        return 'bg-green-500';
      case 'B+':
      case 'B':
      case 'B-':
        return 'bg-green-400';
      case 'C+':
      case 'C':
      case 'C-':
        return 'bg-yellow-500';
      case 'D+':
      case 'D':
      case 'D-':
        return 'bg-orange-500';
      case 'E+':
      case 'E':
      case 'E-':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Debug log para ver el estado actual
  console.log('🎨 Renderizando componente con consulta:', consulta);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Riesgo Crediticio</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Title and Instructions */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Consulta por Cédula
              </h2>
              <p className="text-gray-600">
                Ingresa tu número de cédula para consultar tu perfil crediticio
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ingresa tu número de cédula"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={10}
              />
            </div>

            {/* Consult Button */}
            <div className="mb-8">
              <button
                onClick={handleConsultar}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>

            {/* Results */}
            {consulta && (
              <div className="space-y-6">
                {/* Risk Qualification */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Calificación de Riesgo
                  </h3>
                  <div className="space-y-3">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-xl shadow-lg ${getCalificacionColor(consulta.calificacionRiesgo)}`}>
                      <span className="text-white text-3xl font-bold">
                        {consulta.calificacionRiesgo}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {getCalificacionText(consulta.calificacionRiesgo)}
                    </div>
                    
                    {/* Barra de progreso de riesgo */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Bajo Riesgo</span>
                        <span>Alto Riesgo</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getRiesgoBarColor(consulta.calificacionRiesgo)}`}
                          style={{ width: `${getRiesgoPercentage(consulta.calificacionRiesgo)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {getRiesgoPercentage(consulta.calificacionRiesgo)}% de riesgo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Capacity */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Capacidad de Pago
                  </h3>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(consulta.capacidadPago)}
                  </div>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Capacidad de pago:</p>
                      <p>
                        Se refiere al máximo que una persona puede pagar un crédito, 
                        generalmente hasta el 30% de la diferencia entre ingresos y egresos mensuales.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {consulta.nombreCliente && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Información del Cliente</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <p className="font-medium">{consulta.nombreCliente}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cédula:</span>
                        <p className="font-medium">{consulta.cedulaCliente}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cliente No Encontrado Message */}
            {clienteNoEncontrado && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Cliente No Encontrado
                    </h3>
                    <p className="text-red-700 mb-4">
                      No se encontró información crediticia para la cédula <strong>{cedula}</strong>
                    </p>
                    <div className="text-sm text-red-600 space-y-2">
                      <p>Posibles razones:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>El número de cédula ingresado es incorrecto</li>
                        <li>El cliente no tiene historial crediticio registrado</li>
                        <li>La información no está disponible en el sistema</li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setCedula('');
                          setClienteNoEncontrado(false);
                        }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        Intentar con otra cédula
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiesgoCreditoPage;
