import { api } from './api';
import { MICROSERVICES } from '../constants';

export interface Prestamo {
  id: string;
  nombre: string;
  descripcion: string;
  tasaInteres: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
  montoMinimo: number;
  montoMaximo: number;
  activo: boolean;
}

class PrestamoService {
  private baseUrl = MICROSERVICES.CATALOG;

  async obtenerPrestamosActivos(): Promise<Prestamo[]> {
    return api.get<Prestamo[]>(`${this.baseUrl}/v1/prestamos`);
  }

  async obtenerPrestamoPorId(id: string): Promise<Prestamo> {
    return api.get<Prestamo>(`${this.baseUrl}/v1/prestamos/${id}`);
  }
}

export const prestamoService = new PrestamoService();
export default prestamoService; 