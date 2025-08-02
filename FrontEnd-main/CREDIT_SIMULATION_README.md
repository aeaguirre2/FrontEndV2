# Simulación de Crédito Automotriz

## Descripción

La página de simulación de crédito permite a los usuarios calcular diferentes escenarios de financiamiento para vehículos automotrices. Utiliza el endpoint de originación para generar simulaciones detalladas con tablas de amortización.

## Funcionalidades

### 1. Selección de Concesionario y Vehículo
- **Concesionario**: Lista desplegable con concesionarios activos
- **Vehículo**: Lista desplegable con vehículos disponibles del concesionario seleccionado
- Información detallada del vehículo seleccionado (placa, marca, modelo, año, valor, condición)

### 2. Parámetros de Simulación
- **Monto Solicitado**: Cantidad a financiar (mínimo $1,000, máximo $100,000)
- **Plazo**: Duración del crédito en meses (12 a 84 meses)
- **Tasa de Interés**: Porcentaje anual (1% a 50%)

### 3. Resultados de Simulación

#### Resumen General
- Información del vehículo y parámetros de la simulación
- Tres escenarios de financiamiento:
  - **Con entrada 20%**: Financiamiento con entrada del 20% del monto solicitado
  - **Sin entrada**: Financiamiento del 100% del monto solicitado
  - **Plazo máximo para menor cuota**: Financiamiento con plazo extendido

#### Tablas de Amortización
- **Con Entrada 20%**: Tabla completa de cuotas con entrada
- **Sin Entrada**: Tabla completa de cuotas sin entrada
- **Plazo Máximo**: Tabla completa con plazo extendido

Cada tabla muestra:
- Número de cuota
- Saldo inicial
- Cuota mensual
- Abono a capital
- Interés
- Saldo final

## Endpoints Utilizados

### Simulación de Crédito
```
POST /api/v1/solicitudes/simular
```

**Request:**
```json
{
  "placaVehiculo": "PBQ3421",
  "rucConcesionario": "1723456776001",
  "montoSolicitado": 15000.00,
  "plazoMeses": 36,
  "tasaInteres": 15
}
```

**Response:**
```json
{
  "placaVehiculo": "PBQ3421",
  "rucConcesionario": "1723456776001",
  "valorVehiculo": 20500,
  "montoSolicitado": 15000.00,
  "plazoOriginal": 36,
  "tasaInteres": 0.1500,
  "resumenEscenarios": [...],
  "tablaConEntrada20": [...],
  "tablaSinEntrada": [...],
  "tablaPlazoMaximo": [...]
}
```

### Concesionarios
```
GET /concesionarios/estado/{estado}
```

### Vehículos por Concesionario
```
GET /concesionarios/ruc/{ruc}/vehiculos/estado/{estado}
```

## Configuración

### Variables de Entorno
Asegúrate de tener configuradas las siguientes variables en tu archivo `.env`:

```env
VITE_ORIGINACION_SERVICE_URL=http://ec2-18-223-158-69.us-east-2.compute.amazonaws.com:8081
VITE_VEHICULOS_SERVICE_URL=http://ec2-18-223-158-69.us-east-2.compute.amazonaws.com:8082
```

## Uso

1. **Seleccionar Concesionario**: Elige un concesionario de la lista desplegable
2. **Seleccionar Vehículo**: Una vez seleccionado el concesionario, elige un vehículo disponible
3. **Configurar Parámetros**: Ingresa el monto solicitado, plazo y tasa de interés
4. **Generar Simulación**: Haz clic en "Simular Crédito"
5. **Revisar Resultados**: Navega entre las pestañas para ver diferentes vistas de los resultados

## Características Técnicas

- **Framework**: React con TypeScript
- **Formularios**: React Hook Form con validación Zod
- **Estilos**: Tailwind CSS
- **Estado**: React Hooks
- **HTTP Client**: Axios
- **Validación**: Esquemas Zod para validación de formularios

## Validaciones

- **Placa de Vehículo**: Campo obligatorio
- **RUC de Concesionario**: Campo obligatorio
- **Monto Solicitado**: Entre $1,000 y $100,000
- **Plazo**: Entre 12 y 84 meses
- **Tasa de Interés**: Entre 1% y 50%

## Componentes Utilizados

- `CreditSimulationPage`: Página principal de simulación
- `Button`: Botón reutilizable con estados de carga
- `Input`: Campo de entrada con validación
- `useApi`: Hook personalizado para manejo de API

## Servicios

- `originacionService`: Servicio para simulación de crédito
- `concesionarioApiService`: Servicio para concesionarios y vehículos

## Notas de Desarrollo

- La página está optimizada para pantallas grandes (lg:grid-cols-2)
- Los resultados se muestran en pestañas para mejor organización
- Las tablas de amortización muestran las primeras 12 cuotas por defecto
- Se incluyen mensajes de éxito y manejo de errores
- La interfaz es responsive y accesible 