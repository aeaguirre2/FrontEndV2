import { apiService } from './api';
import { MICROSERVICES } from '../constants';
import type { 
  CreditSimulation, 
  SimulationRequest, 
  PaginatedResponse,
  SimulacionCreditoRequestDTO,
  SimulacionCreditoResponseDTO
} from '../types/automotive-loan';

export interface SimulationQueryParams {
  page?: number;
  pageSize?: number;
  customerId?: string;
  productId?: string;
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QuickSimulationRequest {
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  interestRate: number;
}

class SimulationService {
  private baseUrl = MICROSERVICES.SIMULATION;
  private originacionUrl = MICROSERVICES.ORIGINACION;

  async createSimulation(data: SimulationRequest): Promise<CreditSimulation> {
    return apiService.post<CreditSimulation>(this.baseUrl, data);
  }

  async getSimulations(params?: SimulationQueryParams): Promise<PaginatedResponse<CreditSimulation>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return apiService.get<PaginatedResponse<CreditSimulation>>(url);
  }

  async getSimulationById(id: string): Promise<CreditSimulation> {
    return apiService.get<CreditSimulation>(`${this.baseUrl}/${id}`);
  }

  async updateSimulation(id: string, data: Partial<SimulationRequest>): Promise<CreditSimulation> {
    return apiService.put<CreditSimulation>(`${this.baseUrl}/${id}`, data);
  }

  async deleteSimulation(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async quickSimulation(data: QuickSimulationRequest): Promise<CreditSimulation> {
    return apiService.post<CreditSimulation>(`${this.baseUrl}/quick`, data);
  }

  async getSimulationsByCustomer(customerId: string): Promise<CreditSimulation[]> {
    return apiService.get<CreditSimulation[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  async getSimulationsByVehicle(vehicleId: string): Promise<CreditSimulation[]> {
    return apiService.get<CreditSimulation[]>(`${this.baseUrl}/vehicle/${vehicleId}`);
  }

  async getSimulationsByProduct(productId: string): Promise<CreditSimulation[]> {
    return apiService.get<CreditSimulation[]>(`${this.baseUrl}/product/${productId}`);
  }

  async calculatePayment(
    loanAmount: number,
    interestRate: number,
    termMonths: number
  ): Promise<{ monthlyPayment: number; totalInterest: number; totalAmount: number }> {
    return apiService.post<{ monthlyPayment: number; totalInterest: number; totalAmount: number }>(
      `${this.baseUrl}/calculate-payment`,
      { loanAmount, interestRate, termMonths }
    );
  }

  async generatePaymentSchedule(simulationId: string): Promise<CreditSimulation> {
    return apiService.post<CreditSimulation>(`${this.baseUrl}/${simulationId}/payment-schedule`);
  }

  async compareSimulations(simulationIds: string[]): Promise<{
    simulations: CreditSimulation[];
    comparison: any;
  }> {
    return apiService.post<{
      simulations: CreditSimulation[];
      comparison: any;
    }>(`${this.baseUrl}/compare`, { simulationIds });
  }

  async exportSimulation(id: string, format: 'pdf' | 'excel'): Promise<void> {
    return apiService.downloadFile(`${this.baseUrl}/${id}/export?format=${format}`, `simulation-${id}.${format}`);
  }

  async getSimulationStats(): Promise<{
    totalSimulations: number;
    avgLoanAmount: number;
    popularTerms: { term: number; count: number }[];
    popularProducts: { productId: string; productName: string; count: number }[];
  }> {
    return apiService.get<{
      totalSimulations: number;
      avgLoanAmount: number;
      popularTerms: { term: number; count: number }[];
      popularProducts: { productId: string; productName: string; count: number }[];
    }>(`${this.baseUrl}/stats`);
  }

  // Nuevo método para simulación de crédito usando el endpoint de originación
  async simularCredito(data: SimulacionCreditoRequestDTO): Promise<SimulacionCreditoResponseDTO> {
    return apiService.post<SimulacionCreditoResponseDTO>(`${this.originacionUrl}/api/v1/solicitudes/simular`, data);
  }
}

export const simulationService = new SimulationService();
export default simulationService;