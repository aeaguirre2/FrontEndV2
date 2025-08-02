import { apiService } from './api';
import { MICROSERVICES } from '../constants';
import type { CreditProduct, InterestRate, PaginatedResponse } from '../types/automotive-loan';

export interface CreditProductQueryParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  vehicleType?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InterestRateQueryParams {
  page?: number;
  pageSize?: number;
  productId?: string;
  vehicleCategory?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class CreditProductService {
  private baseUrl = MICROSERVICES.CREDIT_PRODUCTS;
  private interestUrl = MICROSERVICES.INTEREST;

  // Credit Products
  async getCreditProducts(params?: CreditProductQueryParams): Promise<PaginatedResponse<CreditProduct>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return apiService.get<PaginatedResponse<CreditProduct>>(url);
  }

  async getCreditProductById(id: string): Promise<CreditProduct> {
    return apiService.get<CreditProduct>(`${this.baseUrl}/${id}`);
  }

  async createCreditProduct(data: Omit<CreditProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditProduct> {
    return apiService.post<CreditProduct>(this.baseUrl, data);
  }

  async updateCreditProduct(id: string, data: Partial<CreditProduct>): Promise<CreditProduct> {
    return apiService.put<CreditProduct>(`${this.baseUrl}/${id}`, data);
  }

  async deleteCreditProduct(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async toggleProductStatus(id: string): Promise<CreditProduct> {
    return apiService.post<CreditProduct>(`${this.baseUrl}/${id}/toggle-status`);
  }

  async getActiveCreditProducts(): Promise<CreditProduct[]> {
    return apiService.get<CreditProduct[]>(`${this.baseUrl}/active`);
  }

  // Interest Rates
  async getInterestRates(params?: InterestRateQueryParams): Promise<PaginatedResponse<InterestRate>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.interestUrl}?${queryParams.toString()}` : this.interestUrl;
    return apiService.get<PaginatedResponse<InterestRate>>(url);
  }

  async getInterestRateById(id: string): Promise<InterestRate> {
    return apiService.get<InterestRate>(`${this.interestUrl}/${id}`);
  }

  async createInterestRate(data: Omit<InterestRate, 'id'>): Promise<InterestRate> {
    return apiService.post<InterestRate>(this.interestUrl, data);
  }

  async updateInterestRate(id: string, data: Partial<InterestRate>): Promise<InterestRate> {
    return apiService.put<InterestRate>(`${this.interestUrl}/${id}`, data);
  }

  async deleteInterestRate(id: string): Promise<void> {
    return apiService.delete<void>(`${this.interestUrl}/${id}`);
  }

  async getInterestRatesByProduct(productId: string): Promise<InterestRate[]> {
    return apiService.get<InterestRate[]>(`${this.interestUrl}/product/${productId}`);
  }

  async getCurrentInterestRate(productId: string, termMonths: number, vehicleCategory: string): Promise<InterestRate> {
    return apiService.get<InterestRate>(
      `${this.interestUrl}/current?productId=${productId}&termMonths=${termMonths}&vehicleCategory=${vehicleCategory}`
    );
  }

  async getInterestRateHistory(productId: string): Promise<InterestRate[]> {
    return apiService.get<InterestRate[]>(`${this.interestUrl}/history/${productId}`);
  }

  async bulkUpdateInterestRates(rates: Partial<InterestRate>[]): Promise<InterestRate[]> {
    return apiService.post<InterestRate[]>(`${this.interestUrl}/bulk-update`, { rates });
  }
}

export const creditProductService = new CreditProductService();
export default creditProductService;