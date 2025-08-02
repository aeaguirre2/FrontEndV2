import { apiService } from './api';
import { MICROSERVICES } from '../constants';
import type { LoanApplication, LoanApplicationFilters, PaginatedResponse } from '../types/automotive-loan';

export interface LoanApplicationQueryParams extends LoanApplicationFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLoanApplicationRequest {
  customerId: string;
  vehicleId: string;
  productId: string;
  requestedAmount: number;
  downPayment: number;
  termMonths: number;
  personalInfo: any;
  employmentInfo: any;
  financialInfo: any;
  references: any[];
}

class LoanService {
  private baseUrl = MICROSERVICES.LOANS;

  async getLoanApplications(params?: LoanApplicationQueryParams): Promise<PaginatedResponse<LoanApplication>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return apiService.get<PaginatedResponse<LoanApplication>>(url);
  }

  async getLoanApplicationById(id: string): Promise<LoanApplication> {
    return apiService.get<LoanApplication>(`${this.baseUrl}/${id}`);
  }

  async createLoanApplication(data: CreateLoanApplicationRequest): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(this.baseUrl, data);
  }

  async updateLoanApplication(id: string, data: Partial<LoanApplication>): Promise<LoanApplication> {
    return apiService.put<LoanApplication>(`${this.baseUrl}/${id}`, data);
  }

  async deleteLoanApplication(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async submitLoanApplication(id: string): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(`${this.baseUrl}/${id}/submit`);
  }

  async cancelLoanApplication(id: string, reason: string): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  async assignAnalyst(id: string, analystId: string): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(`${this.baseUrl}/${id}/assign-analyst`, { analystId });
  }

  async updateApplicationStatus(id: string, status: string, comments?: string): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(`${this.baseUrl}/${id}/status`, { status, comments });
  }

  async getLoanApplicationsByCustomer(customerId: string): Promise<LoanApplication[]> {
    return apiService.get<LoanApplication[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  async getLoanApplicationsByAnalyst(analystId: string): Promise<LoanApplication[]> {
    return apiService.get<LoanApplication[]>(`${this.baseUrl}/analyst/${analystId}`);
  }

  async uploadDocument(id: string, file: File, documentType: string): Promise<LoanApplication> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return apiService.post<LoanApplication>(`${this.baseUrl}/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteDocument(applicationId: string, documentId: string): Promise<LoanApplication> {
    return apiService.delete<LoanApplication>(`${this.baseUrl}/${applicationId}/documents/${documentId}`);
  }

  async verifyDocument(applicationId: string, documentId: string, isVerified: boolean): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(
      `${this.baseUrl}/${applicationId}/documents/${documentId}/verify`,
      { isVerified }
    );
  }

  async getApplicationStats(): Promise<{
    totalApplications: number;
    pendingReview: number;
    approved: number;
    rejected: number;
    byStatus: { status: string; count: number }[];
    byProduct: { productId: string; productName: string; count: number }[];
    avgProcessingTime: number;
  }> {
    return apiService.get<{
      totalApplications: number;
      pendingReview: number;
      approved: number;
      rejected: number;
      byStatus: { status: string; count: number }[];
      byProduct: { productId: string; productName: string; count: number }[];
      avgProcessingTime: number;
    }>(`${this.baseUrl}/stats`);
  }

  async getApplicationTimeline(id: string): Promise<{
    events: {
      timestamp: string;
      event: string;
      description: string;
      user?: string;
    }[];
  }> {
    return apiService.get<{
      events: {
        timestamp: string;
        event: string;
        description: string;
        user?: string;
      }[];
    }>(`${this.baseUrl}/${id}/timeline`);
  }

  async exportApplications(params?: LoanApplicationQueryParams): Promise<void> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() 
      ? `${this.baseUrl}/export?${queryParams.toString()}` 
      : `${this.baseUrl}/export`;
    
    return apiService.downloadFile(url, 'loan-applications.xlsx');
  }

  async duplicateApplication(id: string): Promise<LoanApplication> {
    return apiService.post<LoanApplication>(`${this.baseUrl}/${id}/duplicate`);
  }
}

export const loanService = new LoanService();
export default loanService;