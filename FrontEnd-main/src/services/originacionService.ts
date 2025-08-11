import axios from 'axios';
import type {
  SimulacionCreditoRequestDTO,
  SimulacionCreditoResponseDTO
} from '../types/automotive-loan';


import type { AxiosResponse } from 'axios';

const ORIGEN_API = import.meta.env.VITE_ORIGINACION_SERVICE_URL;


export interface SolicitudResumenDTO {
  idSolicitud: string;
  numeroSolicitud: string;
  estado: string;
  fechaSolicitud: string; // ISO date
  montoSolicitado: number;
  plazoMeses: number;
  placaVehiculo: string;
}
export interface PaginaSolicitudes {
  solicitudes: SolicitudResumenDTO[];
  paginaActual: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}


class OriginacionService {
  //private baseUrl = MICROSERVICES.ORIGINACION;

  private client = axios.create({
    baseURL: ORIGEN_API,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async simularCredito(data: SimulacionCreditoRequestDTO): Promise<SimulacionCreditoResponseDTO> {
    const response = await this.client.post<SimulacionCreditoResponseDTO>('/api/originacion/v1/solicitudes/simular', data);
    return response.data;
  }

  async consultarClientePorCedula(cedula: string) {
    const response = await this.client.get(`/api/clientes/v1/clientes/${cedula}`);
    return response.data;
  }

  async registrarClienteProspecto(data: any) {
    const response = await this.client.post('/api/clientes/v1/clientes', data);
    return response.data;
  }



  /** Este método reemplaza a tu función suelta */
  async fetchSolicitudesPorFechas(
    fechaInicio: string,
    fechaFin: string,
    estado?: string
  ): Promise<AxiosResponse<PaginaSolicitudes>> {
    return this.client.post<PaginaSolicitudes>(
      `/api/originacion/v1/solicitudes/consultar-por-fechas`,
      { fechaInicio, fechaFin, estado, pagina: 0, tamanoPagina: 20 }
    );
  }



}











export const originacionService = new OriginacionService();
export default originacionService; 
