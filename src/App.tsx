import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { GalaxyCursor } from './components/common/GalaxyCursor';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { StorageDashboard } from './pages/storage/StorageDashboard';
import { TransporterDashboard } from './pages/transporter/TransporterDashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BatchVerificationPage } from './pages/traceability/BatchVerificationPage';

export function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        <AuthProvider>
          <GalaxyCursor />
          <Routes>
          {/* Public Landing & Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Public Blockchain & QR Batch Verification */}
          <Route path="/verify" element={<BatchVerificationPage />} />
          <Route path="/verify/:batchId" element={<BatchVerificationPage />} />

          {/* Role-Protected Dashboards with Team Testing Switcher */}
          <Route
            path="/farmer"
            element={
              <RoleRoute allowedRoles={['FARMER', 'ADMIN']}>
                <FarmerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/storage"
            element={
              <RoleRoute allowedRoles={['STORAGE_PROVIDER', 'ADMIN']}>
                <StorageDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/transporter"
            element={
              <RoleRoute allowedRoles={['TRANSPORTER', 'ADMIN']}>
                <TransporterDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/buyer"
            element={
              <RoleRoute allowedRoles={['BUYER', 'ADMIN']}>
                <BuyerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AuthProvider>
      </LocationProvider>
    </BrowserRouter>
  );
}

export default App;
