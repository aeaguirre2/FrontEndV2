import { apiService } from './api';
import { MICROSERVICES } from '../constants';

export interface ClienteInfo {
  id: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nombre: string;
  genero: string;
  fechaNacimiento: string;
  estadoCivil: string;
  nivelEstudio: string;
  correoElectronico: string;
  estado: string;
}

class ClientService {
  private baseUrl = MICROSERVICES.CLIENTES;

  /**
   * Consultar información de cliente por cédula
   */
  async consultarClientePorCedula(cedula: string): Promise<ClienteInfo> {
    return apiService.get<ClienteInfo>(`${this.baseUrl}/api/v1/clientes/personas/CEDULA/${cedula}`);
  }
}

export const clientService = new ClientService();
export default clientService; 