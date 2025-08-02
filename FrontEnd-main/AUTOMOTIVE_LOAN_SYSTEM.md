# Sistema de Préstamos Automotrices - Frontend

## 🚀 Scaffolding Completo Implementado

Este proyecto implementa el frontend completo para un sistema de originación de préstamos automotrices, diseñado para consumir microservicios desarrollados en Java 21 + Spring Boot.

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # Layout principal con sidebar y navbar
│   │   ├── Sidebar.tsx            # Navegación lateral
│   │   └── Navbar.tsx             # Barra superior
│   └── ui/
│       ├── Button.tsx             # Componente de botón reutilizable
│       ├── Input.tsx              # Componente de input reutilizable
│       ├── Modal.tsx              # Componente modal
│       ├── Toast.tsx              # Notificaciones toast
│       └── ToastContainer.tsx     # Contenedor de toasts
├── pages/
│   ├── users/
│   │   └── UsersPage.tsx          # Gestión de usuarios y roles
│   ├── vehicles/
│   │   └── VehiclesPage.tsx       # Catálogo de vehículos
│   ├── products/
│   │   ├── ProductsPage.tsx       # Productos de crédito
│   │   └── InterestRatesPage.tsx  # Tasas de interés
│   ├── simulation/
│   │   └── CreditSimulationPage.tsx # Simulador de crédito
│   ├── loans/
│   │   └── LoansPage.tsx          # Solicitudes de préstamo
│   ├── analysis/
│   │   └── AnalysisPage.tsx       # Análisis crediticio
│   ├── contracts/
│   │   └── ContractsPage.tsx      # Contratos y garantías
│   ├── HomePage.tsx               # Página de inicio
│   ├── LoginPage.tsx              # Página de login
│   ├── DashboardPage.tsx          # Dashboard principal
│   └── NotFoundPage.tsx           # Página 404
├── services/
│   ├── api.ts                     # Configuración base de Axios
│   ├── authService.ts             # Servicio de autenticación
│   ├── userService.ts             # Servicio de usuarios
│   ├── vehicleService.ts          # Servicio de vehículos
│   ├── creditProductService.ts    # Servicio de productos de crédito
│   ├── simulationService.ts       # Servicio de simulación
│   ├── loanService.ts             # Servicio de solicitudes
│   ├── analysisService.ts         # Servicio de análisis crediticio
│   └── contractService.ts         # Servicio de contratos
├── hooks/
│   ├── useAuth.ts                 # Hook de autenticación
│   └── useApi.ts                  # Hook para llamadas API
├── contexts/
│   ├── AuthContext.tsx            # Estado global de autenticación
│   └── GlobalContext.tsx          # Estado global de la aplicación
├── routes/
│   └── AppRoutes.tsx              # Configuración de rutas
├── types/
│   ├── index.ts                   # Tipos generales
│   └── automotive-loan.ts         # Tipos específicos del dominio
├── constants/
│   └── index.ts                   # Constantes de la aplicación
└── utils/
    └── index.ts                   # Utilidades generales
