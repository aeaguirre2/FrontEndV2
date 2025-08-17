// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Microservices endpoints - Sistema de Préstamos Automotrices
export const MICROSERVICES = {
  // Gestión Vehículos (puerto 8080) - Para login y gestión de vehículos
  VEHICULOS: 'http://localhost:8080',
  CONCESIONARIOS: 'http://localhost:8080',
  
  // Análisis Services
  ORIGINACION: 'http://localhost:8080',
  FORMALIZACION: 'http://localhost:8080',
  
                // Core Services
              GENERAL: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/general',
              CLIENTES: 'http://localhost:83/api/clientes',
              CUENTAS_CONFIG: 'http://localhost:8080',
              CUENTAS_TRANS: 'http://localhost:8085',
              TRANSACCIONES: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/prestamos',
              CATALOG: 'http://localhost:82/api/catalogo',
              ORIGINACION: 'http://localhost:81',
  
  // Legacy compatibility
  VEHICLES: 'http://localhost:8080',
  CREDIT_PRODUCTS: 'http://localhost:8080',
  SIMULATION: 'http://localhost:8080',
  LOANS: 'http://localhost:8080',
  ANALYSIS: 'http://localhost:8080',
  CONTRACTS: 'http://localhost:8080',
  INTEREST: 'http://localhost:8080',
  NOTIFICATIONS: 'http://localhost:8080',
  
  // Riesgo Crediticio (puerto 80) - Backend separado
  RIESGO_CREDITO: 'http://localhost:80',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_DELAY: 200,
} as const;

// Routes - Sistema de Préstamos Automotrices
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  PRODUCTS: '/products',
  PRODUCTS_INTEREST: '/products/interest',
  CREDIT_SIMULATION: '/credit-simulation',
  LOANS: '/loans',
  LOANS_CREATE: '/loans/create',
  LOANS_SIMULATE: '/loans/simulate',
  ANALYSIS: '/analysis',
  CONTRACTS: '/contracts',
  DOCUMENTATION: '/documentation',
  DESEMBOLSOS: '/desembolsos',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
  CONCESIONARIOS: '/concesionarios',
  RIESGO_CREDITO: '/riesgo-credito',
  RIESGO_CREDITO_ADMIN: '/riesgo-credito/admin',
} as const;

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
} as const;

// Environment
export const ENV = {
  PROD: 'production',
  DEV: 'development',
  TEST: 'test',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;