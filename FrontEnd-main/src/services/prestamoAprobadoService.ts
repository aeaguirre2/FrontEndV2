import apiService from './api';
import { MICROSERVICES } from '../constants';

export interface PrestamoAprobado {
  id: number;
  idPrestamo: string;
  nombreCliente: string;
  cedula: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  anioVehiculo: number;
  concesionario: string;
  montoAprobado: number;
  estado: string;
  fechaAprobacion: string;
  idCuentaCliente: number;
  idCuentaConcesionario: number;
  cuentaBancoOrigen: string;
  cuentaCliente: string;
  cuentaConcesionario: string;
}

class PrestamoAprobadoService {
  private baseUrl = MICROSERVICES.CUENTAS_TRANS;

  // Listar préstamos aprobados
  async listarPrestamosAprobados(concesionarioId?: string): Promise<PrestamoAprobado[]> {
    try {
      const params = concesionarioId ? { concesionarioId } : {};
      console.log('Enviando parámetros al backend:', params);
      const response = await apiService.get<PrestamoAprobado[]>(`${this.baseUrl}/api/v1/prestamos-aprobados`, { params });
      return response;
    } catch (error) {
      console.error('Error al listar préstamos aprobados:', error);
      throw error;
    }
  }

  // Obtener préstamo por ID
  async obtenerPrestamoPorId(idPrestamo: string): Promise<PrestamoAprobado> {
    try {
      const response = await apiService.get<PrestamoAprobado>(`${this.baseUrl}/api/v1/prestamos-aprobados/${idPrestamo}`);
      return response;
    } catch (error) {
      console.error('Error al obtener préstamo:', error);
      throw error;
    }
  }

  // Crear préstamo aprobado
  async crearPrestamoAprobado(prestamo: Omit<PrestamoAprobado, 'id' | 'estado' | 'fechaAprobacion'>): Promise<PrestamoAprobado> {
    try {
      const response = await apiService.post<PrestamoAprobado>(`${this.baseUrl}/api/v1/prestamos-aprobados`, prestamo);
      return response;
    } catch (error) {
      console.error('Error al crear préstamo aprobado:', error);
      throw error;
    }
  }

  // Inicializar datos de ejemplo
  async inicializarDatos(): Promise<string> {
    try {
      const response = await apiService.post<string>(`${this.baseUrl}/api/v1/prestamos-aprobados/inicializar`);
      return response;
    } catch (error) {
      console.error('Error al inicializar datos:', error);
      throw error;
    }
  }
}

export const prestamoAprobadoService = new PrestamoAprobadoService();
