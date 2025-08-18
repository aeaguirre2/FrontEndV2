import axios from 'axios';

export interface ConsultaBuroCreditoResponse {
  nombreCliente: string;
  cedulaCliente: string;
  ingresosInternos: IngresosInternoDto[];
  egresosInternos: EgresosInternoDto[];
  ingresosExternos: IngresosExternoDto[];
  egresosExternos: EgresosExternoDto[];
  calificacionRiesgo: string;
  capacidadPago: number;
}

export interface IngresosInternoDto {
  id: number;
  cedulaCliente: string;
  nombres: string;
  institucionBancaria: string;
  producto: string;
  saldoPromedioMes: number;
  numeroCuenta: string;
  fechaActualizacion: string;
  fechaRegistro: string;
  version: number;
}

export interface EgresosInternoDto {
  id: number;
  cedulaCliente: string;
  nombres: string;
  institucionBancaria: string;
  producto: string;
  saldoPendiente: number;
  mesesPendientes: number;
  cuotaPago: number;
  mora: string;
  moraUltimosTresMeses: string;
  fechaActualizacion: string;
  fechaRegistro: string;
  version: number;
}

export interface IngresosExternoDto {
  id: number;
  clienteId: number;
  tipoIngreso: string;
  monto: number;
  frecuencia: string;
  fuente: string;
  fechaRegistro: string;
}

export interface EgresosExternoDto {
  id: number;
  clienteId: number;
  tipoEgreso: string;
  monto: number;
  frecuencia: string;
  categoria: string;
  fechaRegistro: string;
}

import { MICROSERVICES } from '../constants';

class RiesgoCreditoService {
  private baseURL = MICROSERVICES.RIESGO_CREDITO;
  private apiPath = '/api/analisis/v1';

  async consultarPorCedula(cedula: string): Promise<ConsultaBuroCreditoResponse> {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/consulta-por-cedula/${cedula}`);
      console.log('🔍 Respuesta completa del backend:', response);
      console.log('📊 Datos de la respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al consultar riesgo crediticio:', error);
      throw error;
    }
  }

  async sincronizarDesdeCore(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}${this.apiPath}/sincronizar-core`);
      return response.data;
    } catch (error) {
      console.error('Error al sincronizar desde core:', error);
      throw error;
    }
  }

  async contarPersonasCore(): Promise<number> {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/count-core-personas`);
      return response.data;
    } catch (error) {
      console.error('Error al contar personas en core:', error);
      throw error;
    }
  }

  async sincronizarInternoExterno(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}${this.apiPath}/sincronizar-interno-externo`);
      return response.data;
    } catch (error) {
      console.error('Error al sincronizar interno-externo:', error);
      throw error;
    }
  }

  async generarClientesExternos(cantidad: number): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}${this.apiPath}/generar-clientes-externos/${cantidad}`);
      return response.data;
    } catch (error) {
      console.error('Error al generar clientes externos:', error);
      throw error;
    }
  }

  async contarClientesInternos(): Promise<number> {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/clientes-internos`);
      return response.data;
    } catch (error) {
      console.error('Error al contar clientes internos:', error);
      throw error;
    }
  }
}

export const riesgoCreditoService = new RiesgoCreditoService();
