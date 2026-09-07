import { Navigate, Route, Routes } from 'react-router-dom'
import { KioskFlow } from './kiosk/KioskFlow'
import { LoginPage } from './auth/LoginPage'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { SecretariatDashboard } from './secretariat/SecretariatDashboard'
import { RegisterPage } from './secretariat/RegisterPage'
import { SecurityDashboard } from './security/SecurityDashboard'
import { AdminDashboard } from './admin/AdminDashboard'
import { EmployeesPage } from './admin/EmployeesPage'
import { LocationsPage } from './admin/LocationsPage'
import { HistoryPage } from './admin/HistoryPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<KioskFlow />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/secretariat"
        element={
          <ProtectedRoute allowedRoles={['SECRETARIAT', 'ADMIN']}>
            <SecretariatDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/secretariat/registre"
        element={
          <ProtectedRoute allowedRoles={['SECRETARIAT', 'ADMIN']}>
            <RegisterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security"
        element={
          <ProtectedRoute allowedRoles={['SECURITY', 'ADMIN']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EmployeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/locations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <LocationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
