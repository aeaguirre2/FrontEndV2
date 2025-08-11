import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';

// Vehicles
import VehiclesPage from '../pages/vehicles/VehiclesPage';

// Products
import ProductsPage from '../pages/products/ProductsPage';
import InterestRatesPage from '../pages/products/InterestRatesPage';

// Simulation
import CreditSimulationPage from '../pages/simulation/CreditSimulationPage';

// Loans
import LoansPage from '../pages/loans/LoansPage';

// Analysis
import AnalysisPage from '../pages/analysis/AnalysisPage';

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

// Constants

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
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
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
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
        path="/vehicles"
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
        path="/products"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProductsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/interest"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterestRatesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Credit Simulation */}
      <Route
        path="/credit-simulation"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreditSimulationPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Loans */}
      <Route
        path="/loans"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LoansPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Analysis */}
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AnalysisPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Contracts */}
      <Route
        path="/contracts"
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
        path="/concesionarios"
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
        path="/vendedores"
        element={
          <ProtectedRoute>
            <AppLayout>
              <VendedoresPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />


      {/* 1. Listado de solicitudes */}
      <Route
        path="/documentation"
        element={<ProtectedRoute><AppLayout><DocumentationListPage /></AppLayout></ProtectedRoute>}
      />
      {/* 2. Subir los 3 docs */}
      <Route
        path="/documentation/:numeroSolicitud"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout><DocumentationPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      {/* 3. Validar los 3 docs */}
      <Route
        path="/documentation/:numeroSolicitud/validacion"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout><DocumentationValidationPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      {/* 4. Subir contrato y pagaré */}
      <Route
        path="/documentation/:numeroSolicitud/contratos"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout><ContractUploadPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 5. Validar contrato y pagaré */}
      <Route path="/documentation/:numeroSolicitud/contratos/validacion"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AppLayout><ContractsValidationPage /></AppLayout>
          </ProtectedRoute>
        }
      />




      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;