```

## 🌐 Microservicios Configurados

El frontend está configurado para comunicarse con los siguientes microservicios:

| Microservicio | Puerto | Endpoint | Función |
|---------------|--------|----------|---------|
| **Users** | 8081 | `/api/users` | Gestión de usuarios y roles |
| **Vehicles** | 8082 | `/api/vehicles` | Catálogo de vehículos |
| **Credit Products** | 8083 | `/api/products` | Productos de crédito |
| **Simulation** | 8084 | `/api/simulation` | Simulación de crédito |
| **Loans** | 8085 | `/api/loans` | Solicitudes de préstamo |
| **Analysis** | 8086 | `/api/analysis` | Análisis crediticio |
| **Contracts** | 8087 | `/api/contracts` | Contratos y garantías |
| **Interest** | 8088 | `/api/interest` | Tasas de interés |
| **Notifications** | 8089 | `/api/notifications` | Notificaciones |

## 🎯 Funcionalidades Implementadas

### 1. **Dashboard Principal** (`/dashboard`)
- Estadísticas generales del sistema
- Resumen de solicitudes, aprobaciones y cartera
- Actividad reciente
- Acciones rápidas
- Alertas y notificaciones

### 2. **Gestión de Usuarios** (`/users`)
- Lista de usuarios con filtros
- Gestión de roles (Admin, Agente, Cliente, Analista)
- Estados activo/inactivo
- Búsqueda y paginación

### 3. **Catálogo de Vehículos** (`/vehicles`)
- Grid de vehículos con imágenes
- Filtros por marca, modelo, año, precio, tipo
- Categorías: Nuevo, Usado, Certificado
- Integración directa con simulador

### 4. **Productos de Crédito** (`/products`)
- Gestión de productos de crédito
- Configuración de tasas de interés (`/products/interest`)
- Plazos y montos por producto
- Tasas por categoría de vehículo

### 5. **Simulador de Crédito** (`/credit-simulation`)
- Simulación completa de préstamos
- Selección de vehículo y producto
- Cálculo de cuota mensual
- Tabla de amortización
- Integración con catálogo de vehículos

### 6. **Solicitudes de Préstamo** (`/loans`)
- Gestión completa del ciclo de solicitudes
- Estados: Borrador, Enviada, En Revisión, Aprobada, Rechazada
- Carga de documentos
- Información personal, laboral y financiera

### 7. **Análisis Crediticio** (`/analysis`)
- Evaluación de riesgo crediticio
- Scoring automático
- Recomendaciones (Aprobar, Rechazar, Condiciones)
- Historial de análisis

### 8. **Contratos y Garantías** (`/contracts`)
- Generación de contratos
- Gestión de garantías y seguros
- Firma digital
- Estados del contrato

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router v6** - Enrutamiento
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

## 🚀 Instrucciones de Uso

### 1. **Instalación**
```bash
npm install
```

### 2. **Configuración de Microservicios**
Edita el archivo `.env` con las URLs de tus microservicios:
```env
# Microservices URLs
VITE_USER_SERVICE_URL=http://localhost:8081/api/users
VITE_VEHICLE_SERVICE_URL=http://localhost:8082/api/vehicles
VITE_CREDIT_PRODUCTS_SERVICE_URL=http://localhost:8083/api/products
# ... más servicios
```

### 3. **Desarrollo**
```bash
npm run dev
```

### 4. **Navegación del Sistema**
1. **Inicio**: http://localhost:5173/ - Página de bienvenida
2. **Login**: http://localhost:5173/login - Autenticación básica
3. **Dashboard**: http://localhost:5173/dashboard - Panel principal
4. **Módulos específicos**: Acceso desde el sidebar

### 5. **Flujo de Trabajo Típico**
1. **Consultar vehículos** → `/vehicles`
2. **Simular crédito** → `/credit-simulation`
3. **Crear solicitud** → `/loans`
4. **Análisis crediticio** → `/analysis`
5. **Generar contrato** → `/contracts`

## 📋 APIs Implementadas

Cada servicio incluye operaciones CRUD completas:

### VehicleService
- `getVehicles()` - Lista con filtros
- `getVehicleById()` - Detalle de vehículo
- `createVehicle()` - Crear vehículo
- `updateVehicle()` - Actualizar vehículo
- `deleteVehicle()` - Eliminar vehículo

### SimulationService
- `createSimulation()` - Nueva simulación
- `getSimulations()` - Lista de simulaciones
- `quickSimulation()` - Simulación rápida
- `calculatePayment()` - Cálculo de cuota

### LoanService
- `getLoanApplications()` - Lista de solicitudes
- `createLoanApplication()` - Nueva solicitud
- `submitLoanApplication()` - Enviar solicitud
- `uploadDocument()` - Cargar documentos

Y más servicios con funcionalidades específicas...

## 🎨 Componentes UI

### Reutilizables
- **Button** - Botón con variantes y estados
- **Input** - Input con validación y error
- **Modal** - Modal responsive
- **Toast** - Notificaciones temporales

### Layout
- **AppLayout** - Layout principal con sidebar
- **Sidebar** - Navegación lateral colapsible
- **Navbar** - Barra superior con breadcrumbs

## 🔧 Personalización

### Agregar Nueva Funcionalidad
1. Crear servicio en `/services/`
2. Agregar tipos en `/types/automotive-loan.ts`
3. Crear página en `/pages/`
4. Agregar ruta en `/routes/AppRoutes.tsx`
5. Actualizar sidebar en `/components/layout/Sidebar.tsx`

### Conectar con Microservicio Real
1. Actualizar URL en `.env`
2. Ajustar tipos si es necesario
3. Manejar responses específicas del backend

## 🚀 Despliegue

El proyecto está listo para despliegue en:
- **AWS Amplify** (usando `amplify.yml`)
- **AWS S3 + CloudFront** (usando `deploy.sh`)
- **Docker** (usando `Dockerfile`)

```bash
# Build para producción
npm run build

# Deploy a AWS
npm run deploy:production
```

## ✅ Estado Actual

**Todo el scaffolding está completo y listo para:**
- ✅ Conectar con microservicios reales
- ✅ Personalizar según necesidades específicas
- ✅ Agregar más funcionalidades
- ✅ Desplegar en producción
- ✅ Escalar para más módulos

El sistema está diseñado siguiendo arquitectura limpia, buenas prácticas y listo para un entorno de producción empresarial.