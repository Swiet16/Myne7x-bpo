import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { LoadingScreen } from '@/components/ui/EmptyState';
import { ProtectedRoute } from '@/layouts/DashboardLayout';

// Public pages - lazy loaded
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'));
const CustomerSupportPage = lazy(() => import('@/pages/public/services/CustomerSupportPage'));
const CallCenterPage = lazy(() => import('@/pages/public/services/CallCenterPage'));
const LiveChatPage = lazy(() => import('@/pages/public/services/LiveChatPage'));
const EmailSupportPage = lazy(() => import('@/pages/public/services/EmailSupportPage'));
const BackOfficePage = lazy(() => import('@/pages/public/services/BackOfficePage'));
const IndustriesPage = lazy(() => import('@/pages/public/IndustriesPage'));
const IndustryDetailPage = lazy(() => import('@/pages/public/IndustryDetailPage'));
const WhyUsPage = lazy(() => import('@/pages/public/WhyUsPage'));
const CareersPage = lazy(() => import('@/pages/public/CareersPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const RequestQuotePage = lazy(() => import('@/pages/public/RequestQuotePage'));
const BookCallPage = lazy(() => import('@/pages/public/BookCallPage'));
const FAQPage = lazy(() => import('@/pages/public/FAQPage'));
const LegalPage = lazy(() => import('@/pages/public/LegalPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/public/UnauthorizedPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// Dashboard pages
const SuperAdminDashboard = lazy(() => import('@/pages/dashboard/super-admin/SuperAdminDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/admin/AdminDashboard'));
const TeamLeadDashboard = lazy(() => import('@/pages/dashboard/team-lead/TeamLeadDashboard'));
const AgentDashboard = lazy(() => import('@/pages/dashboard/agent/AgentDashboard'));
const ClientDashboard = lazy(() => import('@/pages/dashboard/client/ClientDashboard'));

// Generic dashboard pages
const GenericDashboardPage = lazy(() => import('@/pages/dashboard/GenericDashboardPage'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/customer-support" element={<CustomerSupportPage />} />
              <Route path="/call-center" element={<CallCenterPage />} />
              <Route path="/live-chat" element={<LiveChatPage />} />
              <Route path="/email-support" element={<EmailSupportPage />} />
              <Route path="/back-office" element={<BackOfficePage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/industries/:slug" element={<IndustryDetailPage />} />
              <Route path="/why-us" element={<WhyUsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/request-quote" element={<RequestQuotePage />} />
              <Route path="/book-call" element={<BookCallPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<LegalPage slug="terms" />} />
              <Route path="/privacy" element={<LegalPage slug="privacy" />} />
              <Route path="/cookie-policy" element={<LegalPage slug="cookie-policy" />} />
              <Route path="/refund-policy" element={<LegalPage slug="refund-policy" />} />
              <Route path="/service-agreement" element={<LegalPage slug="service-agreement" />} />
              <Route path="/sla" element={<LegalPage slug="sla" />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Super Admin Routes */}
              <Route path="/dashboard/super-admin" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/:page" element={<ProtectedRoute allowedRoles={['super_admin']}><GenericDashboardPage role="super_admin" /></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/:page/:id" element={<ProtectedRoute allowedRoles={['super_admin']}><GenericDashboardPage role="super_admin" /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/admin/:page" element={<ProtectedRoute allowedRoles={['admin']}><GenericDashboardPage role="admin" /></ProtectedRoute>} />
              <Route path="/dashboard/admin/:page/:id" element={<ProtectedRoute allowedRoles={['admin']}><GenericDashboardPage role="admin" /></ProtectedRoute>} />

              {/* Team Lead Routes */}
              <Route path="/dashboard/team-lead" element={<ProtectedRoute allowedRoles={['team_lead']}><TeamLeadDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/team-lead/:page" element={<ProtectedRoute allowedRoles={['team_lead']}><GenericDashboardPage role="team_lead" /></ProtectedRoute>} />

              {/* Agent Routes */}
              <Route path="/dashboard/agent" element={<ProtectedRoute allowedRoles={['agent']}><AgentDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/agent/:page" element={<ProtectedRoute allowedRoles={['agent']}><GenericDashboardPage role="agent" /></ProtectedRoute>} />

              {/* Client Routes */}
              <Route path="/dashboard/client" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/client/:page" element={<ProtectedRoute allowedRoles={['client']}><GenericDashboardPage role="client" /></ProtectedRoute>} />

              {/* Error routes */}
              <Route path="/403" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
