import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { Button, Card, Badge, Spinner } from '../components/ui';

// Auth Components
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

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
  // TODO: Replace with actual auth check from authStore
  const isAuthenticated = false; // Authentication restored

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
        
        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Error Pages */}
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
};

export default AppRoutes;