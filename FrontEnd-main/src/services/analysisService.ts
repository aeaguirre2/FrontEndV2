import { apiService } from './api';
import { MICROSERVICES } from '../constants';
import type { CreditAnalysis, PaginatedResponse } from '../types/automotive-loan';

export interface AnalysisQueryParams {
  page?: number;
  pageSize?: number;
  analystId?: string;
  applicationId?: string;
  riskLevel?: string;
  recommendation?: string;
  dateFrom?: string;
  dateTo?: string;
  scoreFrom?: number;
  scoreTo?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAnalysisRequest {
  applicationId: string;
  analystId: string;
  score: number;
  riskLevel: string;
  recommendation: string;
  factors: {
    factor: string;
    score: number;
    weight: number;
    description: string;
  }[];
  comments: string;
  approvedAmount?: number;
  approvedTermMonths?: number;
  conditions: string[];
}

// NUEVO: Tipo para el DTO del backend
export interface CreditEvaluationDTO {
  idSolicitud: number;
  estado: string;
  capacidadPago: number;
  nivelRiesgo: string;
  decisionAutomatica: string;
  observaciones: string;
  justificacionAnalista: string;
}

class AnalysisService {
  private baseUrl = MICROSERVICES.ANALYSIS;

  async getCreditAnalyses(params?: AnalysisQueryParams): Promise<PaginatedResponse<CreditAnalysis>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return apiService.get<PaginatedResponse<CreditAnalysis>>(url);
  }

  async getCreditAnalysisById(id: string): Promise<CreditAnalysis> {
    return apiService.get<CreditAnalysis>(`${this.baseUrl}/${id}`);
  }

  async createCreditAnalysis(data: CreateAnalysisRequest): Promise<CreditAnalysis> {
    return apiService.post<CreditAnalysis>(this.baseUrl, data);
  }

  async updateCreditAnalysis(id: string, data: Partial<CreateAnalysisRequest>): Promise<CreditAnalysis> {
    return apiService.put<CreditAnalysis>(`${this.baseUrl}/${id}`, data);
  }

  async deleteCreditAnalysis(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getAnalysisByApplication(applicationId: string): Promise<CreditAnalysis | null> {
    try {
      return await apiService.get<CreditAnalysis>(`${this.baseUrl}/application/${applicationId}`);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAnalysesByAnalyst(analystId: string): Promise<CreditAnalysis[]> {
    return apiService.get<CreditAnalysis[]>(`${this.baseUrl}/analyst/${analystId}`);
  }

  async runAutomaticAnalysis(applicationId: string): Promise<{
    suggestedScore: number;
    suggestedRiskLevel: string;
    suggestedRecommendation: string;
    factors: {
      factor: string;
      score: number;
      weight: number;
      description: string;
    }[];
    warnings: string[];
  }> {
    return apiService.post<{
      suggestedScore: number;
      suggestedRiskLevel: string;
      suggestedRecommendation: string;
      factors: {
        factor: string;
        score: number;
        weight: number;
        description: string;
      }[];
      warnings: string[];
    }>(`${this.baseUrl}/automatic/${applicationId}`);
  }

  async getAnalysisTemplate(): Promise<{
    factors: {
      factor: string;
      weight: number;
      description: string;
      criteria: {
        range: string;
        score: number;
        description: string;
      }[];
    }[];
    riskLevels: {
      level: string;
      scoreRange: string;
      description: string;
    }[];
    recommendations: {
      recommendation: string;
      description: string;
      conditions: string[];
    }[];
  }> {
    return apiService.get<{
      factors: {
        factor: string;
        weight: number;
        description: string;
        criteria: {
          range: string;
          score: number;
          description: string;
        }[];
      }[];
      riskLevels: {
        level: string;
        scoreRange: string;
        description: string;
      }[];
      recommendations: {
        recommendation: string;
        description: string;
        conditions: string[];
      }[];
    }>(`${this.baseUrl}/template`);
  }

  async getAnalysisStats(): Promise<{
    totalAnalyses: number;
    avgScore: number;
    riskDistribution: { riskLevel: string; count: number; percentage: number }[];
    recommendationDistribution: { recommendation: string; count: number; percentage: number }[];
    analystPerformance: {
      analystId: string;
      analystName: string;
      totalAnalyses: number;
      avgScore: number;
      avgProcessingTime: number;
    }[];
  }> {
    return apiService.get<{
      totalAnalyses: number;
      avgScore: number;
      riskDistribution: { riskLevel: string; count: number; percentage: number }[];
      recommendationDistribution: { recommendation: string; count: number; percentage: number }[];
      analystPerformance: {
        analystId: string;
        analystName: string;
        totalAnalyses: number;
        avgScore: number;
        avgProcessingTime: number;
      }[];
    }>(`${this.baseUrl}/stats`);
  }

  async compareAnalyses(analysisIds: string[]): Promise<{
    analyses: CreditAnalysis[];
    comparison: {
      factorComparison: {
        factor: string;
        scores: { analysisId: string; score: number }[];
        avgScore: number;
      }[];
      riskComparison: { analysisId: string; riskLevel: string; score: number }[];
      recommendationComparison: { analysisId: string; recommendation: string }[];
    };
  }> {
    return apiService.post<{
      analyses: CreditAnalysis[];
      comparison: {
        factorComparison: {
          factor: string;
          scores: { analysisId: string; score: number }[];
          avgScore: number;
        }[];
        riskComparison: { analysisId: string; riskLevel: string; score: number }[];
        recommendationComparison: { analysisId: string; recommendation: string }[];
      };
    }>(`${this.baseUrl}/compare`, { analysisIds });
  }

  async exportAnalysis(id: string, format: 'pdf' | 'excel'): Promise<void> {
    return apiService.downloadFile(`${this.baseUrl}/${id}/export?format=${format}`, `analysis-${id}.${format}`);
  }

  async getAnalysisHistory(applicationId: string): Promise<CreditAnalysis[]> {
    return apiService.get<CreditAnalysis[]>(`${this.baseUrl}/history/${applicationId}`);
  }

  async cloneAnalysis(id: string, newApplicationId: string): Promise<CreditAnalysis> {
    return apiService.post<CreditAnalysis>(`${this.baseUrl}/${id}/clone`, { newApplicationId });
  }

 
  async getAllCreditEvaluations(): Promise<CreditEvaluationDTO[]> {
    return apiService.get<CreditEvaluationDTO[]>(`${this.baseUrl}/v1/credit-analysis`);
  }

  async getCreditEvaluationById(idSolicitud: number): Promise<CreditEvaluationDTO> {
    return apiService.get<CreditEvaluationDTO>(`${this.baseUrl}/v1/credit-analysis/${idSolicitud}`);
  }

  // Ejecutar evaluación automática de la solicitud
  async ejecutarEvaluacionAutomatica(idSolicitud: number): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/v1/credit-analysis/${idSolicitud}/evaluate`);
  }
}

export const analysisService = new AnalysisService();
export default analysisService;