import { api } from './api';
import { MICROSERVICES } from '../constants';

// Tipos basados en la respuesta real del API
export interface SolicitudCredito {
  idSolicitud: number;
  numeroSolicitud: string;
  estado: string;
  fechaSolicitud: string;
  montoSolicitado: number;
  plazoMeses: number;
  placaVehiculo: string;
  rucConcesionario: string;
  cedulaVendedor: string;
  idPrestamo: string;
  cedulaSolicitante: string;
}

export interface SolicitudConsultaRequest {
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
  cedulaVendedor?: string;
  rucConcesionario?: string;
  pagina: number;
  tamanoPagina: number;
}

export interface SolicitudConsultaResponse {
  solicitudes: SolicitudCredito[];
  paginaActual: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}

export interface SolicitudCreditoDTO {
  cedulaSolicitante: string;
  placaVehiculo: string;
  rucConcesionario: string;
  cedulaVendedor: string;
  montoSolicitado: number;
  plazoMeses: number;
  idPrestamo: string;
}

export interface SolicitudCreditoResponseDTO {
  idSolicitud: number;
  numeroSolicitud: string;
  estado: string;
  fechaSolicitud: string;
  montoSolicitado: number;
  plazoMeses: number;
  placaVehiculo: string;
  rucConcesionario: string;
  cedulaVendedor: string;
  idPrestamo: string;
  cedulaSolicitante: string;
}

export interface SolicitudCreditoEdicionDTO {
  cedulaSolicitante: string;
  placaVehiculo: string;
  rucConcesionario: string;
  cedulaVendedor: string;
  montoSolicitado: number;
  plazoMeses: number;
  idPrestamo: string;
}

export interface EstadoSolicitudResponseDTO {
  idSolicitud: number;
  numeroSolicitud: string;
  estadoActual: string;
  fechaCambio: string;
  motivo: string;
  usuario: string;
  historial: Array<{
    estado: string;
    fecha: string;
    motivo: string;
    usuario: string;
  }>;
}

export interface SolicitudDetalladaResponseDTO {
  idSolicitud: number;
  numeroSolicitud: string;
  estado: string;
  fechaSolicitud: string;
  cedulaSolicitante: string;
  nombresSolicitante: string;
  calificacionSolicitante: string;
  capacidadPagoSolicitante: number;
  placaVehiculo: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  anioVehiculo: number;
  valorVehiculo: number;
  rucConcesionario: string;
  razonSocialConcesionario: string;
  direccionConcesionario: string;
  cedulaVendedor: string;
  nombreVendedor: string;
  telefonoVendedor: string;
  emailVendedor: string;
  idPrestamo: string;
  nombrePrestamo: string;
  descripcionPrestamo: string;
  valorEntrada: number;
  montoSolicitado: number;
  plazoMeses: number;
}

export interface SimulacionSolicitudResponseDTO {
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

class LoanService {
  private baseUrl = MICROSERVICES.ORIGINACION;

  /**
   * Consultar solicitudes por rango de fechas
   */
  async consultarSolicitudesPorFechas(request: SolicitudConsultaRequest): Promise<SolicitudConsultaResponse> {
    // Obtener el email del usuario logueado desde localStorage
    const userEmail = localStorage.getItem('userEmail') || '';
    
    // Configurar headers con el email del usuario
    const headers = {
      'X-User-Email': userEmail
    };
    
    return api.post<SolicitudConsultaResponse>(
      `${this.baseUrl}/api/originacion/v1/solicitudes/consultar-por-fechas`, 
      request,
      { headers }
    );
  }

  /**
   * Crear nueva solicitud de crédito
   */
  async crearSolicitud(solicitud: SolicitudCreditoDTO): Promise<SolicitudCreditoResponseDTO> {
    return api.post<SolicitudCreditoResponseDTO>(`${this.baseUrl}/api/originacion/v1/solicitudes`, solicitud);
  }

