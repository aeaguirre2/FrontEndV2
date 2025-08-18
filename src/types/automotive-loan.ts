// Sistema de Préstamos Automotrices - Tipos específicos

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Cliente (para solicitudes de préstamos)
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  identification: string;
  identificationType: 'CEDULA' | 'PASAPORTE' | 'RUC';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vehículos
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: VehicleType;
  engine: string;
  transmission: 'MANUAL' | 'AUTOMATIC';
  fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
  doors: number;
  category: VehicleCategory;
  isAvailable: boolean;
  images: string[];
  specifications: VehicleSpecification[];
  createdAt: string;
  updatedAt: string;
  concesionario: string;
}

export const VehicleType = {
  CAR: 'CAR',
  SUV: 'SUV',
  TRUCK: 'TRUCK',
  MOTORCYCLE: 'MOTORCYCLE',
  VAN: 'VAN',
} as const;

export type VehicleType = typeof VehicleType[keyof typeof VehicleType];

export const VehicleCategory = {
  NEW: 'NEW',
  USED: 'USED',
  CERTIFIED: 'CERTIFIED',
} as const;

export type VehicleCategory = typeof VehicleCategory[keyof typeof VehicleCategory];

export interface VehicleSpecification {
  name: string;
  value: string;
}

// Productos de Crédito
export interface CreditProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  baseInterestRate: number;
  fees: ProductFee[];
  requirements: string[];
  vehicleTypes: VehicleType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFee {
  id: string;
  name: string;
  type: 'FIXED' | 'PERCENTAGE';
  amount: number;
  description: string;
}

// Tasas de Interés
export interface InterestRate {
  id: string;
  productId: string;
  termMonths: number;
  rate: number;
  vehicleCategory: VehicleCategory;
  effectiveDate: string;
  expirationDate?: string;
  isActive: boolean;
}

// Simulación de Crédito
export interface CreditSimulation {
  id: string;
  vehiclePrice: number;
  downPayment: number;
  loanAmount: number;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  productId: string;
  vehicleId?: string;
  customerId?: string;
  simulationDate: string;
  paymentSchedule: PaymentScheduleItem[];
}

export interface PaymentScheduleItem {
  paymentNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface SimulationRequest {
  vehicleId: string;
  productId: string;
  downPayment: number;
  termMonths: number;
}

// Solicitudes de Crédito
export interface LoanApplication {
  id: string;
  applicationNumber: string;
  customerId: string;
  customer: Customer;
  vehicleId: string;
  vehicle: Vehicle;
  productId: string;
  product: CreditProduct;
  requestedAmount: number;
  downPayment: number;
  termMonths: number;
  status: LoanStatus;
  submissionDate: string;
  lastUpdateDate: string;
  assignedAnalyst?: string;
  documents: LoanDocument[];
  personalInfo: CustomerPersonalInfo;
  employmentInfo: CustomerEmploymentInfo;
  financialInfo: CustomerFinancialInfo;
  references: CustomerReference[];
}

export const LoanStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type LoanStatus = typeof LoanStatus[keyof typeof LoanStatus];

export interface LoanDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadDate: string;
  isRequired: boolean;
  isVerified: boolean;
}

