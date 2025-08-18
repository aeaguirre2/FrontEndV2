import axios from 'axios';
import { MICROSERVICES } from '../constants';
import type { 
  SimulacionCreditoRequestDTO, 
  SimulacionCreditoResponseDTO 
} from '../types/automotive-loan';

export interface SolicitudConsultaRequestDTO {
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
  cedulaVendedor?: string;
  rucConcesionario?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export interface SolicitudResumenDTO {
  idSolicitud: number;
  numeroSolicitud: string;
  estado: string;
  placaVehiculo: string;
  montoSolicitado: number;
}

export interface SolicitudConsultaPaginadaResponseDTO {
  solicitudes: SolicitudResumenDTO[];
  pagina: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}

export interface CrearSolicitudRequestDTO {
  cedulaSolicitante: string;
  idPrestamo: string;
  placaVehiculo: string;
  rucConcesionario: string;
  cedulaVendedor: string;
  valorEntrada: number;
  plazoMeses: number;
  calificacionSolicitante: string;
  capacidadPagoSolicitante: number;
}

export interface CrearSolicitudResponseDTO {
  numeroSolicitud: string;
  estado: string;
  mensaje?: string;
}

class OriginacionService {
  private baseUrl = MICROSERVICES.ORIGINACION;

  private client = axios.create({
    baseURL: this.baseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async simularCredito(data: SimulacionCreditoRequestDTO): Promise<SimulacionCreditoResponseDTO> {
    const response = await this.client.post<SimulacionCreditoResponseDTO>('/api/v1/solicitudes/simular', data);
    return response.data;
  }

  async consultarClientePorCedula(cedula: string) {
    const response = await this.client.get(`/api/v1/clientes/${cedula}`);
    return response.data;
  }

  async registrarClienteProspecto(data: any) {
    const response = await this.client.post('/api/v1/clientes', data);
    return response.data;
  }

  async fetchSolicitudesPorFechas(fechaInicio: string, fechaFin: string): Promise<{data: SolicitudConsultaPaginadaResponseDTO}> {
    const requestData: SolicitudConsultaRequestDTO = {
      fechaInicio,
      fechaFin,
      pagina: 0,
      tamanoPagina: 100
    };
    
    const response = await this.client.post<SolicitudConsultaPaginadaResponseDTO>(
      '/api/originacion/v1/solicitudes/consultar-por-fechas', 
      requestData
    );
    return { data: response.data };
  }

  async crearSolicitud(data: CrearSolicitudRequestDTO): Promise<CrearSolicitudResponseDTO> {
    const response = await this.client.post<CrearSolicitudResponseDTO>('/api/originacion/v1/solicitudes', data);
    return response.data;
  }
}

export const originacionService = new OriginacionService();
export default originacionService; 