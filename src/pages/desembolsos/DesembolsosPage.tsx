import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prestamoAprobadoService } from '../../services/prestamoAprobadoService';
import type { PrestamoAprobado } from '../../services/prestamoAprobadoService';
import { transactionService } from '../../services/transactionService';
import type { DesembolsoSolicitud } from '../../services/transactionService';
import { useGlobalStore } from '../../contexts/GlobalContext';
import { useAuth } from '../../contexts/AuthContext';
import { getConcesionarioByVendedorEmail } from '../../services/concesionarioService';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils';

const DesembolsosPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prestamos, setPrestamos] = useState<PrestamoAprobado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<PrestamoAprobado | null>(null);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [isProcesando, setIsProcesando] = useState(false);
  const [desembolsoCompletado, setDesembolsoCompletado] = useState(false);

  const { addToast } = useGlobalStore();

  useEffect(() => {
    cargarPrestamosAprobados();
  }, []);

  const cargarPrestamosAprobados = async () => {
    try {
      setIsLoading(true);
      
      let concesionarioId: string | undefined;
      
      // Si el usuario es VENDEDOR, obtener el RUC de su concesionario
      if (user?.rol === 'VENDEDOR' && user?.email) {
        try {
          const concesionario = await getConcesionarioByVendedorEmail(user.email);
          concesionarioId = concesionario.ruc;
          console.log('Concesionario del vendedor:', concesionario);
        } catch (error) {
          console.error('Error al obtener concesionario del vendedor:', error);
          addToast({
            message: 'Error al obtener información del concesionario',
            type: 'error'
          });
          return;
        }
      }
      
      console.log('Usuario:', user);
      console.log('ConcesionarioId (RUC) a enviar:', concesionarioId);
      const data = await prestamoAprobadoService.listarPrestamosAprobados(concesionarioId);
      setPrestamos(data);
    } catch (error: any) {
      console.error('Error al cargar préstamos aprobados:', error);
      addToast({
        message: error.response?.data?.message || 'Error al cargar préstamos aprobados',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcesarDesembolso = (prestamo: PrestamoAprobado) => {
    setPrestamoSeleccionado(prestamo);
    setShowConfirmacion(true);
  };

  const handleConfirmarDesembolso = async () => {
    if (!prestamoSeleccionado) return;

    try {
      setIsProcesando(true);
      
      const desembolsoData: DesembolsoSolicitud = {
        idCuentaCliente: prestamoSeleccionado.idCuentaCliente,
        idCuentaOriginacion: prestamoSeleccionado.idCuentaConcesionario,
        monto: prestamoSeleccionado.montoAprobado,
        descripcion: `Desembolso préstamo ${prestamoSeleccionado.idPrestamo} - ${prestamoSeleccionado.nombreCliente}`,
        idPrestamo: prestamoSeleccionado.idPrestamo,
        idPrestamoCliente: prestamoSeleccionado.id
      };

      await transactionService.realizarDesembolso(desembolsoData);
      
      setDesembolsoCompletado(true);
      addToast({
        message: 'Desembolso realizado exitosamente',
        type: 'success'
      });
      
      // Recargar préstamos después de un momento
      setTimeout(() => {
        cargarPrestamosAprobados();
        setShowConfirmacion(false);
        setDesembolsoCompletado(false);
        setPrestamoSeleccionado(null);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error al realizar desembolso:', error);
      addToast({
        message: error.response?.data?.message || 'Error al realizar el desembolso',
        type: 'error'
      });
    } finally {
      setIsProcesando(false);
    }
  };

  const handleVolver = () => {
    setShowConfirmacion(false);
    setPrestamoSeleccionado(null);
    setDesembolsoCompletado(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando préstamos aprobados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmacion && prestamoSeleccionado) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleVolver}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Desembolso - Confirmación Final</h1>
              <p className="text-gray-600">Valide la información de las cuentas antes de proceder con el desembolso.</p>
            </div>
          </div>

          {/* Información del Préstamo */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Información del Préstamo</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">ID: {prestamoSeleccionado.idPrestamo}</p>
                <p className="text-sm text-blue-700">Vehículo: {prestamoSeleccionado.marcaVehiculo} {prestamoSeleccionado.modeloVehiculo} {prestamoSeleccionado.anioVehiculo}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Cliente: {prestamoSeleccionado.nombreCliente}</p>
                <p className="text-sm text-blue-700">Monto: {formatCurrency(prestamoSeleccionado.montoAprobado)}</p>
              </div>
            </div>
          </div>

          {desembolsoCompletado && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Desembolso realizado con éxito. El concesionario ha sido notificado para la entrega del vehículo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información de Cuentas */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta del banco (origen)
              </label>
              <input
                type="text"
                value="100200300"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta del cliente
              </label>
              <input
                type="text"
                value={prestamoSeleccionado.cuentaCliente || "Cuenta del cliente"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta del concesionario
              </label>
              <input
                type="text"
                value={prestamoSeleccionado.cuentaConcesionario || "Cuenta del concesionario"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-center">
            <Button
              onClick={desembolsoCompletado ? handleVolver : handleConfirmarDesembolso}
              disabled={isProcesando}
              className={`w-full max-w-md ${desembolsoCompletado ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isProcesando ? 'Procesando...' : desembolsoCompletado ? 'Desembolso Procesado' : 'Procesar Desembolso'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.rol === 'VENDEDOR' 
            ? 'Préstamos Aprobados - Mi Concesionario'
            : 'Préstamos Aprobados - Listos para Desembolso'
          }
        </h1>
        <p className="text-gray-600">
          {user?.rol === 'VENDEDOR'
            ? 'Préstamos aprobados de su concesionario listos para desembolso'
            : 'Seleccione un préstamo aprobado para proceder con el desembolso de fondos'
          }
        </p>
      </div>

      <div className="space-y-4">
        {prestamos.map((prestamo) => (
          <div key={prestamo.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {/* Información del cliente */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{prestamo.nombreCliente}</h3>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      prestamo.estado === 'DESEMBOLSADO' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prestamo.estado === 'DESEMBOLSADO' ? 'Desembolsado' : 'Aprobado'}
                    </span>
                  </div>
                </div>

                {/* Detalles del préstamo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">ID Préstamo: <span className="font-medium text-gray-900">{prestamo.idPrestamo}</span></p>
                    <p className="text-sm text-gray-600">Cédula: <span className="font-medium text-gray-900">{prestamo.cedula}</span></p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {prestamo.marcaVehiculo} {prestamo.modeloVehiculo} {prestamo.anioVehiculo} • {prestamo.concesionario}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monto aprobado */}
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(prestamo.montoAprobado)}
                  </p>
                  <Button
                    onClick={() => handleProcesarDesembolso(prestamo)}
                    disabled={prestamo.estado === 'DESEMBOLSADO'}
                    className={`px-6 py-3 rounded-lg flex items-center font-medium ${
                      prestamo.estado === 'DESEMBOLSADO'
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {prestamo.estado === 'DESEMBOLSADO' ? 'Ya Desembolsado' : 'Procesar Desembolso'}
                    {prestamo.estado !== 'DESEMBOLSADO' && (
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {prestamos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay préstamos aprobados</h3>
            <p className="text-gray-500">No se encontraron préstamos aprobados listos para desembolso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesembolsosPage;
