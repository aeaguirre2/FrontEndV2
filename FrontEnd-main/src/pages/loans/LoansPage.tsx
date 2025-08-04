import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { loanService, type SolicitudCredito, type SolicitudConsultaRequest, type SolicitudDetalladaResponseDTO } from '../../services/loanService';
import { prestamoService } from '../../services/prestamoService';

// Iconos (puedes usar lucide-react o cualquier librería de iconos)
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const LineChartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const SimulateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

// Componente de error personalizado
const ErrorMessage: React.FC<{ message: string; onRetry: () => void; onDismiss: () => void }> = ({ message, onRetry, onDismiss }) => {
  const isDateRangeError = message.includes('rango de fechas') || message.includes('31 días');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-red-800">
            {isDateRangeError ? 'Rango de fechas inválido' : 'Error al cargar datos'}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
            {isDateRangeError && (
              <div className="mt-3 p-3 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-2">💡 Sugerencias:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Use el botón "Semana actual" para un rango más corto</li>
                  <li>• Seleccione un período máximo de 31 días</li>
                  <li>• Divida consultas largas en períodos más pequeños</li>
                </ul>
              </div>
            )}
          </div>
          <div className="mt-4 flex space-x-3">
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700 text-white">
              Reintentar
            </Button>
            <Button onClick={onDismiss} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              Cerrar
            </Button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <XIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoansPage: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudCredito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal de detalle
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [solicitudDetalle, setSolicitudDetalle] = useState<SolicitudDetalladaResponseDTO | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  
  // Estados para el modal de edición
  const [modalEdicionAbierto, setModalEdicionAbierto] = useState(false);
  const [solicitudEdicion, setSolicitudEdicion] = useState<SolicitudDetalladaResponseDTO | null>(null);
  const [loadingEdicion, setLoadingEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null);
  const [guardandoCambios, setGuardandoCambios] = useState(false);
  
  // Estados para el formulario de edición
  const [formDataEdicion, setFormDataEdicion] = useState({
    valorEntrada: '',
    plazoMeses: ''
  });
  
  // Estados para préstamos y cálculos
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<any>(null);
  const [plazosDisponibles, setPlazosDisponibles] = useState<number[]>([]);
  const [entradaSugerida, setEntradaSugerida] = useState<number | null>(null);
  
  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [cedulaVendedor, setCedulaVendedor] = useState<string>('');
  const [rucConcesionario, setRucConcesionario] = useState<string>('');
  
  // Estados para paginación
  const [pagina, setPagina] = useState(0);
  const [tamanoPagina] = useState(20);
  const [totalElementos, setTotalElementos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  
  // Estados para métricas
  const [metricas, setMetricas] = useState({
    totalSolicitudes: 0,
    enBorrador: 0,
    aprobadas: 0,
    rechazadas: 0,
    montoTotal: 0
  });

  // Inicializar fechas con la semana actual
  useEffect(() => {
    const { fechaInicio: inicio, fechaFin: fin } = loanService.getCurrentWeekRange();
    setFechaInicio(inicio);
    setFechaFin(fin);
  }, []);

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarSolicitudes();
    }
  }, [fechaInicio, fechaFin, estado, cedulaVendedor, rucConcesionario, pagina]);

  // Función para formatear fecha para input datetime-local
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Función para convertir input datetime-local a ISO string
  const convertInputToISO = (inputValue: string): string => {
    if (!inputValue) return '';
    return new Date(inputValue).toISOString();
  };

  // Función para validar el rango de fechas
  const validarRangoFechas = (fechaInicio: string, fechaFin: string): { esValido: boolean; mensaje?: string } => {
    if (!fechaInicio || !fechaFin) {
      return { esValido: false, mensaje: 'Por favor, seleccione ambas fechas.' };
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (inicio > fin) {
      return { esValido: false, mensaje: 'La fecha de inicio no puede ser mayor que la fecha de fin.' };
    }

    const diferenciaDias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias > 31) {
      return { 
        esValido: false, 
        mensaje: `El rango de fechas seleccionado (${diferenciaDias} días) excede el límite de 31 días. Por favor, seleccione un período más corto.` 
      };
    }

    return { esValido: true };
  };

  const cargarSolicitudes = async () => {
    setLoading(true);
    setError(null);
    
    // Validar rango de fechas antes de hacer la petición
    const validacion = validarRangoFechas(fechaInicio, fechaFin);
    if (!validacion.esValido) {
      setError(validacion.mensaje || 'Error de validación');
      setLoading(false);
      return;
    }
    
    try {
      const request: SolicitudConsultaRequest = {
        fechaInicio,
        fechaFin,
        estado: estado || undefined,
        cedulaVendedor: cedulaVendedor || undefined,
        rucConcesionario: rucConcesionario || undefined,
        pagina,
        tamanoPagina
      };

      const response = await loanService.consultarSolicitudesPorFechas(request);
      
      setSolicitudes(response.solicitudes);
      setTotalElementos(response.totalElementos);
      setTotalPaginas(response.totalPaginas);
      
      // Calcular métricas
      const totalSolicitudes = response.solicitudes.length;
      const enBorrador = response.solicitudes.filter(s => s.estado === 'BORRADOR').length;
      const aprobadas = response.solicitudes.filter(s => s.estado === 'APROBADA').length;
      const rechazadas = response.solicitudes.filter(s => s.estado === 'RECHAZADA').length;
      const montoTotal = response.solicitudes.reduce((sum, s) => sum + s.montoSolicitado, 0);
      
      setMetricas({
        totalSolicitudes,
        enBorrador,
        aprobadas,
        rechazadas,
        montoTotal
      });
      
    } catch (err: any) {
      console.error('Error al cargar solicitudes:', err);
      
      // Manejo personalizado de errores
      let errorMessage = 'Error al cargar las solicitudes. Por favor, intente nuevamente.';
      
      if (err?.response?.data?.detalle) {
        const detalle = err.response.data.detalle;
        
        // Verificar si es el error de rango de fechas
        if (detalle.includes('rango de fechas no puede exceder 31 días')) {
          errorMessage = 'El rango de fechas seleccionado excede el límite de 31 días. Por favor, seleccione un período más corto.';
        } else if (detalle.includes('Error code: 500')) {
          // Extraer el mensaje específico del error
          const match = detalle.match(/message: (.+)$/);
          if (match) {
            errorMessage = match[1];
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSemanaActual = () => {
    const { fechaInicio: inicio, fechaFin: fin } = loanService.getCurrentWeekRange();
    setFechaInicio(inicio);
    setFechaFin(fin);
    setPagina(0);
  };

  const handleMesActual = () => {
    const { fechaInicio: inicio, fechaFin: fin } = loanService.getCurrentMonthRange();
    setFechaInicio(inicio);
    setFechaFin(fin);
    setPagina(0);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'BORRADOR':
        return 'bg-gray-600 text-white';
      case 'EN_REVISION':
      case 'EN_ANALISIS':
        return 'bg-yellow-500 text-white';
      case 'APROBADA':
        return 'bg-green-500 text-white';
      case 'RECHAZADA':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
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
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  // Funciones para el modal de edición
  const handleInputChangeEdicion = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataEdicion(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia el valor de entrada, recalcular monto solicitado
    if (name === 'valorEntrada' && prestamoSeleccionado && solicitudEdicion) {
      const valorVehiculo = solicitudEdicion.valorVehiculo;
      const nuevaEntrada = parseFloat(value) || 0;
      const nuevoMontoSolicitado = valorVehiculo - nuevaEntrada;
      
      // Calcular entrada sugerida si está fuera de rango
      let entradaSugerida = nuevaEntrada;
      
      if (nuevoMontoSolicitado < prestamoSeleccionado.montoMinimo) {
        const rangoDisponible = prestamoSeleccionado.montoMaximo - prestamoSeleccionado.montoMinimo;
        const montoIntermedio = prestamoSeleccionado.montoMinimo + (rangoDisponible * 0.7);
        entradaSugerida = valorVehiculo - montoIntermedio;
      } else if (nuevoMontoSolicitado > prestamoSeleccionado.montoMaximo) {
        const rangoDisponible = prestamoSeleccionado.montoMaximo - prestamoSeleccionado.montoMinimo;
        const montoIntermedio = prestamoSeleccionado.montoMinimo + (rangoDisponible * 0.7);
        entradaSugerida = valorVehiculo - montoIntermedio;
      }
      
      setEntradaSugerida(entradaSugerida);
    }
  };

  const calcularNuevoMontoSolicitado = () => {
    if (!solicitudEdicion) return 0;
    const valorVehiculo = solicitudEdicion.valorVehiculo;
    const valorEntrada = parseFloat(formDataEdicion.valorEntrada) || 0;
    return valorVehiculo - valorEntrada;
  };

  const calcularCuotaMensual = () => {
    if (!prestamoSeleccionado) return 0;
    
    const montoSolicitado = calcularNuevoMontoSolicitado();
    const tasaInteres = prestamoSeleccionado.tasaInteres / 100;
    const plazoMeses = parseFloat(formDataEdicion.plazoMeses);
    
    const tasaMensual = tasaInteres / 12;
    const numerador = tasaMensual * Math.pow(1 + tasaMensual, plazoMeses);
    const denominador = Math.pow(1 + tasaMensual, plazoMeses) - 1;
    
    if (denominador === 0) return 0;
    
    const cuotaMensual = montoSolicitado * (numerador / denominador);
    return Math.round(cuotaMensual * 1000) / 1000;
  };

  const validarCapacidadPago = () => {
    if (!solicitudEdicion) return false;
    const capacidadPago = solicitudEdicion.capacidadPagoSolicitante;
    const cuotaMensual = calcularCuotaMensual();
    return capacidadPago >= cuotaMensual;
  };

  const validarCamposRequeridos = () => {
    const camposRequeridos = [
      formDataEdicion.valorEntrada,
      formDataEdicion.plazoMeses
    ];
    
    return camposRequeridos.every(campo => campo && campo.trim() !== '');
  };

  const handleGuardarCambios = async () => {
    if (!validarCamposRequeridos()) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }
    
    if (!validarCapacidadPago()) {
      alert('La capacidad de pago no es suficiente para la cuota mensual calculada.');
      return;
    }

    setGuardandoCambios(true);

    try {
      const solicitudData = {
        cedulaSolicitante: solicitudEdicion!.cedulaSolicitante,
        idPrestamo: solicitudEdicion!.idPrestamo,
        placaVehiculo: solicitudEdicion!.placaVehiculo,
        rucConcesionario: solicitudEdicion!.rucConcesionario,
        cedulaVendedor: solicitudEdicion!.cedulaVendedor,
        valorEntrada: parseFloat(formDataEdicion.valorEntrada),
        plazoMeses: parseInt(formDataEdicion.plazoMeses),
        calificacionSolicitante: solicitudEdicion!.calificacionSolicitante,
        capacidadPagoSolicitante: solicitudEdicion!.capacidadPagoSolicitante,
        montoSolicitado: calcularNuevoMontoSolicitado()
      };

      await loanService.editarSolicitud(solicitudEdicion!.numeroSolicitud, solicitudData);
      
      alert('Solicitud actualizada exitosamente');
      setModalEdicionAbierto(false);
      
      // Recargar la lista de solicitudes
      cargarSolicitudes();
      
    } catch (error: any) {
      console.error('Error al actualizar la solicitud:', error);
      alert(`Error al actualizar la solicitud: ${error.message}`);
    } finally {
      setGuardandoCambios(false);
    }
  };

  const handleVerSolicitud = async (numeroSolicitud: string) => {
    setLoadingDetalle(true);
    setErrorDetalle(null);
    setSolicitudDetalle(null);
    
    try {
      const detalle = await loanService.obtenerSolicitudDetallada(numeroSolicitud);
      setSolicitudDetalle(detalle);
      setModalDetalleAbierto(true);
    } catch (err: any) {
      console.error('Error al cargar detalle de solicitud:', err);
      setErrorDetalle('Error al cargar los detalles de la solicitud');
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleEditarSolicitud = async (numeroSolicitud: string) => {
    setLoadingEdicion(true);
    setErrorEdicion(null);
    setSolicitudEdicion(null);
    
    try {
      // Cargar el detalle de la solicitud
      const detalle = await loanService.obtenerSolicitudDetallada(numeroSolicitud);
      setSolicitudEdicion(detalle);
      
      // Cargar los préstamos para obtener información del préstamo seleccionado
      const prestamosData = await prestamoService.obtenerPrestamosActivos();
      const prestamoActual = prestamosData.find(p => p.id === detalle.idPrestamo);
      setPrestamoSeleccionado(prestamoActual);
      setPrestamos(prestamosData);
      
      // Generar plazos disponibles
      if (prestamoActual) {
        const plazos = [];
        for (let i = prestamoActual.plazoMinimoMeses; i <= prestamoActual.plazoMaximoMeses; i++) {
          plazos.push(i);
        }
        setPlazosDisponibles(plazos);
      }
      
      // Inicializar el formulario con los datos actuales
      setFormDataEdicion({
        valorEntrada: detalle.valorEntrada.toString(),
        plazoMeses: detalle.plazoMeses.toString()
      });
      
      setModalEdicionAbierto(true);
    } catch (err: any) {
      console.error('Error al cargar solicitud para edición:', err);
      setErrorEdicion('Error al cargar la solicitud para edición');
    } finally {
      setLoadingEdicion(false);
    }
  };

  const handleSimularSolicitud = (numeroSolicitud: string) => {
    navigate(`/loans/simulate/${numeroSolicitud}`);
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Solicitudes</h1>
          <p className="text-gray-600 mt-1">Gestión de solicitudes de crédito automotriz</p>
        </div>
        <Button onClick={() => navigate('/loans/create')} className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2">
          <PlusIcon />
          <span>Crear Solicitud</span>
        </Button>
      </div>

      {/* Filtros y Métricas */}
      <div className="space-y-6">
        {/* Filtro de fechas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="datetime-local"
                value={formatDateForInput(fechaInicio)}
                onChange={(e) => setFechaInicio(convertInputToISO(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="datetime-local"
                value={formatDateForInput(fechaFin)}
                onChange={(e) => setFechaFin(convertInputToISO(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="BORRADOR">En Borrador</option>
                <option value="EN_REVISION">En Revisión</option>
                <option value="APROBADA">Aprobada</option>
                <option value="RECHAZADA">Rechazada</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleSemanaActual} variant="outline" className="flex items-center space-x-2">
                <XIcon />
                <span>Semana actual</span>
          </Button>
              <Button onClick={handleMesActual} variant="outline">
                Mes actual
          </Button>
            </div>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Solicitudes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.totalSolicitudes}</p>
                <p className="text-sm text-gray-500 mt-1">En el período seleccionado</p>
              </div>
              <div className="text-gray-400">
                <LineChartIcon />
              </div>
            </div>
          </div>

          {/* En Borrador */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">En Borrador</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.enBorrador}</p>
                <p className="text-sm text-gray-500 mt-1">Pendientes de envío</p>
              </div>
              <div className="text-gray-400">
                <ClockIcon />
              </div>
            </div>
          </div>

          {/* Aprobadas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.aprobadas}</p>
                <p className="text-sm text-gray-500 mt-1">Créditos aprobados</p>
              </div>
              <div className="text-green-500">
                <CheckIcon />
              </div>
            </div>
          </div>

          {/* Monto Total */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(metricas.montoTotal)}</p>
                <p className="text-sm text-gray-500 mt-1">Valor solicitado</p>
              </div>
              <div className="text-gray-400">
                <LineChartIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Solicitudes</h3>
          <p className="text-sm text-gray-600 mt-1">
            Mostrando {solicitudes.length} de {totalElementos} solicitudes del período seleccionado
          </p>
        </div>

        {loading && (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando solicitudes...</p>
          </div>
        )}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={cargarSolicitudes}
            onDismiss={() => setError(null)}
          />
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.idSolicitud} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {solicitud.numeroSolicitud}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(solicitud.fechaSolicitud)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Cédula: {solicitud.cedulaSolicitante}</div>
                          <div className="text-sm text-gray-500">Vendedor: {solicitud.cedulaVendedor}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Placa: {solicitud.placaVehiculo}</div>
                          <div className="text-sm text-gray-500">Plazo: {solicitud.plazoMeses} meses</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(solicitud.montoSolicitado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitud.estado)}`}>
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleVerSolicitud(solicitud.numeroSolicitud)}
                            className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                          >
                            <EyeIcon />
                            <span>Ver</span>
                          </button>
                          {(solicitud.estado === 'BORRADOR') && (
                            <button 
                              onClick={() => handleEditarSolicitud(solicitud.numeroSolicitud)}
                              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                            >
                              <EditIcon />
                              <span>Editar</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleSimularSolicitud(solicitud.numeroSolicitud)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <SimulateIcon />
                            <span>Simular</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Página {pagina + 1} de {totalPaginas} ({totalElementos} solicitudes)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setPagina(Math.max(0, pagina - 1))}
                      disabled={pagina === 0}
                      variant="outline"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={() => setPagina(Math.min(totalPaginas - 1, pagina + 1))}
                      disabled={pagina === totalPaginas - 1}
                      variant="outline"
                    >
                      Siguiente
            </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Detalle de Solicitud */}
      {modalDetalleAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalle de Solicitud - {solicitudDetalle?.numeroSolicitud}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Información completa de la solicitud</p>
              </div>
              <button
                onClick={() => setModalDetalleAbierto(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {loadingDetalle ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-2">Cargando detalles de la solicitud...</p>
                </div>
              ) : errorDetalle ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">{errorDetalle}</p>
                  <Button
                    onClick={() => setModalDetalleAbierto(false)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Cerrar
                  </Button>
                </div>
              ) : solicitudDetalle ? (
                <div className="space-y-6">
                  {/* Sección 1: Detalle de Solicitud */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-sm text-gray-600">Solicitante</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.nombresSolicitante}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Estado</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            solicitudDetalle.estado === 'BORRADOR' ? 'bg-gray-100 text-gray-800' :
                            solicitudDetalle.estado === 'EN_REVISION' ? 'bg-yellow-100 text-yellow-800' :
                            solicitudDetalle.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {solicitudDetalle.estado === 'BORRADOR' ? 'En Borrador' :
                             solicitudDetalle.estado === 'EN_REVISION' ? 'En Revisión' :
                             solicitudDetalle.estado === 'APROBADA' ? 'Aprobada' :
                             'Rechazada'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Cédula</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.cedulaSolicitante}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Calificación Buró</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.calificacionSolicitante}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sección 2: Información del Vehículo */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Vehículo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-sm text-gray-600">Placa</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.placaVehiculo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Año</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.anioVehiculo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Marca y Modelo</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.marcaVehiculo} {solicitudDetalle.modeloVehiculo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Valor del Vehículo</span>
                        <p className="font-medium text-gray-900">$ {solicitudDetalle.valorVehiculo.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sección 3: Detalles del Crédito */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Crédito</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <span className="text-sm text-gray-600">Valor de Entrada</span>
                        <p className="font-medium text-gray-900">$ {solicitudDetalle.valorEntrada.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Monto Solicitado</span>
                        <p className="font-medium text-green-600 text-lg">$ {solicitudDetalle.montoSolicitado.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Plazo</span>
                        <p className="font-medium text-gray-900">{solicitudDetalle.plazoMeses} meses</p>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Información Adicional</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Concesionario:</span>
                        <p className="font-medium">{solicitudDetalle.razonSocialConcesionario}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Vendedor:</span>
                        <p className="font-medium">{solicitudDetalle.nombreVendedor}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tipo de Préstamo:</span>
                        <p className="font-medium">{solicitudDetalle.nombrePrestamo}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacidad de Pago:</span>
                        <p className="font-medium">$ {solicitudDetalle.capacidadPagoSolicitante.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer del Modal */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <Button
                onClick={() => setModalDetalleAbierto(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Solicitud */}
      {modalEdicionAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Editar Solicitud - {solicitudEdicion?.numeroSolicitud}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Modifique los campos editables de la solicitud</p>
              </div>
              <button
                onClick={() => setModalEdicionAbierto(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {loadingEdicion ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-2">Cargando solicitud para edición...</p>
                </div>
              ) : errorEdicion ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">{errorEdicion}</p>
                  <Button
                    onClick={() => setModalEdicionAbierto(false)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Cerrar
                  </Button>
                </div>
              ) : solicitudEdicion ? (
                <div className="space-y-6">
                  {/* Placa del Vehículo (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa del Vehículo</label>
                    <input
                      type="text"
                      value={solicitudEdicion.placaVehiculo}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      readOnly
                    />
                  </div>

                  {/* Valor de Entrada */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Entrada</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="valorEntrada"
                        value={formDataEdicion.valorEntrada}
                        onChange={handleInputChangeEdicion}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {entradaSugerida !== null && entradaSugerida !== parseFloat(formDataEdicion.valorEntrada) && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <button
                            type="button"
                            onClick={() => {
                              setFormDataEdicion(prev => ({
                                ...prev,
                                valorEntrada: entradaSugerida.toString()
                              }));
                              setEntradaSugerida(null);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                            title={`Aplicar valor sugerido: $${entradaSugerida.toLocaleString()}`}
                          >
                            Aplicar
                          </button>
                        </div>
                      )}
                    </div>
                    {entradaSugerida !== null && entradaSugerida !== parseFloat(formDataEdicion.valorEntrada) && (
                      <p className="text-xs text-blue-600 mt-1">
                        💡 Valor sugerido: ${entradaSugerida.toLocaleString()} para cumplir con el rango del préstamo
                      </p>
                    )}
                  </div>

                  {/* Plazo (Meses) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (Meses)</label>
                    <select
                      name="plazoMeses"
                      value={formDataEdicion.plazoMeses}
                      onChange={handleInputChangeEdicion}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {plazosDisponibles.map(plazo => (
                        <option key={plazo} value={plazo.toString()}>
                          {plazo} meses
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calificación Buró (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calificación Buró</label>
                    <input
                      type="text"
                      value={solicitudEdicion.calificacionSolicitante}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      readOnly
                    />
                  </div>

                  {/* Capacidad de Pago (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad de Pago</label>
                    <input
                      type="text"
                      value={`$ ${solicitudEdicion.capacidadPagoSolicitante.toLocaleString()}`}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      readOnly
                    />
                  </div>

                  {/* Nuevo Monto Solicitado (Calculado) */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Monto Solicitado</label>
                    <p className="text-2xl font-bold text-blue-600">
                      $ {calcularNuevoMontoSolicitado().toLocaleString()}
                    </p>
                  </div>

                  {/* Validaciones */}
                  {prestamoSeleccionado && (() => {
                    const montoSolicitado = calcularNuevoMontoSolicitado();
                    const montoMinimo = prestamoSeleccionado.montoMinimo;
                    const montoMaximo = prestamoSeleccionado.montoMaximo;
                                         const capacidadPago = solicitudEdicion.capacidadPagoSolicitante;
                    const cuotaMensual = calcularCuotaMensual();
                    const esCapacidadValida = capacidadPago >= cuotaMensual;
                    
                    return (
                      <div className="space-y-3">
                        {/* Validación de rango */}
                        {montoSolicitado < montoMinimo && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                              ⚠️ El monto solicitado (${montoSolicitado.toLocaleString()}) es menor al mínimo permitido (${montoMinimo.toLocaleString()})
                            </p>
                          </div>
                        )}
                        
                        {montoSolicitado > montoMaximo && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                              ❌ El monto solicitado (${montoSolicitado.toLocaleString()}) excede el máximo permitido (${montoMaximo.toLocaleString()})
                            </p>
                          </div>
                        )}
                        
                        {/* Validación de capacidad de pago */}
                        <div className={`p-3 border rounded-md ${esCapacidadValida ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <p className={`text-sm ${esCapacidadValida ? 'text-green-800' : 'text-red-800'}`}>
                            {esCapacidadValida ? '✅' : '❌'} Capacidad de pago: {esCapacidadValida ? 'Suficiente' : 'Insuficiente'}
                          </p>
                          <div className="text-xs mt-1 space-y-1">
                            <p className={esCapacidadValida ? 'text-green-700' : 'text-red-700'}>
                              • Cuota mensual: ${cuotaMensual.toLocaleString()}
                            </p>
                            <p className={esCapacidadValida ? 'text-green-700' : 'text-red-700'}>
                              • Capacidad de pago: ${capacidadPago.toLocaleString()}
                            </p>
                            {!esCapacidadValida && (
                              <p className="text-red-700 font-medium">
                                • Diferencia faltante: ${(cuotaMensual - capacidadPago).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </div>

            {/* Footer del Modal */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setModalEdicionAbierto(false)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardarCambios}
                disabled={!validarCamposRequeridos() || !validarCapacidadPago() || guardandoCambios || (() => {
                  if (!prestamoSeleccionado) return true;
                  const montoSolicitado = calcularNuevoMontoSolicitado();
                  return montoSolicitado < prestamoSeleccionado.montoMinimo || montoSolicitado > prestamoSeleccionado.montoMaximo;
                })()}
                className={`${
                  validarCamposRequeridos() && validarCapacidadPago() && !guardandoCambios && (() => {
                    if (!prestamoSeleccionado) return false;
                    const montoSolicitado = calcularNuevoMontoSolicitado();
                    return montoSolicitado >= prestamoSeleccionado.montoMinimo && montoSolicitado <= prestamoSeleccionado.montoMaximo;
                  })()
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {guardandoCambios ? (
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;