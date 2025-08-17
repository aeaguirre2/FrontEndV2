import apiService from './api';
import { MICROSERVICES } from '../constants';

export interface DesembolsoSolicitud {
  idCuentaCliente: number;
  idCuentaOriginacion: number;
  monto: number;
  descripcion?: string;
  idPrestamo: string;
  idPrestamoCliente?: number;
}

export interface TransaccionRespuesta {
  id: number;
  idCuentaCliente: number;
  idCuentaClienteDestino?: number;
  tipoTransaccion: string;
  monto: number;
  descripcion?: string;
  fechaTransaccion: string;
  estado: string;
  version: number;
}

export interface DesembolsoRespuesta {
  retiroPool: TransaccionRespuesta;
  depositoCliente: TransaccionRespuesta;
  transferenciaOrigen: TransaccionRespuesta;
}

export interface TransaccionSolicitud {
  idCuentaClienteOrigen: number;
  idCuentaClienteDestino?: number;
  tipoTransaccion: string;
  monto: number;
  descripcion?: string;
}

class TransactionService {
  private baseUrl = MICROSERVICES.TRANSACCIONES;

  // Realizar desembolso
  async realizarDesembolso(data: DesembolsoSolicitud): Promise<DesembolsoRespuesta> {
    try {
      const response = await apiService.post<DesembolsoRespuesta>(`${this.baseUrl}/api/v1/transacciones/desembolso`, data);
      return response;
    } catch (error) {
      console.error('Error al realizar desembolso:', error);
      throw error;
    }
  }

  // Obtener transacción por ID
  async obtenerTransaccion(id: number): Promise<TransaccionRespuesta> {
    try {
      const response = await apiService.get<TransaccionRespuesta>(`${this.baseUrl}/api/v1/transacciones/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener transacción:', error);
      throw error;
    }
  }

  // Listar transacciones por cuenta
  async listarTransaccionesPorCuenta(idCuentaCliente: number): Promise<TransaccionRespuesta[]> {
    try {
      const response = await apiService.get<TransaccionRespuesta[]>(`${this.baseUrl}/api/v1/transacciones/por-cuenta/${idCuentaCliente}`);
      return response;
    } catch (error) {
      console.error('Error al listar transacciones:', error);
      throw error;
    }
  }

  // Listar transacciones por rango de fechas
  async listarTransaccionesPorFechas(
    idCuentaCliente: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<TransaccionRespuesta[]> {
    try {
      const response = await apiService.get<TransaccionRespuesta[]>(
        `${this.baseUrl}/api/v1/transacciones/por-cuenta/${idCuentaCliente}/rango-fechas`,
        {
          params: {
            fechaInicio,
            fechaFin
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Error al listar transacciones por fechas:', error);
      throw error;
    }
  }

  // Realizar depósito
  async realizarDeposito(data: TransaccionSolicitud): Promise<TransaccionRespuesta> {
    try {
      const response = await apiService.post<TransaccionRespuesta>(`${this.baseUrl}/api/v1/transacciones/deposito`, data);
      return response;
    } catch (error) {
      console.error('Error al realizar depósito:', error);
      throw error;
    }
  }

  // Realizar retiro
  async realizarRetiro(data: TransaccionSolicitud): Promise<TransaccionRespuesta> {
    try {
      const response = await apiService.post<TransaccionRespuesta>(`${this.baseUrl}/api/v1/transacciones/retiro`, data);
      return response;
    } catch (error) {
      console.error('Error al realizar retiro:', error);
      throw error;
    }
  }

  // Realizar transferencia
  async realizarTransferencia(data: TransaccionSolicitud): Promise<TransaccionRespuesta> {
    try {
      const response = await apiService.post<TransaccionRespuesta>(`${this.baseUrl}/api/v1/transacciones/transferencia`, data);
      return response;
    } catch (error) {
      console.error('Error al realizar transferencia:', error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();

