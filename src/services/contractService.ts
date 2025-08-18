import { apiService } from './api';
import { MICROSERVICES } from '../constants';
import type { Contract, ContractFilters, PaginatedResponse } from '../types/automotive-loan';

export interface ContractQueryParams extends ContractFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateContractRequest {
  applicationId: string;
  approvedAmount: number;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
  guarantees: {
    type: string;
    description: string;
    value: number;
    documents: string[];
  }[];
  insurances: {
    type: string;
    provider: string;
    policyNumber: string;
    coverage: number;
    premium: number;
    startDate: string;
    endDate: string;
  }[];
}

class ContractService {
  private baseUrl = MICROSERVICES.CONTRACTS;

  async getContracts(params?: ContractQueryParams): Promise<PaginatedResponse<Contract>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return apiService.get<PaginatedResponse<Contract>>(url);
  }

  async getContractById(id: string): Promise<Contract> {
    return apiService.get<Contract>(`${this.baseUrl}/${id}`);
  }

  async createContract(data: CreateContractRequest): Promise<Contract> {
    return apiService.post<Contract>(this.baseUrl, data);
  }

  async updateContract(id: string, data: Partial<CreateContractRequest>): Promise<Contract> {
    return apiService.put<Contract>(`${this.baseUrl}/${id}`, data);
  }

  async deleteContract(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getContractByApplication(applicationId: string): Promise<Contract | null> {
    try {
      return await apiService.get<Contract>(`${this.baseUrl}/application/${applicationId}`);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getContractsByCustomer(customerId: string): Promise<Contract[]> {
    return apiService.get<Contract[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  async updateContractStatus(id: string, status: string, comments?: string): Promise<Contract> {
    return apiService.post<Contract>(`${this.baseUrl}/${id}/status`, { status, comments });
  }

  async signContract(id: string, signatureData: {
    customerSignature: string;
    signedDate: string;
    ipAddress?: string;
    location?: string;
  }): Promise<Contract> {
    return apiService.post<Contract>(`${this.baseUrl}/${id}/sign`, signatureData);
  }

  async activateContract(id: string, effectiveDate: string): Promise<Contract> {
    return apiService.post<Contract>(`${this.baseUrl}/${id}/activate`, { effectiveDate });
  }

  async cancelContract(id: string, reason: string): Promise<Contract> {
    return apiService.post<Contract>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  async generateContractDocument(id: string, template: 'standard' | 'simplified' = 'standard'): Promise<{
    documentUrl: string;
    documentId: string;
  }> {
    return apiService.post<{
      documentUrl: string;
      documentId: string;
    }>(`${this.baseUrl}/${id}/generate-document`, { template });
  }

  async downloadContract(id: string, format: 'pdf' | 'docx' = 'pdf'): Promise<void> {
    return apiService.downloadFile(`${this.baseUrl}/${id}/download?format=${format}`, `contract-${id}.${format}`);
  }

  async addGuarantee(contractId: string, guarantee: {
    type: string;
    description: string;
    value: number;
    documents: string[];
  }): Promise<Contract> {
    return apiService.post<Contract>(`${this.baseUrl}/${contractId}/guarantees`, guarantee);
  }

  async updateGuarantee(contractId: string, guaranteeId: string, data: Partial<{
    type: string;
    description: string;
    value: number;
    documents: string[];
  }>): Promise<Contract> {
    return apiService.put<Contract>(`${this.baseUrl}/${contractId}/guarantees/${guaranteeId}`, data);
  }

  async removeGuarantee(contractId: string, guaranteeId: string): Promise<Contract> {
    return apiService.delete<Contract>(`${this.baseUrl}/${contractId}/guarantees/${guaranteeId}`);
  }

  async addInsurance(contractId: string, insurance: {
    type: string;
    provider: string;
    policyNumber: string;
    coverage: number;
    premium: number;
    startDate: string;
    endDate: string;
  }): Promise<Contract> {
    return apiService.post<Contract>(`${this.baseUrl}/${contractId}/insurances`, insurance);
  }

  async updateInsurance(contractId: string, insuranceId: string, data: Partial<{
    provider: string;
    policyNumber: string;
    coverage: number;
    premium: number;
    startDate: string;
    endDate: string;
  }>): Promise<Contract> {
    return apiService.put<Contract>(`${this.baseUrl}/${contractId}/insurances/${insuranceId}`, data);
  }

  async removeInsurance(contractId: string, insuranceId: string): Promise<Contract> {
    return apiService.delete<Contract>(`${this.baseUrl}/${contractId}/insurances/${insuranceId}`);
  }

  async getContractStats(): Promise<{
    totalContracts: number;
    activeContracts: number;
    pendingSignature: number;
    completed: number;
    defaulted: number;
    byStatus: { status: string; count: number; percentage: number }[];
    totalValue: number;
    avgContractValue: number;
    maturityDistribution: { 
      range: string; 
      count: number; 
      totalValue: number; 
    }[];
  }> {
    return apiService.get<{
      totalContracts: number;
      activeContracts: number;
      pendingSignature: number;
      completed: number;
      defaulted: number;
      byStatus: { status: string; count: number; percentage: number }[];
      totalValue: number;
      avgContractValue: number;
      maturityDistribution: { 
        range: string; 
        count: number; 
        totalValue: number; 
      }[];
    }>(`${this.baseUrl}/stats`);
  }

  async getContractsExpiringToday(): Promise<Contract[]> {
    return apiService.get<Contract[]>(`${this.baseUrl}/expiring-today`);
  }

  async getContractsExpiringThisWeek(): Promise<Contract[]> {
    return apiService.get<Contract[]>(`${this.baseUrl}/expiring-this-week`);
  }

  async getContractsExpiringThisMonth(): Promise<Contract[]> {
    return apiService.get<Contract[]>(`${this.baseUrl}/expiring-this-month`);
  }

  async getContractTimeline(id: string): Promise<{
    events: {
      timestamp: string;
      event: string;
      description: string;
      user?: string;
      data?: any;
    }[];
  }> {
    return apiService.get<{
      events: {
        timestamp: string;
        event: string;
        description: string;
        user?: string;
        data?: any;
      }[];
    }>(`${this.baseUrl}/${id}/timeline`);
  }

  async exportContracts(params?: ContractQueryParams): Promise<void> {
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
    
    return apiService.downloadFile(url, 'contracts.xlsx');
  }
}

export const contractService = new ContractService();
export default contractService;