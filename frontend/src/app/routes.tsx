import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { Button, Card, Badge, Spinner } from '../components/ui';
import { useAuthStore } from '../store/authStore';

// Auth Components
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import VerifyOTP from '../pages/auth/VerifyOTP';
import TwoFactorLogin from '../pages/auth/TwoFactorLogin';
import ChangePassword from '../pages/auth/ChangePassword';
import TwoFactorSetup from '../pages/auth/TwoFactorSetup';
import AccountLockout from '../pages/auth/AccountLockout';
import Disable2FA from '../pages/auth/Disable2FA';
import SessionExpired from '../pages/auth/SessionExpired';
import RecoveryCodes from '../pages/auth/RecoveryCodes';
import ActiveSessions from '../pages/auth/ActiveSessions';
import VerifyEmailPending from '../pages/auth/VerifyEmailPending';
import EmailVerificationCenter from '../pages/auth/EmailVerificationCenter';
import SecurityLogs from '../pages/auth/SecurityLogs';
import DeviceManagement from '../pages/auth/DeviceManagement';
import EmergencyRecovery from '../pages/auth/EmergencyRecovery';

// Error Components  
import NotFound from '../pages/errors/NotFound';
import AccessDenied from '../pages/errors/AccessDenied';

// Main Pages
import Dashboard from '../pages/dashboard/Dashboard';
import PolicyList from '../pages/policies/PolicyList';
import PolicyUpload from '../pages/policies/PolicyUpload';
import ControlsPage from '../pages/controls/Controls';
import ReportsPage from '../pages/reports/Reports';
import SettingsPage from '../pages/settings/Settings';
import ProfilePage from '../pages/profile/Profile';
import BillingOverview from '../pages/billing/BillingOverview';
import PlanComparison from '../pages/billing/PlanComparison';
import Invoices from '../pages/billing/Invoices';
import AuthDebug from '../pages/debug/AuthDebug';

// Enhanced placeholder components demonstrating UI components
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <Badge variant="primary">{title === 'Dashboard' ? 'Live' : 'Coming Soon'}</Badge>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Preview</h3>
        <p className="text-gray-600 mb-4">This {title.toLowerCase()} page will include comprehensive functionality.</p>
        <div className="space-y-2">
          <Button variant="primary" size="sm" fullWidth>Primary Action</Button>
          <Button variant="outline" size="sm" fullWidth>Secondary Action</Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Implementation</span>
            <Badge variant="warning" size="sm">In Progress</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">UI Components</span>
            <Badge variant="success" size="sm">Complete</Badge>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Example</h3>
        <div className="space-y-4">
          <Spinner size="md" text="Loading data..." centered />
          <Button isLoading variant="primary" size="sm" fullWidth>
            Processing...
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/2fa-login" element={<TwoFactorLogin />} />
        <Route path="/account-locked" element={<AccountLockout />} />
        <Route path="/session-expired" element={<SessionExpired />} />
        <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
        <Route path="/email-verification" element={<EmailVerificationCenter />} />
        <Route path="/emergency-recovery" element={<EmergencyRecovery />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Policies */}
        <Route path="/policies" element={<PolicyList />} />
        <Route path="/policies/upload" element={<PolicyUpload />} />
        
        {/* Controls */}
        <Route path="/controls" element={<ControlsPage />} />
        <Route path="/controls/:controlId/evidence" element={<PlaceholderPage title="Evidence Upload" />} />
        
        {/* Reports */}
        <Route path="/reports" element={<ReportsPage />} />
        
        {/* Billing */}
        <Route path="/billing" element={<BillingOverview />} />
        <Route path="/billing/plans" element={<PlanComparison />} />
        <Route path="/billing/invoices" element={<Invoices />} />
        
        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Security/Auth Settings */}
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/setup-2fa" element={<TwoFactorSetup />} />
        <Route path="/disable-2fa" element={<Disable2FA />} />
        <Route path="/recovery-codes" element={<RecoveryCodes />} />
        <Route path="/active-sessions" element={<ActiveSessions />} />
        <Route path="/security-logs" element={<SecurityLogs />} />
        <Route path="/device-management" element={<DeviceManagement />} />
        <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
        <Route path="/email-verification" element={<EmailVerificationCenter />} />
        
        {/* Debug (Development only) */}
        <Route path="/auth-debug" element={<AuthDebug />} />
        
        {/* Error Pages */}
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
};

export default AppRoutes;