  /**
   * Editar solicitud existente (solo en estado BORRADOR)
   */
  async editarSolicitud(numeroSolicitud: string, solicitud: SolicitudCreditoEdicionDTO): Promise<SolicitudCreditoResponseDTO> {
    return api.put<SolicitudCreditoResponseDTO>(`${this.baseUrl}/api/originacion/v1/solicitudes/${numeroSolicitud}`, solicitud);
  }

  /**
   * Obtener información detallada de una solicitud
   */
  async obtenerSolicitudDetallada(numeroSolicitud: string): Promise<SolicitudDetalladaResponseDTO> {
    return api.get<SolicitudDetalladaResponseDTO>(`${this.baseUrl}/api/originacion/v1/solicitudes/${numeroSolicitud}/detalle`);
  }

  /**
   * Consultar estado e historial de una solicitud
   */
  async consultarEstadoSolicitud(idSolicitud: number): Promise<EstadoSolicitudResponseDTO> {
    return api.get<EstadoSolicitudResponseDTO>(`${this.baseUrl}/api/originacion/v1/solicitudes/${idSolicitud}/estado`);
  }

  /**
   * Cambiar estado de una solicitud
   */
  async cambiarEstadoSolicitud(idSolicitud: number, nuevoEstado: string, motivo: string, usuario: string): Promise<void> {
    const params = new URLSearchParams({
      nuevoEstado,
      motivo,
      usuario
    });
    return api.post<void>(`${this.baseUrl}/api/originacion/v1/solicitudes/${idSolicitud}/cambiar-estado?${params.toString()}`);
  }

  /**
   * Simular una solicitud existente
   */
  async simularSolicitud(numeroSolicitud: string): Promise<SimulacionSolicitudResponseDTO> {
    return api.get<SimulacionSolicitudResponseDTO>(`${this.baseUrl}/api/originacion/v1/solicitudes/${numeroSolicitud}/simular`);
  }

  /**
   * Método helper para formatear fechas para el API
   */
  formatDateForAPI(date: Date): string {
    return date.toISOString();
  }

  /**
   * Método helper para obtener el rango de fechas de la semana actual
   */
  getCurrentWeekRange(): { fechaInicio: string; fechaFin: string } {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0); // 00:00:00.000
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
    endOfWeek.setHours(23, 59, 59, 999); // 23:59:59.999

    return {
      fechaInicio: this.formatDateForAPI(startOfWeek),
      fechaFin: this.formatDateForAPI(endOfWeek)
    };
  }

  /**
   * Método helper para obtener el rango de fechas del mes actual
   */
  getCurrentMonthRange(): { fechaInicio: string; fechaFin: string } {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0); // 00:00:00.000
    
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // 23:59:59.999

    return {
      fechaInicio: this.formatDateForAPI(startOfMonth),
      fechaFin: this.formatDateForAPI(endOfMonth)
    };
  }

  /**
   * Método helper para obtener estadísticas básicas
   */
  async getEstadisticasBasicas(fechaInicio: string, fechaFin: string): Promise<{
    totalSolicitudes: number;
    enBorrador: number;
    aprobadas: number;
    rechazadas: number;
    montoTotal: number;
  }> {
    // Consultar todas las solicitudes en el rango
    const response = await this.consultarSolicitudesPorFechas({
      fechaInicio,
      fechaFin,
      pagina: 0,
      tamanoPagina: 1000 // Obtener todas para calcular estadísticas
    });

    const solicitudes = response.solicitudes;
    const totalSolicitudes = solicitudes.length;
    const enBorrador = solicitudes.filter(s => s.estado === 'BORRADOR').length;
    const aprobadas = solicitudes.filter(s => s.estado === 'APROBADA').length;
    const rechazadas = solicitudes.filter(s => s.estado === 'RECHAZADA').length;
    const montoTotal = solicitudes.reduce((sum, s) => sum + s.montoSolicitado, 0);

    return {
      totalSolicitudes,
      enBorrador,
      aprobadas,
      rechazadas,
      montoTotal
    };
  }
}

export const loanService = new LoanService();
export default loanService;