import { apiService } from './api';
import { MICROSERVICES } from '../constants';
import type { Vehicle, VehicleFilters, PaginatedResponse } from '../types/automotive-loan';

export interface VehicleQueryParams extends VehicleFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class VehicleService {
  private baseUrl = MICROSERVICES.VEHICLES;

  async getVehicles(params?: VehicleQueryParams): Promise<PaginatedResponse<Vehicle>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return apiService.get<PaginatedResponse<Vehicle>>(url);
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    return apiService.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  async createVehicle(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    return apiService.post<Vehicle>(this.baseUrl, data);
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    return apiService.put<Vehicle>(`${this.baseUrl}/${id}`, data);
  }

  async deleteVehicle(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getVehicleMakes(): Promise<string[]> {
    return apiService.get<string[]>(`${this.baseUrl}/makes`);
  }

  async getVehicleModels(make: string): Promise<string[]> {
    return apiService.get<string[]>(`${this.baseUrl}/makes/${make}/models`);
  }

  async getVehicleYears(): Promise<number[]> {
    return apiService.get<number[]>(`${this.baseUrl}/years`);
  }

  async toggleAvailability(id: string): Promise<Vehicle> {
    return apiService.post<Vehicle>(`${this.baseUrl}/${id}/toggle-availability`);
  }

  async getVehicleImages(id: string): Promise<string[]> {
    return apiService.get<string[]>(`${this.baseUrl}/${id}/images`);
  }

  async uploadVehicleImage(id: string, file: File): Promise<string> {
    return apiService.uploadFile<string>(`${this.baseUrl}/${id}/images`, file);
  }

  async deleteVehicleImage(id: string, imageUrl: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}/images`, {
      data: { imageUrl }
    });
  }

  async getVehiclesByPriceRange(minPrice: number, maxPrice: number): Promise<Vehicle[]> {
    return apiService.get<Vehicle[]>(`${this.baseUrl}/price-range?min=${minPrice}&max=${maxPrice}`);
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    return apiService.get<Vehicle[]>(`${this.baseUrl}/featured`);
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;