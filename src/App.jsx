import { Routes, Route, Navigate } from 'react-router-dom'

// Auth
import LoginPage from './pages/auth/LoginPage'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import DashboardHome from './pages/dashboard/DashboardHome'
import ZoneApproval from './pages/zones/ZoneApproval'
import VendorManagement from './pages/vendors/VendorManagement'
import ManualSettlement from './pages/settlements/ManualSettlement'
import PlatformAnalytics from './pages/analytics/PlatformAnalytics'
import SupportManagement from './pages/support/SupportManagement'
//import CustomerManagement from './pages/customers/CustomerManagement'

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Panel */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="zones" element={<ZoneApproval />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="settlements" element={<ManualSettlement />} />
        <Route path="analytics" element={<PlatformAnalytics />} />
        <Route path="support" element={<SupportManagement />} />
        {/* <Route path="customers" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  )
}

export default App