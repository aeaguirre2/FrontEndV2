// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Microservices endpoints - Sistema de Préstamos Automotrices
export const MICROSERVICES = {
  // Gestión Vehículos - PRODUCCIÓN AWS
  VEHICULOS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  CONCESIONARIOS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  
  // Análisis Services
  ORIGINACION: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
  FORMALIZACION: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  
  // Documentación Service (puerto 84)
  DOCUMENTACION: 'http://localhost:84',
  
  // Transacciones Service (puerto 85)
  TRANSACCIONES: 'http://localhost:85',
  
  // Core Services
  GENERAL: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/general',
  CLIENTES: 'http://localhost:83/api/clientes',
  CUENTAS_CONFIG: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  CUENTAS_TRANS: 'http://localhost:8085',
  CATALOG: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/catalogo',
  
  // Legacy compatibility
  VEHICLES: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  CREDIT_PRODUCTS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  SIMULATION: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  LOANS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  ANALYSIS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  CONTRACTS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  INTEREST: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  NOTIFICATIONS: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com/api/vehiculos',
  
  // Riesgo Crediticio (puerto 80) - Backend separado
  RIESGO_CREDITO: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
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