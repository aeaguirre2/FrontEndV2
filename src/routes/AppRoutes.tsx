import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from '../constants';

// Pages
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';

// Admin Pages

import UserManagementPage from '../pages/admin/UserManagementPage';

// Vehicles
import VehiclesPage from '../pages/vehicles/VehiclesPage';

// Products
import ProductsPage from '../pages/products/ProductsPage';
import InterestRatesPage from '../pages/products/InterestRatesPage';



// Loans
import LoansPage from '../pages/loans/LoansPage';
import CreateLoanPage from '../pages/loans/CreateLoanPage';
import SimulationPage from '../pages/loans/SimulationPage';

// Analysis
import AnalysisPage from '../pages/analysis/AnalysisPage';

// Riesgo Crediticio
import RiesgoCreditoPage from '../pages/riesgo-credito/RiesgoCreditoPage';
import RiesgoCreditoAdminPage from '../pages/riesgo-credito/RiesgoCreditoAdminPage';

// Contracts
import ContractsPage from '../pages/contracts/ContractsPage';

// Concesionarios
import ConcesionariosPage from '../pages/concesionarios/ConcesionariosPage';

// Vendedores
import VendedoresPage from '../pages/vendedores/VendedoresPage';

// Documentation
import DocumentationPage from '../pages/documentation/DocumentationPage';
import DocumentationListPage from '../pages/documentation/DocumentationListPage';
import DocumentationValidationPage from '../pages/documentation/DocumentationValidationPage';
import ContractUploadPage from '../pages/documentation/ContractUploadPage';
import ContractsValidationPage from '../pages/documentation/ContractsValidationPage';

// Desembolsos
import DesembolsosPage from '../pages/desembolsos/DesembolsosPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/api/banco-frontend/login" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route 
        path="/api/banco-frontend/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/api/banco-frontend/admin/users" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout>
              <UserManagementPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Main route - redirect to dashboard */}
      <Route 
        path="/api/banco-frontend/" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/api/banco-frontend/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Vehicles */}
      <Route 
        path="/api/banco-frontend/vehicles" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <VehiclesPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Products */}
      <Route 
        path="/api/banco-frontend/products" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProductsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/api/banco-frontend/products/interest" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterestRatesPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      
      {/* Loans */}
      <Route 
        path="/api/banco-frontend/loans" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <LoansPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/api/banco-frontend/loans/create" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateLoanPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/api/banco-frontend/loans/simulate/:numeroSolicitud" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <SimulationPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Analysis */}
      <Route 
        path="/api/banco-frontend/analysis" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <AnalysisPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Riesgo Crediticio */}
      <Route 
        path="/api/banco-frontend/riesgo-credito" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <RiesgoCreditoPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/api/banco-frontend/riesgo-credito/admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout>
              <RiesgoCreditoAdminPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Contracts */}
      <Route 
        path="/api/banco-frontend/contracts" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ContractsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Concesionarios */}
      <Route 
        path="/api/banco-frontend/concesionarios" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ConcesionariosPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Vendedores */}
      <Route 
        path="/api/banco-frontend/vendedores" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <VendedoresPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Documentation */}
      {/* 1. Listado de solicitudes */}
      <Route
        path="/api/banco-frontend/documentation"
        element={<ProtectedRoute><AppLayout><DocumentationListPage /></AppLayout></ProtectedRoute>}
      />
      {/* 2. Subir los 3 docs */}
      <Route
        path="/api/banco-frontend/documentation/:numeroSolicitud"
        element={
          <ProtectedRoute>
            <AppLayout><DocumentationPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      {/* 3. Validar los 3 docs */}
      <Route
        path="/api/banco-frontend/documentation/:numeroSolicitud/validacion"
        element={
          <ProtectedRoute>
            <AppLayout><DocumentationValidationPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      {/* 4. Subir contrato y pagaré */}
      <Route
        path="/api/banco-frontend/documentation/:numeroSolicitud/contratos"
        element={
          <ProtectedRoute>
            <AppLayout><ContractUploadPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 5. Validar contrato y pagaré */}
      <Route path="/api/banco-frontend/documentation/:numeroSolicitud/contratos/validacion"
        element={
          <ProtectedRoute>
            <AppLayout><ContractsValidationPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Desembolsos */}
      <Route 
        path="/api/banco-frontend/desembolsos" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <DesembolsosPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;