export const DocumentType = {
  IDENTIFICATION: 'IDENTIFICATION',
  INCOME_PROOF: 'INCOME_PROOF',
  EMPLOYMENT_LETTER: 'EMPLOYMENT_LETTER',
  BANK_STATEMENTS: 'BANK_STATEMENTS',
  UTILITY_BILL: 'UTILITY_BILL',
  VEHICLE_REGISTRATION: 'VEHICLE_REGISTRATION',
  OTHER: 'OTHER',
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

// Información del Cliente
export interface CustomerPersonalInfo {
  dateOfBirth: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  dependents: number;
  address: Address;
}

export interface CustomerEmploymentInfo {
  employerName: string;
  position: string;
  employmentType: 'EMPLOYEE' | 'SELF_EMPLOYED' | 'RETIRED' | 'UNEMPLOYED';
  monthlyIncome: number;
  employmentStartDate: string;
  employerPhone: string;
  employerAddress: Address;
}

export interface CustomerFinancialInfo {
  monthlyExpenses: number;
  existingDebts: ExistingDebt[];
  bankAccounts: BankAccount[];
  assets: Asset[];
}

export interface ExistingDebt {
  creditor: string;
  type: 'CREDIT_CARD' | 'PERSONAL_LOAN' | 'MORTGAGE' | 'AUTO_LOAN' | 'OTHER';
  balance: number;
  monthlyPayment: number;
}

export interface BankAccount {
  bank: string;
  accountType: 'CHECKING' | 'SAVINGS';
  balance: number;
}

export interface Asset {
  type: 'REAL_ESTATE' | 'VEHICLE' | 'INVESTMENT' | 'OTHER';
  description: string;
  value: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerReference {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Análisis Crediticio
export interface CreditAnalysis {
  id: string;
  applicationId: string;
  analystId: string;
  analystName: string;
  score: number;
  riskLevel: RiskLevel;
  recommendation: AnalysisRecommendation;
  factors: AnalysisFactor[];
  comments: string;
  analysisDate: string;
  approvedAmount?: number;
  approvedTermMonths?: number;
  conditions: string[];
}

export const RiskLevel = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
} as const;

export type RiskLevel = typeof RiskLevel[keyof typeof RiskLevel];

export const AnalysisRecommendation = {
  APPROVE: 'APPROVE',
  APPROVE_WITH_CONDITIONS: 'APPROVE_WITH_CONDITIONS',
  REJECT: 'REJECT',
  REQUEST_MORE_INFO: 'REQUEST_MORE_INFO',
} as const;

export type AnalysisRecommendation = typeof AnalysisRecommendation[keyof typeof AnalysisRecommendation];

export interface AnalysisFactor {
  factor: string;
  score: number;
  weight: number;
  description: string;
}

// Contratos y Garantías
export interface Contract {
  id: string;
  contractNumber: string;
  applicationId: string;
  application: LoanApplication;
  contractDate: string;
  approvedAmount: number;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
  status: ContractStatus;
  guarantees: Guarantee[];
  insurances: Insurance[];
  signedDate?: string;
  effectiveDate?: string;
  maturityDate?: string;
}

export const ContractStatus = {
  DRAFT: 'DRAFT',
  PENDING_SIGNATURE: 'PENDING_SIGNATURE',
  SIGNED: 'SIGNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DEFAULTED: 'DEFAULTED',
  CANCELLED: 'CANCELLED',
} as const;

export type ContractStatus = typeof ContractStatus[keyof typeof ContractStatus];

export interface Guarantee {
  id: string;
  type: GuaranteeType;
  description: string;
  value: number;
  documents: string[];
}

export const GuaranteeType = {
  VEHICLE: 'VEHICLE',
  REAL_ESTATE: 'REAL_ESTATE',
  PERSONAL_GUARANTEE: 'PERSONAL_GUARANTEE',
  BANK_GUARANTEE: 'BANK_GUARANTEE',
} as const;

export type GuaranteeType = typeof GuaranteeType[keyof typeof GuaranteeType];

export interface Insurance {
  id: string;
  type: InsuranceType;
  provider: string;
  policyNumber: string;
  coverage: number;
  premium: number;
  startDate: string;
  endDate: string;
}

export const InsuranceType = {
  VEHICLE_COMPREHENSIVE: 'VEHICLE_COMPREHENSIVE',
  LIFE: 'LIFE',
  DISABILITY: 'DISABILITY',
  UNEMPLOYMENT: 'UNEMPLOYMENT',
} as const;

export type InsuranceType = typeof InsuranceType[keyof typeof InsuranceType];

// Filtros y consultas
export interface VehicleFilters {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  type?: VehicleType;
  category?: VehicleCategory;
  fuelType?: string;
  transmission?: string;
}

export interface LoanApplicationFilters {
  status?: LoanStatus;
  customerId?: string;
  productId?: string;
  submissionDateFrom?: string;
  submissionDateTo?: string;
  assignedAnalyst?: string;
  amountFrom?: number;
  amountTo?: number;
}

export interface ContractFilters {
  status?: ContractStatus;
  customerId?: string;
  contractDateFrom?: string;
  contractDateTo?: string;
  amountFrom?: number;
  amountTo?: number;
}

// Concesionarios
export interface Concesionario {
  id: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
  emailContacto: string;
  estado: EstadoConcesionario;
  vendedores: Vendedor[];
  vehiculos: VehiculoEnConcesionario[];
  createdAt: string;
  updatedAt: string;
}

export type EstadoConcesionario = 'ACTIVO' | 'INACTIVO';

// Vendedores
export interface Vendedor {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: EstadoVendedor;
  createdAt: string;
  updatedAt: string;
}

export type EstadoVendedor = 'ACTIVO' | 'INACTIVO';

// Vehículos en concesionario (pueden tener identificadores propios)
export interface VehiculoEnConcesionario {
  id: string;
  placa: string;
  chasis: string;
  motor: string;
  marca: string;
  modelo: string;
  anio: number | string;
  condicion: CondicionVehiculo;
  estado: EstadoVehiculo;
  createdAt: string;
  updatedAt: string;
  cilindraje?: number;
  valor?: number;
  color?: string;
  extras?: string;
  tipo?: string;
  combustible?: string;
  identificadorVehiculo?: IdentificadorVehiculo;
}

export type CondicionVehiculo = 'NUEVO' | 'USADO';
export type EstadoVehiculo = 'DISPONIBLE' | 'VENDIDO' | 'NO_DISPONIBLE';

// Identificadores de vehículo
export interface IdentificadorVehiculo {
  id?: string;
  placa: string;
  chasis: string;
  motor: string;
}

// Tipos específicos para simulación de crédito (Originación Service)
export interface SimulacionCreditoRequestDTO {
  placaVehiculo: string;
  rucConcesionario: string;
  montoSolicitado: number;
  plazoMeses: number;
  tasaInteres: number;
}

export interface ResumenEscenario {
  nombreEscenario: string;
  montoFinanciado: number;
  plazoMeses: number;
  cuotaMensual: number;
  montoTotal: number;
  totalIntereses: number;
  entrada: number;
  descripcion: string;
}

export interface CuotaAmortizacion {
  numeroCuota: number;
  saldoInicial: number;
  cuota: number;
  abonoCapital: number;
  interes: number;
  saldoFinal: number;
  escenario: string;
}

export interface SimulacionCreditoResponseDTO {
  placaVehiculo: string;
  rucConcesionario: string;
  valorVehiculo: number;
  montoSolicitado: number;
  plazoOriginal: number;
  tasaInteres: number;
  resumenEscenarios: ResumenEscenario[];
  tablaConEntrada20: CuotaAmortizacion[];
  tablaSinEntrada: CuotaAmortizacion[];
  tablaPlazoMaximo: CuotaAmortizacion[];
}