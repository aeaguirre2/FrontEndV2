import { apiService } from './api';

export interface TipoPrestamo {
  id: string;
  idMoneda: string;
  nombre: string;
  descripcion: string;
  requisitos: string;
  tipoCliente: string;
  fechaCreacion: string;
  fechaModificacion: string;
  estado: string;
  version: number;
  esquemaAmortizacion: string;
  idGarantia: string;
  garantia: any;
}

export interface Seguro {
  id: string;
  tipoSeguro: string;
  compania: string;
  montoAsegurado: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  version: number;
}

export interface TipoComision {
  id: string;
  tipo: string;
  nombre: string;
  descripcion: string;
  tipoCalculo: string;
  monto: number;
  estado: string;
  version: number;
}

export interface Prestamo {
  id: string;
  idTipoPrestamo: string;
  idMoneda: string;
  nombre: string;
  descripcion: string;
  fechaModificacion: string;
  baseCalculo: string;
  tasaInteres: number;
  montoMinimo: number;
  montoMaximo: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
  tipoAmortizacion: string;
  idSeguro: string;
  idTipoComision: string;
  estado: string;
  version: number;
  tipoPrestamo: TipoPrestamo;
  seguro: Seguro;
  tipoComision: TipoComision;
}

class PrestamoService {
  private baseUrl = 'http://localhost:8089';

  /**
   * Obtener todos los préstamos activos
   */
  async obtenerPrestamosActivos(): Promise<Prestamo[]> {
    return apiService.get<Prestamo[]>(`${this.baseUrl}/api/v1/prestamos`);
  }

  /**
   * Obtener préstamo por ID
   */
  async obtenerPrestamoPorId(id: string): Promise<Prestamo> {
    return apiService.get<Prestamo>(`${this.baseUrl}/api/v1/prestamos/${id}`);
  }

  /**
   * Filtrar préstamos por estado
   */
  async obtenerPrestamosPorEstado(estado: string): Promise<Prestamo[]> {
    const prestamos = await this.obtenerPrestamosActivos();
    return prestamos.filter(prestamo => prestamo.estado === estado);
  }
}

export const prestamoService = new PrestamoService();
export default prestamoService; 