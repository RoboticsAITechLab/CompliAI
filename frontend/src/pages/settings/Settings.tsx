import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'CompliAI Corporation',
    companyEmail: 'admin@compliai.com',
    timezone: 'UTC-5',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      weekly: true,
      monthly: false
    },
    security: {
      mfa: true,
      sessionTimeout: '30',
      passwordExpiry: '90',
      loginAttempts: '3'
    },
    compliance: {
      autoReports: true,
      frameworks: ['SOC2', 'ISO27001', 'GDPR'],
      reportFrequency: 'weekly',
      dataRetention: '7'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'compliance', label: 'Compliance', icon: '📋' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'users', label: 'Users & Roles', icon: '👥' }
  ];

  const frameworks = [
    { id: 'SOC2', name: 'SOC 2', enabled: true },
    { id: 'ISO27001', name: 'ISO 27001', enabled: true },
    { id: 'GDPR', name: 'GDPR', enabled: true },
    { id: 'HIPAA', name: 'HIPAA', enabled: false },
    { id: 'PCI', name: 'PCI DSS', enabled: false },
    { id: 'NIST', name: 'NIST', enabled: false }
  ];

  const integrations = [
    { id: 'slack', name: 'Slack', status: 'connected', icon: '💬' },
    { id: 'teams', name: 'Microsoft Teams', status: 'connected', icon: '👥' },
    { id: 'jira', name: 'Jira', status: 'disconnected', icon: '📋' },
    { id: 'github', name: 'GitHub', status: 'connected', icon: '🐙' },
    { id: 'aws', name: 'AWS', status: 'disconnected', icon: '☁️' },
    { id: 'azure', name: 'Azure', status: 'disconnected', icon: '🔵' }
  ];

  const users = [
    { id: '1', name: 'John Smith', email: 'john@compliai.com', role: 'Admin', status: 'active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@compliai.com', role: 'Manager', status: 'active' },
    { id: '3', name: 'Mike Davis', email: 'mike@compliai.com', role: 'Analyst', status: 'active' },
    { id: '4', name: 'Lisa Chen', email: 'lisa@compliai.com', role: 'Auditor', status: 'inactive' },
    { id: '5', name: 'Tom Wilson', email: 'tom@compliai.com', role: 'Viewer', status: 'active' }
  ];

  const handleSettingChange = (category: string, key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <Input
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Email</label>
            <Input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Select timezone"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Multi-Factor Authentication</p>
              <p className="text-sm text-slate-500">Require MFA for all users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.mfa}
                onChange={(e) => handleSettingChange('security', 'mfa', e.target.checked)}
                className="sr-only peer"
                aria-label="Toggle multi-factor authentication"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password Expiry (days)</label>
              <Input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Login Attempts</label>
              <Input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => handleSettingChange('security', 'loginAttempts', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Compliance Frameworks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworks.map((framework) => (
            <div key={framework.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${framework.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="font-medium text-slate-900">{framework.name}</span>
              </div>
              <Badge variant={framework.enabled ? 'success' : 'default'} size="sm">
                {framework.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Reporting Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Report Frequency</label>
            <select
              value={settings.compliance.reportFrequency}
              onChange={(e) => handleSettingChange('compliance', 'reportFrequency', e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Select report frequency"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data Retention (years)</label>
            <Input
              type="number"
              value={settings.compliance.dataRetention}
              onChange={(e) => handleSettingChange('compliance', 'dataRetention', e.target.value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Third-Party Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="font-medium text-slate-900">{integration.name}</p>
                  <p className="text-sm text-slate-500">
                    {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={integration.status === 'connected' ? 'outline' : 'primary'}
                size="sm"
              >
                {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Users & Roles</h3>
          <Button>Invite User</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary" size="sm">{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.status === 'active' ? 'success' : 'default'} size="sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'security':
        return renderSecurityTab();
      case 'compliance':
        return renderComplianceTab();
      case 'integrations':
        return renderIntegrationsTab();
      case 'users':
        return renderUsersTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your organization's configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}