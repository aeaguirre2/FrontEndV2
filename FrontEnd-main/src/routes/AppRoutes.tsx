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
import CreateLoanPage from '../pages/loans/CreateLoanPage';
import SimulationPage from '../pages/loans/SimulationPage';

// Analysis
import AnalysisPage from '../pages/analysis/AnalysisPage';

// Contracts
import ContractsPage from '../pages/contracts/ContractsPage';

// Concesionarios
import ConcesionariosPage from '../pages/concesionarios/ConcesionariosPage';

// Vendedores
import VendedoresPage from '../pages/vendedores/VendedoresPage';

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
      <Route 
        path="/loans/create" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateLoanPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loans/simulate/:numeroSolicitud" 
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
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;