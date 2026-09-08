import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { AdminPage } from './pages/AdminPage';
import ExperiencesPage from './pages/ExperiencesPage';
import GuidesStaysPage from './pages/GuidesStaysPage';
import SafetyHubPage from './pages/SafetyHubPage';
import EcoPortalPage from './pages/EcoPortalPage';
import ReviewsHubPage from './pages/ReviewsHubPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#162019',
              color: '#e8efe9',
              border: '1px solid rgba(29, 185, 84, 0.12)',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#1db954', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#e74c3c', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/guides-stays" element={<GuidesStaysPage />} />
          <Route path="/safety-hub" element={<SafetyHubPage />} />
          <Route path="/eco-portal" element={<EcoPortalPage />} />
          <Route path="/reviews-hub" element={<ReviewsHubPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
