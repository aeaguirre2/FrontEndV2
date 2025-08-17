import type { Concesionario, Vendedor, VehiculoEnConcesionario, IdentificadorVehiculo } from '../types/automotive-loan';
import { api } from './api';
import { API_CONFIG } from '../constants';

// Concesionarios
export const getAllConcesionarios = () => api.get<Concesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}`);
export const getConcesionarioByRuc = (ruc: string) => api.get<Concesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}`);
export const getConcesionariosByEstado = (estado: string) => api.get<Concesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/estado/${estado}`);
export const getConcesionariosByRazonSocial = (razonSocial: string) => api.get<Concesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/razon-social/${razonSocial}`);
export const getConcesionarioByEmail = (email: string) => api.get<Concesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/email/${email}`);
export const getConcesionarioByVendedorEmail = (email: string) => api.get<Concesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/vendedor-email/${email}`);
export const createConcesionario = (data: Partial<Concesionario>) => api.post<Concesionario>(`/api/concesionarios/${API_CONFIG.VERSION}`, data);
export const updateConcesionario = (ruc: string, data: Partial<Concesionario>) => api.put<Concesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}`, data);
export const desactivarConcesionario = (ruc: string) => api.put<Concesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/desactivar`, {});

// Vendedores
export const getAllVendedores = () => api.get<Vendedor[]>(`/api/concesionarios/${API_CONFIG.VERSION}/vendedores`);
export const getVendedoresByRuc = (ruc: string) => api.get<Vendedor[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores`);
export const createVendedor = (ruc: string, data: Partial<Vendedor>) => api.post<Vendedor>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores`, data);
export const updateVendedor = (ruc: string, cedula: string, data: Partial<Vendedor>) => api.put<Vendedor>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores/${cedula}`, data);
export const desactivarVendedor = (ruc: string, cedula: string) => api.put<Vendedor>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores/${cedula}/desactivar`, {});
export const getVendedorByCedula = (ruc: string, cedula: string) => api.get<Vendedor>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores/cedula/${cedula}`);
export const getVendedoresByEstado = (ruc: string, estado: string) => api.get<Vendedor[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores/estado/${estado}`);
export const getVendedorByEmail = (ruc: string, email: string) => api.get<Vendedor>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores/email/${email}`);
export const getVendedoresByNombre = (ruc: string, nombre: string) => api.get<Vendedor[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vendedores/nombre/${nombre}`);

// Vehículos en concesionario
export const getAllVehiculos = () => api.get<VehiculoEnConcesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/vehiculos`);
export const getVehiculosByRuc = (ruc: string) => api.get<VehiculoEnConcesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos`);
export const createVehiculo = (ruc: string, data: Partial<VehiculoEnConcesionario>) => api.post<VehiculoEnConcesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos`, data);
export const updateVehiculo = (ruc: string, placa: string, data: Partial<VehiculoEnConcesionario>) => api.put<VehiculoEnConcesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos/${placa}`, data);
export const desactivarVehiculo = (ruc: string, placa: string) => api.put<VehiculoEnConcesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos/${placa}/desactivar`, {});
export const getVehiculosByEstado = (ruc: string, estado: string) => api.get<VehiculoEnConcesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos/estado/${estado}`);
export const getVehiculosByCondicion = (ruc: string, condicion: string) => api.get<VehiculoEnConcesionario[]>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos/condicion/${condicion}`);
export const getVehiculoByPlaca = (ruc: string, placa: string) => api.get<VehiculoEnConcesionario>(`/api/concesionarios/${API_CONFIG.VERSION}/ruc/${ruc}/vehiculos/placa/${placa}`);

// Identificadores de vehículos
export const getAllIdentificadoresVehiculo = () => api.get<IdentificadorVehiculo[]>(`/api/concesionarios/${API_CONFIG.VERSION}/identificadores-vehiculo`);
export const createIdentificadorVehiculo = (data: Partial<IdentificadorVehiculo>) => api.post<IdentificadorVehiculo>(`/api/concesionarios/${API_CONFIG.VERSION}/identificadores-vehiculo`, data);
export const getIdentificadorVehiculoById = (id: string) => api.get<IdentificadorVehiculo>(`/api/concesionarios/${API_CONFIG.VERSION}/identificadores-vehiculo/${id}`);

// Clase para manejar el servicio de concesionarios
class ConcesionarioService {
  // Métodos para concesionarios
  async getAllConcesionarios() {
    return await getAllConcesionarios();
  }

  async getConcesionarioByRuc(ruc: string) {
    return await getConcesionarioByRuc(ruc);
  }

  async createConcesionario(data: Partial<Concesionario>) {
    return await createConcesionario(data);
  }

  async updateConcesionario(ruc: string, data: Partial<Concesionario>) {
    return await updateConcesionario(ruc, data);
  }

  async desactivarConcesionario(ruc: string) {
    return await desactivarConcesionario(ruc);
  }

  // Métodos para vendedores
  async getAllVendedores() {
    return await getAllVendedores();
  }

  async getVendedoresByRuc(ruc: string) {
    return await getVendedoresByRuc(ruc);
  }

  async createVendedor(ruc: string, data: Partial<Vendedor>) {
    return await createVendedor(ruc, data);
  }

  async updateVendedor(ruc: string, cedula: string, data: Partial<Vendedor>) {
    return await updateVendedor(ruc, cedula, data);
  }

  async desactivarVendedor(ruc: string, cedula: string) {
    return await desactivarVendedor(ruc, cedula);
  }

  // Métodos para vehículos
  async getAllVehiculos() {
    return await getAllVehiculos();
  }

  async getVehiculosByRuc(ruc: string) {
    return await getVehiculosByRuc(ruc);
  }

  async createVehiculo(ruc: string, data: Partial<VehiculoEnConcesionario>) {
    return await createVehiculo(ruc, data);
  }

  async updateVehiculo(ruc: string, placa: string, data: Partial<VehiculoEnConcesionario>) {
    return await updateVehiculo(ruc, placa, data);
  }

  async desactivarVehiculo(ruc: string, placa: string) {
    return await desactivarVehiculo(ruc, placa);
  }
}

export default new ConcesionarioService(); 