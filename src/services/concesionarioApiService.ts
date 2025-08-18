import axios from 'axios';
import { MICROSERVICES, API_CONFIG } from '../constants';
import type { Concesionario, VehiculoEnConcesionario } from '../types/automotive-loan';

class ConcesionarioApiService {
  private baseUrl = MICROSERVICES.VEHICULOS;

  private client = axios.create({
    baseURL: this.baseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getConcesionariosByEstado(estado: string): Promise<Concesionario[]> {
    const response = await this.client.get<Concesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/estado/${estado}`);
    return response.data;
  }

  async getVehiculosByRuc(ruc: string): Promise<VehiculoEnConcesionario[]> {
    const response = await this.client.get<VehiculoEnConcesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos`);
    return response.data;
  }
}

export const concesionarioApiService = new ConcesionarioApiService();
export default concesionarioApiService; 