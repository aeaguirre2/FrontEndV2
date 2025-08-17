import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

import { prestamoService, type Prestamo } from '../../services/prestamoService';
import { getConcesionariosByEstado, getVehiculosByRuc, getVendedoresByRuc } from '../../services/concesionarioService';
import { riesgoCreditoService, type ConsultaBuroCreditoResponse } from '../../services/riesgoCreditoService';
import { originacionService, type CrearSolicitudRequestDTO } from '../../services/originacionService';
import type { VehiculoEnConcesionario } from '../../types/automotive-loan';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

// Iconos
const PersonIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CreateLoanPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  // Función para obtener el color de la calificación de riesgo
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
  const [formData, setFormData] = useState({
    cedula: '0101515151',
    nombres: '',
    direccion: '',
    capacidadPago: '',
    calificacionBuro: '',
    tipoCredito: '',
    concesionario: '',
    vendedor: '',
    placaVehiculo: '',
    marca: '',
    modelo: '',
    anio: '',
    valorVehiculo: '',
    valorEntrada: '',
    montoSolicitado: '',
    plazoMeses: '12'
  });

  // Estados para riesgo crediticio
  const [riesgoCrediticio, setRiesgoCrediticio] = useState<ConsultaBuroCreditoResponse | null>(null);
  const [loadingRiesgo, setLoadingRiesgo] = useState(false);
  const [errorRiesgo, setErrorRiesgo] = useState<string | null>(null);

  // Estados para información del vendedor logueado
  const [vendedorInfo, setVendedorInfo] = useState<any>(null);
  const [concesionarioInfo, setConcesionarioInfo] = useState<any>(null);
  const [loadingVendedorInfo, setLoadingVendedorInfo] = useState(false);

  // Estados para préstamos
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loadingPrestamos, setLoadingPrestamos] = useState(false);
  const [errorPrestamos, setErrorPrestamos] = useState<string | null>(null);

  // Estados para vehículos
  const [vehiculos, setVehiculos] = useState<VehiculoEnConcesionario[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [errorVehiculos, setErrorVehiculos] = useState<string | null>(null);
  const [concesionarios, setConcesionarios] = useState<{ ruc: string; razonSocial: string }[]>([]);
  const [loadingVehiculosConcesionario, setLoadingVehiculosConcesionario] = useState(false);
  const [vehiculoDetallado, setVehiculoDetallado] = useState<VehiculoEnConcesionario | null>(null);
  const [plazosDisponibles, setPlazosDisponibles] = useState<number[]>([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<any>(null);
  const [entradaSugerida, setEntradaSugerida] = useState<number | null>(null);
  const [creandoSolicitud, setCreandoSolicitud] = useState(false);
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [loadingVendedores, setLoadingVendedores] = useState(false);
  const [errorVendedores, setErrorVendedores] = useState<string | null>(null);

  // Estados para el modal de resultado
  const [modalResultadoAbierto, setModalResultadoAbierto] = useState(false);
  const [resultadoSolicitud, setResultadoSolicitud] = useState<{
    exito: boolean;
    titulo: string;
    mensaje: string;
    numeroSolicitud?: string;
    detalles?: any;
  } | null>(null);

  // Función para cerrar modal y redirigir
  const cerrarModalYRedirigir = () => {
    setModalResultadoAbierto(false);
    // Mostrar toast de redirección
    mostrarNotificacionInline('Redirigiendo a la página de solicitudes...', 'info');
    // Pequeño delay para que la animación del modal se complete antes de redirigir
    setTimeout(() => {
      navigate('/loans');
    }, 300);
  };

  // Manejar tecla ESC para cerrar modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalResultadoAbierto) {
        cerrarModalYRedirigir();
      }
    };

    if (modalResultadoAbierto) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [modalResultadoAbierto]);

  // Función helper para mostrar notificaciones inline
  const mostrarNotificacionInline = (mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    showToast(mensaje, tipo);
  };

  // Debug: Monitorear cambios en vehiculoDetallado
  useEffect(() => {
    console.log('Estado de vehiculoDetallado cambió:', vehiculoDetallado);
  }, [vehiculoDetallado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si es vendedor logueado, no permitir cambios en concesionario o vendedor
    if (user?.rol === 'VENDEDOR' && (name === 'concesionario' || name === 'vendedor')) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si se selecciona un concesionario, cargar sus vehículos (solo para admin)
    if (name === 'concesionario' && value && user?.rol !== 'VENDEDOR') {
      cargarVehiculosPorConcesionario(value);
      cargarVendedoresPorConcesionario(value);
      // Limpiar vehículo seleccionado cuando cambia el concesionario
      setFormData(prev => ({
        ...prev,
        placaVehiculo: '',
        vendedor: ''
      }));
      // Limpiar información detallada del vehículo
      setVehiculoDetallado(null);
    }

    // Si se selecciona un vehículo, actualizar automáticamente el valor
    if (name === 'placaVehiculo' && value) {
      console.log('Vehículo seleccionado:', value);
      console.log('Vehículos disponibles:', vehiculos);
      
      // Buscar el vehículo por placa (ya procesado)
      const vehiculoSeleccionado = vehiculos.find(v => v.placa === value);
      console.log('Vehículo encontrado:', vehiculoSeleccionado);
      
      if (vehiculoSeleccionado) {
        // Guardar la información completa del vehículo
        setVehiculoDetallado(vehiculoSeleccionado);
        console.log('Vehículo detallado guardado:', vehiculoSeleccionado);
        
        // Notificar al usuario sobre la selección
        mostrarNotificacionInline(`Vehículo ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} seleccionado`, 'success');
        
        // Actualizar el valor del vehículo si está disponible
        const valorVehiculo = vehiculoSeleccionado.valor;
        if (typeof valorVehiculo === 'number') {
          setFormData(prev => ({
            ...prev,
            valorVehiculo: valorVehiculo.toString()
          }));
          
          // Recalcular monto solicitado si hay un préstamo seleccionado
          if (prestamoSeleccionado) {
            const valorEntrada = parseFloat(formData.valorEntrada) || 0;
            const nuevoMontoSolicitado = valorVehiculo - valorEntrada;
            
            // Validar que esté dentro de los rangos del préstamo
            let montoFinal = nuevoMontoSolicitado;
            
            if (nuevoMontoSolicitado < prestamoSeleccionado.montoMinimo) {
              montoFinal = prestamoSeleccionado.montoMinimo;
            } else if (nuevoMontoSolicitado > prestamoSeleccionado.montoMaximo) {
              montoFinal = prestamoSeleccionado.montoMaximo;
            }
            
            setFormData(prev => ({
              ...prev,
              montoSolicitado: montoFinal.toString()
            }));
          }
        }
      } else {
        console.log('No se encontró el vehículo con placa:', value);
      }
    }

    // Si cambia el valor de entrada, recalcular monto solicitado
    if (name === 'valorEntrada' && prestamoSeleccionado) {
      const valorVehiculo = parseFloat(formData.valorVehiculo) || 0;
      const nuevaEntrada = parseFloat(value) || 0;
      const nuevoMontoSolicitado = valorVehiculo - nuevaEntrada;
      
      console.log('Cambio en valor de entrada:', {
        valorVehiculo,
        nuevaEntrada,
        nuevoMontoSolicitado,
        montoMinimo: prestamoSeleccionado.montoMinimo,
        montoMaximo: prestamoSeleccionado.montoMaximo
      });
      
      // Validar que esté dentro de los rangos del préstamo
      let montoFinal = nuevoMontoSolicitado;
      let entradaSugerida = nuevaEntrada;
      
      if (nuevoMontoSolicitado < prestamoSeleccionado.montoMinimo) {
        // Calcular la entrada sugerida para llegar a un valor intermedio
        const rangoDisponible = prestamoSeleccionado.montoMaximo - prestamoSeleccionado.montoMinimo;
        const montoIntermedio = prestamoSeleccionado.montoMinimo + (rangoDisponible * 0.7);
        entradaSugerida = valorVehiculo - montoIntermedio;
        // NO ajustar el montoFinal, mantener el monto real
        montoFinal = nuevoMontoSolicitado;
        
        console.log('Monto menor al mínimo, entrada sugerida intermedia:', entradaSugerida);
      } else if (nuevoMontoSolicitado > prestamoSeleccionado.montoMaximo) {
        // Calcular la entrada sugerida para llegar a un valor intermedio
        const rangoDisponible = prestamoSeleccionado.montoMaximo - prestamoSeleccionado.montoMinimo;
        const montoIntermedio = prestamoSeleccionado.montoMinimo + (rangoDisponible * 0.7);
        entradaSugerida = valorVehiculo - montoIntermedio;
        // NO ajustar el montoFinal, mantener el monto real
        montoFinal = nuevoMontoSolicitado;
        
        console.log('Monto mayor al máximo, entrada sugerida intermedia:', entradaSugerida);
      }
      
      setFormData(prev => ({
        ...prev,
        montoSolicitado: montoFinal.toString()
      }));
      
      // Guardar la entrada sugerida para mostrarla en la UI
      setEntradaSugerida(entradaSugerida);
    }

    // Si se selecciona un tipo de préstamo, cargar sus plazos disponibles
    if (name === 'tipoCredito' && value) {
      const prestamo = prestamos.find(p => p.id === value);
      if (prestamo) {
        setPrestamoSeleccionado(prestamo);
        
        // Generar array de plazos desde plazo mínimo hasta plazo máximo
        const plazos = [];
        for (let i = prestamo.plazoMinimoMeses; i <= prestamo.plazoMaximoMeses; i++) {
          plazos.push(i);
        }
        setPlazosDisponibles(plazos);
        
        // Calcular valor de entrada por defecto para cumplir con el monto mínimo
        const valorEntradaPorDefecto = calcularValorEntradaPorDefecto(prestamo);
        
        // Calcular el monto intermedio por defecto
        const rangoDisponible = prestamo.montoMaximo - prestamo.montoMinimo;
        const montoIntermedio = prestamo.montoMinimo + (rangoDisponible * 0.7);
        
        // Establecer el plazo mínimo y valor de entrada por defecto
        setFormData(prev => ({
          ...prev,
          plazoMeses: prestamo.plazoMinimoMeses.toString(),
          valorEntrada: valorEntradaPorDefecto.toString(),
          montoSolicitado: montoIntermedio.toString()
        }));
        
        // Limpiar entrada sugerida al seleccionar nuevo préstamo
        setEntradaSugerida(null);
        
        // Notificar al usuario sobre la selección
        mostrarNotificacionInline(`Préstamo "${prestamo.nombre}" seleccionado`, 'success');
        
        console.log('Préstamo seleccionado:', prestamo);
        console.log('Valor de entrada por defecto:', valorEntradaPorDefecto);
      }
    }
  };

  // Función para calcular el valor de entrada por defecto
  const calcularValorEntradaPorDefecto = (prestamo: any) => {
    const valorVehiculo = parseFloat(formData.valorVehiculo) || 0;
    
    // Calcular entrada para que el monto solicitado sea un valor intermedio (no el mínimo)
    // Usar el 70% del rango disponible para tener un margen cómodo
    const rangoDisponible = prestamo.montoMaximo - prestamo.montoMinimo;
    const montoIntermedio = prestamo.montoMinimo + (rangoDisponible * 0.7);
    const entradaPorDefecto = valorVehiculo - montoIntermedio;
    
    console.log('Calculando entrada por defecto:', {
      valorVehiculo,
      montoMinimo: prestamo.montoMinimo,
      montoMaximo: prestamo.montoMaximo,
      montoIntermedio,
      entradaPorDefecto
    });
    
    return Math.max(0, entradaPorDefecto);
  };



  // Función para cargar vendedores por concesionario
  const cargarVendedoresPorConcesionario = async (rucConcesionario: string) => {
    setLoadingVendedores(true);
    setErrorVendedores(null);

    try {
      const vendedoresData = await getVendedoresByRuc(rucConcesionario);
      console.log('Vendedores cargados:', vendedoresData);
      
      // Filtrar solo vendedores activos
      const vendedoresActivos = vendedoresData.filter((vendedor: any) => vendedor.estado === 'ACTIVO');
      setVendedores(vendedoresActivos);
    } catch (err: any) {
      console.error('Error al cargar vendedores del concesionario:', err);
      setErrorVendedores('Error al cargar los vendedores del concesionario seleccionado');
      setVendedores([]);
    } finally {
      setLoadingVendedores(false);
    }
  };

  // Función para validar que todos los campos requeridos estén completos
  const validarCamposRequeridos = () => {
    const camposRequeridos = [
      formData.cedula,
      formData.nombres,
      formData.capacidadPago,
      formData.calificacionBuro,
      formData.tipoCredito,
      formData.placaVehiculo,
      formData.valorEntrada,
      formData.plazoMeses
    ];

    // Para vendedores, verificar que tengan información del vendedor cargada
    if (user?.rol === 'VENDEDOR') {
      // Verificar que la información del vendedor esté cargada y el formulario actualizado
      return camposRequeridos.every(campo => campo && campo.trim() !== '') && 
             vendedorInfo && concesionarioInfo && formData.concesionario;
    } else {
      // Para admin, también validar que haya seleccionado concesionario y vendedor
      camposRequeridos.push(formData.concesionario, formData.vendedor);
      return camposRequeridos.every(campo => campo && campo.trim() !== '');
    }
  };

  // Función para calcular el monto mensual de la cuota
  const calcularCuotaMensual = () => {
    if (!prestamoSeleccionado) return 0;
    
    const montoSolicitado = parseFloat(formData.valorVehiculo) - parseFloat(formData.valorEntrada);
    const tasaInteres = prestamoSeleccionado.tasaInteres / 100; // Convertir porcentaje a decimal
    const plazoMeses = parseFloat(formData.plazoMeses);
    
    // Fórmula de cuota mensual: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // Donde: P = principal, r = tasa mensual, n = número de meses
    const tasaMensual = tasaInteres / 12;
    const numerador = tasaMensual * Math.pow(1 + tasaMensual, plazoMeses);
    const denominador = Math.pow(1 + tasaMensual, plazoMeses) - 1;
    
    if (denominador === 0) return 0;
    
    const cuotaMensual = montoSolicitado * (numerador / denominador);
    
    // Redondear a 3 decimales
    const cuotaRedondeada = Math.round(cuotaMensual * 1000) / 1000;
    
    console.log('Cálculo de cuota mensual:', {
      montoSolicitado,
      tasaInteres,
      tasaMensual,
      plazoMeses,
      cuotaMensual,
      cuotaRedondeada
    });
    
    return cuotaRedondeada;
  };

  // Función para validar capacidad de pago
  const validarCapacidadPago = () => {
    const capacidadPago = parseFloat(formData.capacidadPago) || 0;
    const cuotaMensual = calcularCuotaMensual();
    
    console.log('Validación de capacidad de pago:', {
      capacidadPago,
      cuotaMensual,
      esValido: capacidadPago >= cuotaMensual
    });
    
    return capacidadPago >= cuotaMensual;
  };

  // Función para validar que el monto solicitado esté dentro del rango del préstamo
  const validarMontoSolicitado = () => {
    if (!prestamoSeleccionado) return false;
    
    const valorVehiculo = parseFloat(formData.valorVehiculo) || 0;
    const valorEntrada = parseFloat(formData.valorEntrada) || 0;
    const montoSolicitado = valorVehiculo - valorEntrada;
    
    const montoMinimo = prestamoSeleccionado.montoMinimo;
    const montoMaximo = prestamoSeleccionado.montoMaximo;
    
    console.log('Validación de monto solicitado:', {
      montoSolicitado,
      montoMinimo,
      montoMaximo,
      esValido: montoSolicitado >= montoMinimo && montoSolicitado <= montoMaximo
    });
    
    return montoSolicitado >= montoMinimo && montoSolicitado <= montoMaximo;
  };

  // Cargar información del vendedor logueado usando los endpoints específicos
  const cargarInfoVendedor = async () => {
    if (!user?.email) {
      console.log('Usuario no tiene email:', user);
      return;
    }

    setLoadingVendedorInfo(true);
    try {
      console.log('🔄 Cargando información del vendedor con email:', user.email);
      
      // Paso 1: Obtener información del concesionario usando el email del vendedor
      const concesionarioResponse = await fetch(`http://localhost:8080/api/concesionarios/v1/vendedor-email/${user.email}`);
      
      if (!concesionarioResponse.ok) {
        throw new Error(`Error al obtener concesionario: ${concesionarioResponse.statusText}`);
      }
      
      const concesionarioData = await concesionarioResponse.json();
      console.log('✅ Información del concesionario obtenida:', concesionarioData);
      setConcesionarioInfo(concesionarioData);
      
      // Paso 2: Obtener información del vendedor usando RUC y email
      const vendedorResponse = await fetch(`http://localhost:8080/api/concesionarios/v1/ruc/${concesionarioData.ruc}/vendedores/email/${encodeURIComponent(user.email)}`);
      
      if (!vendedorResponse.ok) {
        throw new Error(`Error al obtener vendedor: ${vendedorResponse.statusText}`);
      }
      
      const vendedorData = await vendedorResponse.json();
      console.log('✅ Información del vendedor obtenida:', vendedorData);
      setVendedorInfo(vendedorData);
      
      // Paso 3: Actualizar el formulario con la información del vendedor
      setFormData(prev => ({
        ...prev,
        concesionario: concesionarioData.ruc,
        vendedor: vendedorData.id || vendedorData.cedula // Usar el ID o cédula según disponible
      }));
      
      // Paso 4: Cargar vehículos del concesionario automáticamente
      console.log('🚗 Cargando vehículos para RUC:', concesionarioData.ruc);
      cargarVehiculosPorConcesionario(concesionarioData.ruc);
      
    } catch (error) {
      console.error('❌ Error al cargar información del vendedor:', error);
      setErrorVehiculos(`Error al cargar información del vendedor: ${error.message}`);
    } finally {
      setLoadingVendedorInfo(false);
    }
  };

  // Cargar préstamos y información del vendedor al montar el componente
  useEffect(() => {
    cargarPrestamos();
    if (user?.rol === 'VENDEDOR' && user?.email) {
      cargarInfoVendedor();
    } else if (user?.rol !== 'VENDEDOR') {
      // Si es admin, cargar concesionarios
      cargarConcesionarios();
    }
  }, [user]);

  const cargarPrestamos = async () => {
    setLoadingPrestamos(true);
    setErrorPrestamos(null);

    try {
      const prestamosData = await prestamoService.obtenerPrestamosActivos();
      // Usar todos los préstamos (asumir que la API ya devuelve solo activos)
      setPrestamos(prestamosData);
    } catch (err: any) {
      console.error('Error al cargar préstamos:', err);
      setErrorPrestamos('Error al cargar los tipos de préstamo disponibles');
    } finally {
      setLoadingPrestamos(false);
    }
  };

  const cargarConcesionarios = async () => {
    setLoadingVehiculos(true);
    setErrorVehiculos(null);

    try {
      // Obtener concesionarios activos (solo para admin)
      const concesionariosData = await getConcesionariosByEstado('ACTIVO');
      setConcesionarios(concesionariosData.map((c: any) => ({ ruc: c.ruc, razonSocial: c.razonSocial })));
      
      // Inicialmente no cargar vehículos hasta que se seleccione un concesionario
      setVehiculos([]);
    } catch (err: any) {
      console.error('Error al cargar concesionarios:', err);
      setErrorVehiculos('Error al cargar los concesionarios disponibles');
    } finally {
      setLoadingVehiculos(false);
    }
  };

  const cargarVehiculosPorConcesionario = async (rucConcesionario: string) => {
    setLoadingVehiculosConcesionario(true);
    setErrorVehiculos(null);

    try {
      const vehiculosConcesionario = await getVehiculosByRuc(rucConcesionario);
      console.log('Vehículos del concesionario:', vehiculosConcesionario);
      
      // Filtrar solo vehículos disponibles y procesar la estructura
      const vehiculosDisponibles = vehiculosConcesionario
        .filter(vehiculo => vehiculo.estado === 'DISPONIBLE')
        .map(vehiculo => ({
          ...vehiculo,
          // Asegurar que placa, chasis y motor estén en el nivel principal
          placa: vehiculo.placa || vehiculo.identificadorVehiculo?.placa || '',
          chasis: vehiculo.chasis || vehiculo.identificadorVehiculo?.chasis || '',
          motor: vehiculo.motor || vehiculo.identificadorVehiculo?.motor || '',
        }));
      
      console.log('Vehículos procesados:', vehiculosDisponibles);
      setVehiculos(vehiculosDisponibles);
    } catch (err: any) {
      console.error('Error al cargar vehículos del concesionario:', err);
      setErrorVehiculos('Error al cargar los vehículos del concesionario seleccionado');
    } finally {
      setLoadingVehiculosConcesionario(false);
    }
  };

  const consultarRiesgoCrediticio = async () => {
    if (!formData.cedula.trim()) {
      setErrorRiesgo('Por favor, ingrese una cédula');
      showToast('Por favor, ingrese una cédula antes de consultar', 'warning');
      return;
    }

    setLoadingRiesgo(true);
    setErrorRiesgo(null);
    setRiesgoCrediticio(null);

    try {
      console.log('🔄 Consultando riesgo crediticio para cédula:', formData.cedula);
      const resultado = await riesgoCreditoService.consultarPorCedula(formData.cedula);
      console.log('✅ Resultado de riesgo crediticio:', resultado);
      
      setRiesgoCrediticio(resultado);
      
      // Actualizar el formulario con la información real del cliente
      setFormData(prev => ({
        ...prev,
        nombres: resultado.nombreCliente,
        capacidadPago: resultado.capacidadPago.toString(),
        calificacionBuro: resultado.calificacionRiesgo,
        direccion: `Cliente: ${resultado.nombreCliente}` // Temporal
      }));
      
      showToast('Consulta realizada exitosamente', 'success');
      
    } catch (err: any) {
      console.error('❌ Error al consultar riesgo crediticio:', err);
      const mensaje = err.response?.data || 'Error al consultar el riesgo crediticio. Verifique la cédula e intente nuevamente.';
      setErrorRiesgo(mensaje);
      showToast(mensaje, 'error');
    } finally {
      setLoadingRiesgo(false);
    }
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarCamposRequeridos()) {
      showToast('Por favor complete todos los campos requeridos antes de crear la solicitud', 'warning');
      return;
    }
    
    if (!validarCapacidadPago()) {
      showToast('La capacidad de pago no es suficiente para la cuota mensual calculada', 'error');
      return;
    }
    
    if (!prestamoSeleccionado) {
      showToast('Por favor seleccione un tipo de crédito antes de continuar', 'warning');
      return;
    }
    
    if (!validarMontoSolicitado()) {
      showToast('El monto solicitado está fuera del rango permitido para este tipo de préstamo', 'error');
      return;
    }

    setCreandoSolicitud(true);
    showToast('Procesando solicitud de crédito...', 'info');

    try {
      // Obtener la cédula del vendedor
      let cedulaVendedor = "";
      if (user?.rol === 'VENDEDOR' && vendedorInfo) {
        // Si es vendedor logueado, usar su cédula
        cedulaVendedor = vendedorInfo.cedula;
      } else {
        // Si es admin, obtener del vendedor seleccionado
        const vendedorSeleccionado = vendedores.find(v => v.id === formData.vendedor);
        cedulaVendedor = vendedorSeleccionado ? vendedorSeleccionado.cedula : "";
      }

      // Preparar los datos de la solicitud según la estructura requerida
      const solicitudData: CrearSolicitudRequestDTO = {
        cedulaSolicitante: formData.cedula,
        idPrestamo: prestamoSeleccionado.id,
        placaVehiculo: formData.placaVehiculo,
        rucConcesionario: formData.concesionario,
        cedulaVendedor: cedulaVendedor,
        valorEntrada: parseFloat(formData.valorEntrada),
        plazoMeses: parseInt(formData.plazoMeses),
        calificacionSolicitante: formData.calificacionBuro,
        capacidadPagoSolicitante: parseFloat(formData.capacidadPago)
      };

      console.log('Enviando solicitud:', solicitudData);

      // Enviar la solicitud usando el servicio de originación
      const result = await originacionService.crearSolicitud(solicitudData);
      console.log('Solicitud creada exitosamente:', result);
      
      // Mostrar toast de éxito primero
      showToast('¡Solicitud creada exitosamente!', 'success');
      
      // Mostrar modal de éxito
      setResultadoSolicitud({
        exito: true,
        titulo: '¡Solicitud Creada Exitosamente!',
        mensaje: 'Su solicitud de crédito automotriz ha sido procesada correctamente.',
        numeroSolicitud: result.numeroSolicitud || 'N/A',
        detalles: {
          cliente: riesgoCrediticio?.nombreCliente || formData.nombres,
          monto: (parseFloat(formData.valorVehiculo) || 0) - (parseFloat(formData.valorEntrada) || 0),
          plazo: formData.plazoMeses,
          vehiculo: vehiculoDetallado ? `${vehiculoDetallado.marca} ${vehiculoDetallado.modelo} - ${vehiculoDetallado.placa}` : 'N/A'
        }
      });
      setModalResultadoAbierto(true);
      
    } catch (error: any) {
      console.error('Error al crear la solicitud:', error);
      
      // Extraer mensaje de error más específico
      let mensajeError = 'Ha ocurrido un error inesperado al procesar su solicitud.';
      if (error?.response?.data?.mensaje) {
        mensajeError = error.response.data.mensaje;
      } else if (error?.message) {
        mensajeError = error.message;
      }
      
      setResultadoSolicitud({
        exito: false,
        titulo: 'Error al Crear Solicitud',
        mensaje: mensajeError,
        detalles: {
          codigo: error?.response?.status || 'N/A',
          timestamp: new Date().toLocaleString('es-CO')
        }
      });
      setModalResultadoAbierto(true);
    } finally {
      setCreandoSolicitud(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Solicitud de Crédito</h1>
          <p className="text-gray-600 mt-2">Complete la información para procesar su solicitud</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Solicitante */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <PersonIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Información del Solicitante</h2>
                <p className="text-sm text-gray-500">Consulte la información del cliente por cédula</p>
              </div>
            </div>

            {/* Consulta por cédula */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula del Cliente</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleInputChange}
                    placeholder="Ingrese la cédula del cliente"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={consultarRiesgoCrediticio}
                  loading={loadingRiesgo}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <SearchIcon />
                  <span>Consultar</span>
                </Button>
              </div>
              
              {errorRiesgo && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  {errorRiesgo}
                </div>
              )}
            </div>

            {/* Información del riesgo crediticio */}
            {riesgoCrediticio && (
              <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-medium text-green-800 mb-6 text-center">✓ Información del Cliente Encontrada</h3>
                
                {/* Calificación de Riesgo */}
                <div className="text-center mb-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Calificación de Riesgo
                  </h4>
                  <div className="space-y-3">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-xl shadow-lg ${getCalificacionColor(riesgoCrediticio.calificacionRiesgo)}`}>
                      <span className="text-white text-3xl font-bold">
                        {riesgoCrediticio.calificacionRiesgo}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {getCalificacionText(riesgoCrediticio.calificacionRiesgo)}
                    </div>
                    
                    {/* Barra de progreso de riesgo */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Bajo Riesgo</span>
                        <span>Alto Riesgo</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getRiesgoBarColor(riesgoCrediticio.calificacionRiesgo)}`}
                          style={{ width: `${getRiesgoPercentage(riesgoCrediticio.calificacionRiesgo)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {getRiesgoPercentage(riesgoCrediticio.calificacionRiesgo)}% de riesgo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacidad de Pago */}
                <div className="text-center mb-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Capacidad de Pago
                  </h4>
                  <div className="text-3xl font-bold text-green-600">
                    ${riesgoCrediticio.capacidadPago.toLocaleString()}
                  </div>
                </div>

                {/* Información Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Capacidad de pago:</p>
                      <p>
                        Se refiere al máximo que una persona puede pagar un crédito, 
                        generalmente hasta el 30% de la diferencia entre ingresos y egresos mensuales.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información del Cliente */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Información del Cliente</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <p className="font-medium">{riesgoCrediticio.nombreCliente}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cédula:</span>
                      <p className="font-medium">{riesgoCrediticio.cedulaCliente}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Tipo de Crédito */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <DocumentIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tipo de Crédito</h2>
                <p className="text-sm text-gray-500">Seleccione el tipo de préstamo</p>
              </div>
            </div>

            {loadingPrestamos && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Cargando tipos de préstamo...</p>
              </div>
            )}

            {errorPrestamos && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errorPrestamos}</p>
                <Button
                  onClick={cargarPrestamos}
                  className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white"
                >
                  Reintentar
                </Button>
              </div>
            )}

            {!loadingPrestamos && !errorPrestamos && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Crédito</label>
                  <select
                    name="tipoCredito"
                    value={formData.tipoCredito}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione un tipo de préstamo</option>
                    {prestamos.map((prestamo) => (
                      <option key={prestamo.id} value={prestamo.id}>
                        {prestamo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Información del préstamo seleccionado */}
                {formData.tipoCredito && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Préstamo</h3>
                    {(() => {
                      const prestamoSeleccionado = prestamos.find(p => p.id === formData.tipoCredito);
                      if (!prestamoSeleccionado) return null;
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Descripción:</span>
                            <p className="font-medium text-sm">{prestamoSeleccionado.descripcion}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Tasa de Interés:</span>
                            <p className="font-medium text-sm">{prestamoSeleccionado.tasaInteres}%</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Monto Mínimo:</span>
                            <p className="font-medium text-sm">$ {prestamoSeleccionado.montoMinimo.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Monto Máximo:</span>
                            <p className="font-medium text-sm">$ {prestamoSeleccionado.montoMaximo.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Plazo Mínimo:</span>
                            <p className="font-medium text-sm">{prestamoSeleccionado.plazoMinimoMeses} meses</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Plazo Máximo:</span>
                            <p className="font-medium text-sm">{prestamoSeleccionado.plazoMaximoMeses} meses</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Estado:</span>
                            <p className="font-medium text-sm">Activo</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Información del Vehículo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <CarIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Información del Vehículo</h2>
                <p className="text-sm text-gray-500">Seleccione un vehículo disponible</p>
              </div>
            </div>

            {loadingVehiculos && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                <p className="text-sm text-gray-600 mt-2">Cargando vehículos disponibles...</p>
              </div>
            )}

            {errorVehiculos && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errorVehiculos}</p>
                                 <Button
                   onClick={cargarConcesionarios}
                   className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white"
                 >
                  Reintentar
                </Button>
              </div>
            )}

                         {!loadingVehiculos && !errorVehiculos && (
               <div className="space-y-4">
                 {/* Solo mostrar selectores si es ADMIN */}
                 {user?.rol !== 'VENDEDOR' && (
                   <>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Concesionario</label>
                       <select
                         name="concesionario"
                         value={formData.concesionario}
                         onChange={handleInputChange}
                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       >
                         <option value="">Seleccione un concesionario</option>
                         {concesionarios.map((concesionario) => (
                           <option key={concesionario.ruc} value={concesionario.ruc}>
                             {concesionario.razonSocial} - {concesionario.ruc}
                           </option>
                         ))}
                       </select>
                     </div>

                     {/* Selector de Vendedor */}
                     {formData.concesionario && (
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Vendedor</label>
                         {loadingVendedores ? (
                           <div className="text-center py-4">
                             <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                             <p className="text-sm text-gray-600 mt-2">Cargando vendedores del concesionario...</p>
                           </div>
                         ) : (
                           <select
                             name="vendedor"
                             value={formData.vendedor}
                             onChange={handleInputChange}
                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           >
                             <option value="">Seleccione un vendedor</option>
                             {vendedores.map((vendedor) => (
                               <option key={vendedor.id} value={vendedor.id}>
                                 {vendedor.nombre} - {vendedor.cedula}
                               </option>
                             ))}
                           </select>
                         )}
                         
                         {errorVendedores && (
                           <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                             <p className="text-sm text-red-600">{errorVendedores}</p>
                             <Button
                               onClick={() => cargarVendedoresPorConcesionario(formData.concesionario)}
                               className="mt-1 text-xs bg-red-600 hover:bg-red-700 text-white"
                             >
                               Reintentar
                             </Button>
                           </div>
                         )}
                       </div>
                     )}
                   </>
                 )}

                 {/* Mostrar información del vendedor logueado */}
                 {user?.rol === 'VENDEDOR' && (
                   <div className="space-y-4">
                     {/* Información del vendedor */}
                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                       <h4 className="text-md font-medium text-blue-800 mb-2">👤 Vendedor Logueado</h4>
                       <div className="text-sm text-gray-700">
                         <p>Como vendedor logueado, solo puede crear solicitudes para vehículos de su concesionario.</p>
                         {loadingVendedorInfo ? (
                           <div className="mt-2 flex items-center">
                             <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                             <span>Cargando información del vendedor...</span>
                           </div>
                         ) : vendedorInfo && concesionarioInfo ? (
                           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-600">
                             <p><strong>Vendedor:</strong> {vendedorInfo.nombre}</p>
                             <p><strong>Cédula:</strong> {vendedorInfo.cedula}</p>
                             <p><strong>Concesionario:</strong> {concesionarioInfo.razonSocial}</p>
                             <p><strong>RUC:</strong> {concesionarioInfo.ruc}</p>
                           </div>
                         ) : null}
                       </div>
                     </div>


                   </div>
                 )}

                                 {(formData.concesionario || (user?.rol === 'VENDEDOR' && concesionarioInfo)) && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Vehículo</label>
                    {loadingVehiculosConcesionario ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                        <p className="text-sm text-gray-600 mt-2">Cargando vehículos del concesionario...</p>
                      </div>
                    ) : (
                      <select
                        name="placaVehiculo"
                        value={formData.placaVehiculo}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccione un vehículo</option>
                        {vehiculos.map((vehiculo) => (
                          <option key={vehiculo.id} value={vehiculo.placa}>
                            {vehiculo.marca} {vehiculo.modelo} - {vehiculo.anio} - {vehiculo.placa}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                                 {/* Información del concesionario y vendedor seleccionado (solo para ADMIN) */}
                 {user?.rol !== 'VENDEDOR' && formData.concesionario && (
                   <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                     <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Concesionario</h3>
                     {(() => {
                       const concesionarioSeleccionado = concesionarios.find(c => c.ruc === formData.concesionario);
                       if (!concesionarioSeleccionado) return null;
                       
                       return (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <span className="text-sm text-gray-600">Razón Social:</span>
                             <p className="font-medium text-sm">{concesionarioSeleccionado.razonSocial}</p>
                           </div>
                           <div>
                             <span className="text-sm text-gray-600">RUC:</span>
                             <p className="font-medium text-sm">{concesionarioSeleccionado.ruc}</p>
                           </div>
                         </div>
                       );
                     })()}
                     
                     {/* Información del vendedor seleccionado */}
                     {formData.vendedor && (
                       <div className="mt-4 pt-4 border-t border-purple-200">
                         <h4 className="text-md font-medium text-gray-900 mb-2">Vendedor Asignado</h4>
                         {(() => {
                           const vendedorSeleccionado = vendedores.find(v => v.id === formData.vendedor);
                           if (!vendedorSeleccionado) return null;
                           
                           return (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                 <span className="text-sm text-gray-600">Nombre:</span>
                                 <p className="font-medium text-sm">{vendedorSeleccionado.nombre}</p>
                               </div>
                               <div>
                                 <span className="text-sm text-gray-600">Cédula:</span>
                                 <p className="font-medium text-sm">{vendedorSeleccionado.cedula}</p>
                               </div>
                               <div>
                                 <span className="text-sm text-gray-600">Teléfono:</span>
                                 <p className="font-medium text-sm">{vendedorSeleccionado.telefono}</p>
                               </div>
                               <div>
                                 <span className="text-sm text-gray-600">Email:</span>
                                 <p className="font-medium text-sm">{vendedorSeleccionado.email}</p>
                               </div>
                             </div>
                           );
                         })()}
                       </div>
                     )}
                   </div>
                 )}

                {/* Información del vehículo seleccionado */}
                {vehiculoDetallado && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">🚗 Detalles del Vehículo Seleccionado</h3>
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Disponible
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Información Principal */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">📋</span>
                          Información General
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Marca</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.marca}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Modelo</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.modelo}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Año</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.anio}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Color</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.color || 'No especificado'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Condición</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              vehiculoDetallado.condicion === 'NUEVO' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {vehiculoDetallado.condicion}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Tipo</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.tipo || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Especificaciones Técnicas */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">⚙️</span>
                          Especificaciones Técnicas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Combustible</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.combustible || 'No especificado'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Cilindraje</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.cilindraje || 'No especificado'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Extras</span>
                            <p className="font-semibold text-gray-900">{vehiculoDetallado.extras || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Identificadores */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">🔍</span>
                          Identificadores
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Placa</span>
                            <p className="font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                              {vehiculoDetallado.placa}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Chasis</span>
                            <p className="font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                              {vehiculoDetallado.chasis}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Motor</span>
                            <p className="font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                              {vehiculoDetallado.motor}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Valor del Vehículo */}
                      {vehiculoDetallado.valor && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">💰</span>
                            Valor del Vehículo
                          </h4>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">
                              $ {vehiculoDetallado.valor.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Valor comercial actual</p>
                          </div>
                        </div>
                      )}

                      {/* Estado del Vehículo */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">📊</span>
                          Estado del Vehículo
                        </h4>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            vehiculoDetallado.estado === 'DISPONIBLE' 
                              ? 'bg-green-100 text-green-800' 
                              : vehiculoDetallado.estado === 'VENDIDO'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {vehiculoDetallado.estado}
                          </span>
                          <span className="text-sm text-gray-600">
                            Última actualización: {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cálculo del Crédito */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <CalculatorIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cálculo del Crédito</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor de la Entrada</label>
                <div className="relative">
                  <input
                    type="text"
                    name="valorEntrada"
                    value={formData.valorEntrada}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {entradaSugerida !== null && entradaSugerida !== parseFloat(formData.valorEntrada) && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
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
                {entradaSugerida !== null && entradaSugerida !== parseFloat(formData.valorEntrada) && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Valor sugerido: ${entradaSugerida.toLocaleString()} para cumplir con el rango del préstamo
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (Meses)</label>
                <select
                  name="plazoMeses"
                  value={formData.plazoMeses}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!prestamoSeleccionado}
                >
                  {!prestamoSeleccionado ? (
                    <option value="">Seleccione un tipo de crédito primero</option>
                  ) : (
                    plazosDisponibles.map(plazo => (
                      <option key={plazo} value={plazo.toString()}>
                        {plazo} meses
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Panel de resumen */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Resumen del Crédito</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor del Vehículo:</span>
                  <span className="font-medium text-green-600">{formatCurrency(parseFloat(formData.valorVehiculo) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor de Entrada:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(parseFloat(formData.valorEntrada) || 0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-900 font-medium">Monto Solicitado:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency((parseFloat(formData.valorVehiculo) || 0) - (parseFloat(formData.valorEntrada) || 0))}</span>
                </div>
                
                {/* Información de la cuota mensual */}
                {prestamoSeleccionado && (
                  <div className="pt-2 border-t border-green-200">
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-medium">Cuota Mensual:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(calcularCuotaMensual())}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">Capacidad de Pago:</span>
                      <span className={`text-sm font-medium ${validarCapacidadPago() ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(parseFloat(formData.capacidadPago) || 0)}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Información del préstamo seleccionado */}
                {prestamoSeleccionado && (
                  <>
                    <div className="pt-2 border-t border-green-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Información del Préstamo</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tipo:</span>
                          <span className="font-medium">{prestamoSeleccionado.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tasa de Interés:</span>
                          <span className="font-medium">{prestamoSeleccionado.tasaInteres}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto Mínimo:</span>
                          <span className="font-medium text-blue-600">{formatCurrency(prestamoSeleccionado.montoMinimo)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto Máximo:</span>
                          <span className="font-medium text-blue-600">{formatCurrency(prestamoSeleccionado.montoMaximo)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plazo:</span>
                          <span className="font-medium">{prestamoSeleccionado.plazoMinimoMeses} - {prestamoSeleccionado.plazoMaximoMeses} meses</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Validación de rangos */}
                    {(() => {
                      const valorEntrada = parseFloat(formData.valorEntrada) || 0;
                      const valorVehiculo = parseFloat(formData.valorVehiculo) || 0;
                      const montoMinimo = prestamoSeleccionado.montoMinimo;
                      const montoMaximo = prestamoSeleccionado.montoMaximo;
                      
                      // Calcular el monto real que resultaría con la entrada actual
                      const montoReal = valorVehiculo - valorEntrada;
                      
                      if (montoReal < montoMinimo) {
                        // Calcular entrada sugerida para valor intermedio
                        const rangoDisponible = montoMaximo - montoMinimo;
                        const montoIntermedio = montoMinimo + (rangoDisponible * 0.7);
                        const entradaSugerida = valorVehiculo - montoIntermedio;
                        
                        return (
                          <div className="space-y-2">
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800 mb-2">
                                ⚠️ El valor de entrada actual hace que el monto solicitado sea menor al mínimo permitido.
                              </p>
                              <div className="text-xs text-yellow-700 space-y-1">
                                <p>• Monto que resultaría: ${montoReal.toLocaleString()}</p>
                                <p>• Monto mínimo requerido: ${montoMinimo.toLocaleString()}</p>
                                <p>• Valor de entrada sugerido: ${entradaSugerida.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            {/* Validación de capacidad de pago */}
                            {prestamoSeleccionado && (() => {
                              const capacidadPago = parseFloat(formData.capacidadPago) || 0;
                              const cuotaMensual = calcularCuotaMensual();
                              const esCapacidadValida = capacidadPago >= cuotaMensual;
                              
                              return (
                                <div className={`p-2 border rounded-md ${esCapacidadValida ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
                              );
                            })()}
                          </div>
                        );
                      } else if (montoReal > montoMaximo) {
                        // Calcular entrada sugerida para valor intermedio
                        const rangoDisponible = montoMaximo - montoMinimo;
                        const montoIntermedio = montoMinimo + (rangoDisponible * 0.7);
                        const entradaSugerida = valorVehiculo - montoIntermedio;
                        
                        return (
                          <div className="space-y-2">
                            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm text-red-800 mb-2">
                                ❌ El valor de entrada actual hace que el monto solicitado exceda el máximo permitido.
                              </p>
                              <div className="text-xs text-red-700 space-y-1">
                                <p>• Monto que resultaría: ${montoReal.toLocaleString()}</p>
                                <p>• Monto máximo permitido: ${montoMaximo.toLocaleString()}</p>
                                <p>• Valor de entrada sugerido: ${entradaSugerida.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            {/* Validación de capacidad de pago */}
                            {prestamoSeleccionado && (() => {
                              const capacidadPago = parseFloat(formData.capacidadPago) || 0;
                              const cuotaMensual = calcularCuotaMensual();
                              const esCapacidadValida = capacidadPago >= cuotaMensual;
                              
                              return (
                                <div className={`p-2 border rounded-md ${esCapacidadValida ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
                              );
                            })()}
                          </div>
                        );
                      } else {
                        // Validar capacidad de pago
                        const capacidadPago = parseFloat(formData.capacidadPago) || 0;
                        const cuotaMensual = calcularCuotaMensual();
                        const esCapacidadValida = capacidadPago >= cuotaMensual;
                        
                        return (
                          <div className="space-y-2">
                            <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-sm text-green-800">
                                ✅ El monto solicitado está dentro del rango permitido
                              </p>
                            </div>
                            
                            {/* Validación de capacidad de pago */}
                            {prestamoSeleccionado && (
                              <div className={`p-2 border rounded-md ${esCapacidadValida ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
                            )}
                          </div>
                        );
                      }
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={!validarCamposRequeridos() || !validarCapacidadPago() || !validarMontoSolicitado() || !prestamoSeleccionado || creandoSolicitud}
              className={`px-8 py-3 text-lg font-medium ${
                validarCamposRequeridos() && validarCapacidadPago() && validarMontoSolicitado() && prestamoSeleccionado && !creandoSolicitud
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {creandoSolicitud ? (
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                !validarCamposRequeridos()
                  ? 'Complete todos los campos'
                  : !prestamoSeleccionado 
                    ? 'Seleccione un tipo de crédito' 
                    : !validarMontoSolicitado()
                      ? 'Monto fuera del rango permitido'
                      : !validarCapacidadPago() 
                        ? 'Capacidad de pago insuficiente' 
                        : 'Crear Solicitud de Crédito'
              )}
            </Button>
            
            {!validarMontoSolicitado() && prestamoSeleccionado && (
              <p className="text-sm text-red-600 mt-2">
                El monto solicitado está fuera del rango permitido para este tipo de préstamo
              </p>
            )}
            {!validarCapacidadPago() && prestamoSeleccionado && validarMontoSolicitado() && (
              <p className="text-sm text-red-600 mt-2">
                La capacidad de pago del cliente no permite crear esta solicitud
              </p>
            )}
          </div>
        </form>

        {/* Modal de Resultado */}
        {modalResultadoAbierto && resultadoSolicitud && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={cerrarModalYRedirigir}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className={`flex justify-between items-center p-6 border-b ${
                resultadoSolicitud.exito ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    resultadoSolicitud.exito ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {resultadoSolicitud.exito ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${
                      resultadoSolicitud.exito ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {resultadoSolicitud.titulo}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={cerrarModalYRedirigir}
                  className={`text-gray-400 hover:text-gray-600 transition-colors ${
                    resultadoSolicitud.exito ? 'hover:text-green-600' : 'hover:text-red-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-6">{resultadoSolicitud.mensaje}</p>

                {/* Mostrar número de solicitud si es exitoso */}
                {resultadoSolicitud.exito && resultadoSolicitud.numeroSolicitud && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-800">Número de Solicitud:</span>
                    </div>
                    <p className="text-xl font-bold text-blue-900 mt-1 font-mono">
                      {resultadoSolicitud.numeroSolicitud}
                    </p>
                  </div>
                )}

                {/* Detalles de la solicitud */}
                {resultadoSolicitud.detalles && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      {resultadoSolicitud.exito ? 'Resumen de la Solicitud' : 'Detalles del Error'}
                    </h3>
                    
                    {resultadoSolicitud.exito ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cliente:</span>
                          <span className="font-medium">{resultadoSolicitud.detalles.cliente}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto Solicitado:</span>
                          <span className="font-medium text-green-600">
                            ${resultadoSolicitud.detalles.monto?.toLocaleString('es-CO')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plazo:</span>
                          <span className="font-medium">{resultadoSolicitud.detalles.plazo} meses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehículo:</span>
                          <span className="font-medium">{resultadoSolicitud.detalles.vehiculo}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Código de Error:</span>
                          <span className="font-medium text-red-600">{resultadoSolicitud.detalles.codigo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha/Hora:</span>
                          <span className="font-medium">{resultadoSolicitud.detalles.timestamp}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mensaje adicional para éxito */}
                {resultadoSolicitud.exito && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-green-700">
                        <p className="font-medium mb-1">¿Qué sigue?</p>
                        <ul className="space-y-1">
                          <li>• Su solicitud será evaluada por nuestro equipo de análisis</li>
                          <li>• Recibirá una notificación sobre el estado de su solicitud</li>
                          <li>• Puede consultar el progreso en la sección "Solicitudes"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Información de navegación */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">💡 Navegación Automática</p>
                      <p>Al cerrar este modal, será redirigido automáticamente a la página de solicitudes donde podrá ver el estado de todas sus solicitudes.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                {resultadoSolicitud.exito ? (
                  <>
                    <Button
                      onClick={() => {
                        setModalResultadoAbierto(false);
                        // Resetear formulario para crear otra solicitud
                        window.location.reload();
                      }}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Crear Otra Solicitud
                    </Button>
                    <Button
                      onClick={cerrarModalYRedirigir}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Ver Mis Solicitudes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={cerrarModalYRedirigir}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Volver a Solicitudes
                    </Button>
                    <Button
                      onClick={() => setModalResultadoAbierto(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Intentar Nuevamente
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLoanPage; 